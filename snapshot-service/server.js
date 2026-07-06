/**
 * 总赛程全览图截图服务
 *
 * GET /schedule/total?categoryId=8 -> image/png
 * GET /health                      -> 服务与缓存状态
 *
 * 流程：打开前端快照页（?snapshot=1，页面自然撑开、无滚动），
 * 等待 window.__RENDER_DONE__ 标记后按内容实际尺寸截图。
 *
 * 并发保护：
 *  - 内存 TTL 缓存：TTL 内直接返回，毫秒级响应
 *  - 请求合并：同一 categoryId 同时只有一个截图任务，并发请求共享结果
 *  - 失败降级：截图失败时若有旧图（即使过期）返回旧图
 */
const express = require('express');
const { chromium } = require('playwright');

// ---- 配置（环境变量可覆盖）----
const PORT = Number(process.env.PORT || 3100);
// 前端站点地址，容器内访问宿主机 nginx 时形如 http://172.17.0.1/schedule
const FRONTEND_BASE = (process.env.FRONTEND_BASE || 'https://www.sichuan15sports.cn/schedule').replace(/\/+$/, '');
const TTL_MS = Number(process.env.TTL_MS || 5 * 60 * 1000);
const SCALE = Number(process.env.SCALE || 2);               // deviceScaleFactor，2 = Retina 清晰度
const MAX_VIEWPORT = Number(process.env.MAX_VIEWPORT || 12000); // 视口宽高上限（CSS px）
const NAV_TIMEOUT_MS = Number(process.env.NAV_TIMEOUT_MS || 60000);
const RENDER_TIMEOUT_MS = Number(process.env.RENDER_TIMEOUT_MS || 30000);
// 启动预热的组别（青少年=8，群众=7），留空则不预热
const WARMUP_CATEGORY_IDS = (process.env.WARMUP_CATEGORY_IDS || '8,7')
  .split(',').map(s => s.trim()).filter(Boolean);
// 多个开放比赛时可显式指定，单个开放比赛时前端会自动选中
const GAME_ID = process.env.GAME_ID || '';

// ---- 缓存与请求合并 ----
const cache = new Map();    // categoryId -> { buffer, time }
const inflight = new Map(); // categoryId -> Promise<Buffer>

// ---- 浏览器单例（崩溃后自动重建）----
let browserPromise = null;

function getBrowser() {
  if (!browserPromise) {
    browserPromise = chromium.launch({ headless: true }).then(browser => {
      browser.on('disconnected', () => { browserPromise = null; });
      return browser;
    }).catch(err => {
      browserPromise = null;
      throw err;
    });
  }
  return browserPromise;
}

function buildSnapshotUrl(categoryId) {
  const redirect = encodeURIComponent('/schedule/total?snapshot=1');
  const gamePart = GAME_ID ? `&gameId=${GAME_ID}` : '';
  return `${FRONTEND_BASE}/#/bind?categoryId=${categoryId}${gamePart}&redirect=${redirect}`;
}

async function capture(categoryId) {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: SCALE,
  });
  try {
    const page = await context.newPage();
    await page.goto(buildSnapshotUrl(categoryId), {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT_MS,
    });

    // 等待前端数据渲染完成标记（快照模式下由 ScrollTotalSchedule 设置）
    await page.waitForFunction('window.__RENDER_DONE__ === true', null, {
      timeout: RENDER_TIMEOUT_MS,
    });
    // 等待项目图标等图片加载结束（complete 对加载失败的图片同样为 true，不会卡死）
    await page.waitForFunction(
      () => Array.from(document.images).every(img => img.complete),
      null, { timeout: 15000 },
    ).catch(() => {});

    // 按内容实际尺寸设置视口，保证一次性完整截图
    const size = await page.evaluate(() => ({
      width: Math.ceil(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)),
      height: Math.ceil(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)),
    }));
    await page.setViewportSize({
      width: Math.min(Math.max(size.width, 800), MAX_VIEWPORT),
      height: Math.min(Math.max(size.height, 600), MAX_VIEWPORT),
    });
    await page.waitForTimeout(300); // 视口变化后留一帧渲染余量

    return await page.screenshot({ fullPage: true, type: 'png', animations: 'disabled' });
  } finally {
    await context.close().catch(() => {});
  }
}

async function getImage(categoryId) {
  const hit = cache.get(categoryId);
  if (hit && Date.now() - hit.time < TTL_MS) {
    return { buffer: hit.buffer, time: hit.time, stale: false };
  }
  if (inflight.has(categoryId)) {
    const buffer = await inflight.get(categoryId);
    return { buffer, time: cache.get(categoryId).time, stale: false };
  }

  const task = capture(categoryId).then(buffer => {
    cache.set(categoryId, { buffer, time: Date.now() });
    return buffer;
  }).finally(() => {
    inflight.delete(categoryId);
  });
  inflight.set(categoryId, task);

  try {
    const buffer = await task;
    return { buffer, time: cache.get(categoryId).time, stale: false };
  } catch (err) {
    if (hit) { // 失败降级：返回过期旧图
      console.error(`[capture] categoryId=${categoryId} 失败，返回旧图:`, err.message);
      return { buffer: hit.buffer, time: hit.time, stale: true };
    }
    throw err;
  }
}

// ---- HTTP ----
const app = express();

app.get('/schedule/total', async (req, res) => {
  const categoryId = String(req.query.categoryId || '');
  if (!/^\d+$/.test(categoryId)) {
    return res.status(400).json({ code: 400, msg: 'categoryId 必须为正整数' });
  }
  try {
    const { buffer, time, stale } = await getImage(categoryId);
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=60',
      'X-Generated-At': new Date(time).toISOString(),
      ...(stale ? { 'X-Snapshot-Stale': '1' } : {}),
    });
    res.send(buffer);
  } catch (err) {
    console.error(`[capture] categoryId=${categoryId} 失败且无旧图:`, err);
    res.status(503).json({ code: 503, msg: '截图生成失败，请稍后重试' });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'up',
    frontendBase: FRONTEND_BASE,
    ttlMs: TTL_MS,
    cache: [...cache.entries()].map(([id, v]) => ({
      categoryId: id,
      generatedAt: new Date(v.time).toISOString(),
      bytes: v.buffer.length,
      expired: Date.now() - v.time >= TTL_MS,
    })),
  });
});

const server = app.listen(PORT, () => {
  console.log(`snapshot-service listening on :${PORT}, frontend=${FRONTEND_BASE}`);
  // 启动预热，串行生成避免瞬时高负载
  (async () => {
    for (const id of WARMUP_CATEGORY_IDS) {
      try {
        await getImage(id);
        console.log(`[warmup] categoryId=${id} done`);
      } catch (err) {
        console.error(`[warmup] categoryId=${id} 失败:`, err.message);
      }
    }
  })();
});

process.on('SIGTERM', async () => {
  server.close();
  if (browserPromise) {
    const browser = await browserPromise.catch(() => null);
    if (browser) await browser.close().catch(() => {});
  }
  process.exit(0);
});
