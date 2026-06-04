# Watch Later — 稍后阅读智能体

一个把 URL 自动沉淀到飞书多维表格，并配合定时提醒完成稍后阅读闭环的 Coze 智能体。

**🔗 在线体验：** https://watch-later-rho.vercel.app/

## 它做什么

用户只需粘贴一个链接，智能体会自动：

1. **解析信息** — 提取标题、链接、创建日期
2. **生成摘要** — 调用大模型阅读正文，提炼核心观点
3. **写入飞书** — 把结构化数据写入飞书多维表格
4. **定时提醒** — 飞书表格每天固定时间推送待读列表

## 技术栈

| 组件 | 说明 |
|------|------|
| **Coze Bot** | 智能体核心，负责 URL 解析、摘要生成、飞书写入 |
| **Vercel** | 静态页面托管 + Serverless API |
| **飞书多维表格** | 数据存储 + 自动提醒规则 |
| **LLM** | 正文摘要生成 |

## 项目结构

```
watch-later/
├── index.html          # 介绍页（含 URL 提交表单）
├── api/
│   └── watch-later.js  # Vercel Serverless Function，调用 Coze API
├── .gitignore
└── README.md
```

## 自动化流程

```
用户输入 URL → Vercel API → Coze Bot → 飞书多维表格 → 每日提醒
```

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/cisyah/watch-later.git
cd watch-later

# 本地运行（需要 Vercel CLI）
npm i -g vercel
vercel dev
```

## 前置条件

本项目依赖以下服务，需要自行配置后才能使用：

| 服务 | 说明 | 获取方式 |
|------|------|----------|
| **Coze Bot** | 智能体核心，需自行创建 Bot 并配置工作流 | [coze.cn](https://www.coze.cn) |
| **飞书多维表格** | 数据存储，需创建表格并配置字段（title、url、abstract、date） | [feishu.cn](https://www.feishu.cn) |
| **Coze Bot 工作流** | Bot 内需配置：URL 解析 → LLM 摘要 → 飞书写入 | Coze Bot 编辑页面 |
| **飞书自动提醒** | 在多维表格中配置定时提醒规则 | 飞书多维表格自动化 |

> ⚠️ 本项目在线体验版连接的是作者自己的飞书表格，数据不会写入你的账户。克隆后需要按上述步骤自行配置。

## 环境变量

在 Vercel 项目设置中配置：

| 变量名 | 说明 |
|--------|------|
| `COZE_PAT_TOKEN` | Coze 平台的 Personal Access Token（需要 Bot 和飞书相关权限） |
| `COZE_BOT_ID` | 你自己的 Coze Bot ID（默认使用示例 Bot ID） |

## License

MIT
