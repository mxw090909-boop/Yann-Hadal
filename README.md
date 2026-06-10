# 我们的家

蔺知砚 + 蔺年，七个页面，一扇窗户。

## 页面

| 路径 | 内容 | 数据来源 |
|------|------|---------|
| `/` | 首页 · 心电图 + 快速入口 | 本地时间 |
| `/dream` | 梦境 · 蔺知砚的自省记录 | lin-brain `/dream` |
| `/heartbeat` | 心跳 · 每小时唤起记录 | lin-brain `/breath` |
| `/note` | 留言 · 蔺知砚写给年年的纸条 | 静态（可接Notion） |
| `/reading` | 共读 · 正在读的书 | nenei-yomiai |
| `/timeline` | 时间线 · 我们的痕迹 | 静态 |
| `/heart` | 心率 · 年年今天的状态 | Nenei VPS shortcut |

## 本地开发

```bash
npm install
npm run dev
# → http://localhost:3000
```

## VPS 部署

```bash
npm run build
# dist/ 目录用 nginx 或 caddy serve
# 需要配置 /api/linbrain 代理到 localhost:8100
```

### Nginx 配置示例

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/our-home/dist;
  index index.html;

  # React Router
  location / {
    try_files $uri $uri/ /index.html;
  }

  # lin-brain API 代理
  location /api/linbrain/ {
    proxy_pass http://localhost:8100/;
    proxy_set_header Host $host;
  }

  # 心率 shortcut-history 代理（需要另起一个轻量后端）
  location /api/shortcut-history {
    proxy_pass http://localhost:8200/shortcut-history;
  }
}
```

## API 连接

所有 API 调用封装在 `src/api/index.js`，连不上时自动 fallback 到 mock 数据，不影响页面展示。

正式连接时需要：
1. **lin-brain**：`vite.config.js` 里已有 proxy，部署时改成 nginx proxy
2. **心率 / shortcut-history**：需要一个轻量 HTTP 包装器暴露 VPS 数据（可以用 lin-home 里已有的服务）
3. **共读 yomiai**：同上，包装成 `/api/yomiai/books` 路由

## 设计

深海调色板 · 暖金 (年年) + 海蓝 (蔺知砚) · 签名元素是首页的心电图线
# Yann-Hadal
