# 瘦身版：只安装 Chromium Headless Shell（无头截图专用精简浏览器），
# 跳过官方 playwright 全家桶镜像中的 Firefox/WebKit/完整版 Chromium，体积约省一半以上
FROM node:20-slim

WORKDIR /app
COPY package.json ./
# 设置容器时区为北京时间，保证截图中的"生成时间"与北京时间一致
ENV TZ=Asia/Shanghai
RUN npm install --omit=dev \
    && npx playwright install --only-shell --with-deps chromium \
    # 中文字体（表格文字、项目名称渲染）和时区数据
    && apt-get update && apt-get install -y --no-install-recommends fonts-noto-cjk tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

COPY server.js ./

ENV PORT=3100
EXPOSE 3100

CMD ["node", "server.js"]
