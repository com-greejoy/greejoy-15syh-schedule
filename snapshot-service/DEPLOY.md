# 总赛程全览图 - 上线操作指南

分工：**你手动做** 第 1、2 步（dist 重命名、nginx 配置），**已由 Agent 完成** 第 3 步（镜像构建与容器启动），第 4 步为联合验证。

---

## 背景与整体结构

```
移动端 <img src="https://www.sichuan15sports.cn/syh/snapshot/schedule/total?categoryId=8">
   │
   ▼
openresty（host 网络模式，容器名 1Panel-openresty）
   │  location /syh/snapshot/  →  proxy_pass http://127.0.0.1:3100/
   ▼
schedule-snapshot 容器（Playwright + Express，端口 3100 仅绑定 127.0.0.1）
   │  打开 https://www.sichuan15sports.cn/schedule/#/bind?categoryId=X&redirect=...snapshot=1
   ▼
返回 PNG（内存缓存 5 分钟，失败降级返回旧图）
```

组别参数：青少年组 `categoryId=8`，群众组 `categoryId=7`。

---

## 第 1 步：前端版本切换（你手动）

新版前端（含快照模式）已部署到：

```
/opt/1panel/www/sites/schedule/dist      ← 新版（app.7d6b2981.js）
/opt/1panel/www/sites/schedule/index     ← 线上当前版本（app.85eecb90.js）
/opt/1panel/www/sites/schedule/index-    ← 更早的备份
```

nginx 的 `syh-schedule.conf` alias 指向 `/www/sites/schedule/index`，所以切换方式为目录重命名：

```bash
cd /opt/1panel/www/sites/schedule
mv index index.bak.260706   # 备份当前线上版本
mv dist index               # 新版生效
```

静态文件切换即时生效，无需 reload nginx。

**回滚**：`mv index dist && mv index.bak.260706 index`

---

## 第 2 步：nginx 反代配置（你手动）

新建文件 `/opt/1panel/www/sites/www.sichuan15sports.cn/proxy/syh-snapshot.conf`：

```nginx
location /syh/snapshot/ {
    proxy_pass http://127.0.0.1:3100/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
    add_header Strict-Transport-Security "max-age=31536000";
}
```

说明：

- `proxy_pass` 末尾带 `/`：`/syh/snapshot/schedule/total` → 容器内 `/schedule/total`
- `proxy_read_timeout 60s`：冷生成截图约 7~10 秒，留足余量
- openresty 是 host 网络模式，`127.0.0.1:3100` 可直达容器

然后重载 nginx（1Panel 界面操作，或命令行）：

```bash
docker exec 1Panel-openresty nginx -t && docker exec 1Panel-openresty nginx -s reload
```

---

## 第 3 步：截图服务容器（已由 Agent 完成，此处留档）

**当前状态**：镜像 `schedule-snapshot:1.0.0` 已加载到服务器，容器已启动（`docker ps` 可见 `schedule-snapshot`），`/health` 返回正常。

镜像采用瘦身方案：`node:20-slim` + 仅 Chromium Headless Shell，1.39GB（官方 playwright 全家桶镜像 2.2GB+，含用不到的 Firefox/WebKit）。

**构建方式为本地构建 + 上传**（服务器到 npm/Playwright CDN 网络慢，线上构建 20 分钟+，本地仅 2 分钟）：

```powershell
# 本地（Windows，snapshot-service 目录）
docker build -t schedule-snapshot:1.0.0 .
docker save schedule-snapshot:1.0.0 -o C:\workspace\tmp\schedule-snapshot-1.0.0.tar
docker run --rm -v c:\workspace\tmp:/data alpine gzip -f /data/schedule-snapshot-1.0.0.tar
scp -i ~/.ssh/id_ed25519_15syh C:\workspace\tmp\schedule-snapshot-1.0.0.tar.gz root@1.95.115.1:/tmp/

# 服务器
gunzip -c /tmp/schedule-snapshot-1.0.0.tar.gz | docker load && rm -f /tmp/schedule-snapshot-1.0.0.tar.gz
```

启动命令（已执行）：

```bash
docker run -d --name schedule-snapshot --restart unless-stopped \
  -p 127.0.0.1:3100:3100 \
  -e FRONTEND_BASE=https://www.sichuan15sports.cn/schedule \
  -e WARMUP_CATEGORY_IDS=8,7 \
  schedule-snapshot:1.0.0
```

要点：

- 端口只绑 `127.0.0.1`，外部无法直连，只能走 nginx 反代
- 启动时自动预热两个组别的图；**在第 1 步前端切换完成之前预热会超时失败**（旧版前端没有快照模式）——这不影响服务，前端切换后的首个请求会正常生成
- 环境变量说明见 `README.md`（TTL、清晰度、gameId 等均可调）

**更新服务代码时**：本地改 `server.js` 后重复上面「本地构建 + 上传」流程（改版本号 tag），服务器上：

```bash
docker rm -f schedule-snapshot
# 然后用新 tag 重新执行启动命令
```

---

## 第 4 步：验证

```bash
# 1. 容器健康（服务器上执行）
curl -s http://127.0.0.1:3100/health
# 期望：{"status":"up", ..., "cache":[两个组别的条目]}

# 2. 直连容器出图
curl -s -o /tmp/snap8.png -w "%{http_code} %{size_download}B\n" \
  "http://127.0.0.1:3100/schedule/total?categoryId=8"
# 期望：200，几百 KB

# 3. 走 nginx 反代（任意机器）
curl -s -o snap.png -w "%{http_code}\n" \
  "https://www.sichuan15sports.cn/syh/snapshot/schedule/total?categoryId=8"
# 期望：200，打开 snap.png 是完整展开的总赛程长图
```

浏览器直接访问也行：`https://www.sichuan15sports.cn/syh/snapshot/schedule/total?categoryId=8`

同时回归检查普通页面未受影响：`https://www.sichuan15sports.cn/schedule/#/schedule/total`（应仍是滚动交互样式，页头导航正常）。

---

## 移动端接入契约

```
GET /syh/snapshot/schedule/total?categoryId={8|7}
响应: image/png（约 300~700KB，9280px 宽高清长图）
响应头: X-Generated-At = 图片生成时间（ISO8601）
        X-Snapshot-Stale: 1 = 本次为降级旧图（截图服务临时故障时）
失败:  503 JSON（无缓存且生成失败，前端可提示稍后重试）
```

接入示例：点击按钮后新窗口打开该 URL，或 `<img>` 嵌入弹层由用户捏合缩放查看。

---

## 常见问题

| 现象 | 排查 |
|------|------|
| 503 截图生成失败 | `docker logs schedule-snapshot --tail 50`，常见原因：前端未切换新版（无 `__RENDER_DONE__` 标记，等待超时） |
| 图片是旧数据 | 正常，TTL 5 分钟内返回缓存；需要立即刷新可 `docker restart schedule-snapshot` |
| 图上没有标题条/仍是滚动样式 | 第 1 步没做或浏览器缓存，确认 `index/js/app.*.js` 的 hash 是 `7d6b2981` |
| 内存担忧 | 单容器峰值约 1GB（截图瞬间），平时几百 MB；30G 内存无压力 |
