# 总赛程全览图截图服务

打开前端快照页（`/schedule/total?snapshot=1`，页面全展开、无滚动），用 headless Chromium 截图并返回 PNG。内置内存 TTL 缓存（默认 5 分钟）、并发请求合并、失败返回旧图降级。

## API

```
GET /schedule/total?categoryId=8   -> image/png（青少年组=8，群众组=7）
GET /health                        -> 服务与缓存状态 JSON
```

响应头：`X-Generated-At` 图片生成时间；`X-Snapshot-Stale: 1` 表示本次为降级返回的旧图。

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3100` | 监听端口 |
| `FRONTEND_BASE` | `https://www.sichuan15sports.cn/schedule` | 前端站点地址，服务器部署时建议指向本机 nginx |
| `TTL_MS` | `300000` | 缓存有效期（毫秒） |
| `SCALE` | `2` | deviceScaleFactor，2 = 高清 |
| `WARMUP_CATEGORY_IDS` | `8,7` | 启动时预热的组别，留空不预热 |
| `GAME_ID` | 空 | 多个开放比赛时显式指定，单个时前端自动选中 |

## 本地运行

```bash
cd snapshot-service
npm install
npx playwright install chromium   # 首次需要
npm start
# 验证：http://127.0.0.1:3100/schedule/total?categoryId=8
```

## 服务器部署（1.95.115.1）

镜像基于 `node:20-slim` + Chromium Headless Shell（`--only-shell`），1.39GB，不含 Firefox/WebKit。

采用本地构建 + `docker save/load` 上传（服务器外网下载慢），完整上线步骤见 `DEPLOY.md`。

nginx 增加反代（挂到 www.sichuan15sports.cn 站点配置）：

```nginx
location /syh/snapshot/ {
    proxy_pass http://127.0.0.1:3100/;
    proxy_read_timeout 60s;
}
```

移动端接入：

```html
<img src="https://www.sichuan15sports.cn/syh/snapshot/schedule/total?categoryId=8">
```
