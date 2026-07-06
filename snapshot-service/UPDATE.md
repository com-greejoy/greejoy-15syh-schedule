# 日常更新流程

首次上线见 `DEPLOY.md`。日常改动只有两条路径，按需执行。

---

## 路径 A：改了前端（页面/快照样式，src 目录下任何文件）

```powershell
# 本地打包 + 上传（项目根目录执行，输出到服务器 dist 目录）
python .agents/skills/frontend-deploy/scripts/deploy.py
```

```bash
# 服务器上切换生效（nginx alias 指向 index，静态切换即时生效）
cd /opt/1panel/www/sites/schedule
mv index index.bak.$(date +%y%m%d%H%M)
mv dist index

# 可选：让截图缓存立即失效（不做的话最多 5 分钟后自然过期）
docker restart schedule-snapshot
```

验证：

```bash
curl -s https://www.sichuan15sports.cn/schedule/ | grep -o 'app\.[a-f0-9]*\.js'   # hash 应变化
```

回滚：`cd /opt/1panel/www/sites/schedule && mv index dist && mv index.bak.XXXX index`
（旧备份目录攒多了可定期清理 `index.bak.*`）

---

## 路径 B：改了截图服务（snapshot-service/server.js 等）

```powershell
# 本地构建 + 导出 + 上传（snapshot-service 目录执行；改动大时建议递增 tag 版本号）
docker build -t schedule-snapshot:1.0.0 .
docker save schedule-snapshot:1.0.0 -o C:\workspace\tmp\schedule-snapshot.tar
docker run --rm -v c:\workspace\tmp:/data alpine gzip -f /data/schedule-snapshot.tar
scp -i ~/.ssh/id_ed25519_15syh C:\workspace\tmp\schedule-snapshot.tar.gz root@1.95.115.1:/tmp/
```

```bash
# 服务器上加载并重建容器
gunzip -c /tmp/schedule-snapshot.tar.gz | docker load && rm -f /tmp/schedule-snapshot.tar.gz
docker rm -f schedule-snapshot
docker run -d --name schedule-snapshot --restart unless-stopped \
  -p 127.0.0.1:3100:3100 \
  -e FRONTEND_BASE=https://www.sichuan15sports.cn/schedule \
  -e WARMUP_CATEGORY_IDS=8,7 \
  schedule-snapshot:1.0.0
```

验证：

```bash
curl -s http://127.0.0.1:3100/health                                              # status: up
curl -s -o /tmp/t.png -w "%{http_code}\n" \
  "https://www.sichuan15sports.cn/syh/snapshot/schedule/total?categoryId=8"       # 200
```

注意：为什么不在服务器上直接 `docker build`——服务器到 npm/Playwright CDN 下载极慢（实测 20 分钟+），本地构建 2 分钟 + 上传 6 分钟更快。

---

## 快速排查

```bash
docker logs schedule-snapshot --tail 50    # 截图失败原因
docker restart schedule-snapshot           # 清空图片缓存 / 服务异常时重启
```

| 现象 | 原因 |
|------|------|
| 503 且日志有 waitForFunction Timeout | 前端没切换到含快照模式的版本（路径 A 没做完） |
| 图片是旧数据 | TTL 5 分钟内属正常，急用就 restart |
| 图片样式不对 | 改了前端但只做了路径 A 第一步，没做 mv 切换 |
