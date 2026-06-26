const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

const COZE_API_BASE = "https://api.coze.cn";
const DEFAULT_BOT_ID = "7642949621601533998";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/watch-later", async (req, res) => {
  const token = process.env.COZE_PAT_TOKEN;
  const botId = process.env.COZE_BOT_ID || DEFAULT_BOT_ID;

  if (!token) {
    return res.status(500).json({ error: "COZE_PAT_TOKEN is not configured" });
  }

  const { url } = req.body || {};

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "A valid url is required" });
  }

  try {
    const cozeResponse = await fetch(`${COZE_API_BASE}/v3/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bot_id: botId,
        user_id: "watch-later-page",
        stream: false,
        auto_save_history: true,
        additional_messages: [
          {
            role: "user",
            content: `请将这个 URL 添加到稍后阅读，并按已配置流程完成标题解析、正文摘要和飞书多维表格写入：${url}`,
            content_type: "text",
          },
        ],
      }),
    });

    const payload = await cozeResponse.json().catch(() => ({}));

    if (!cozeResponse.ok) {
      return res.status(cozeResponse.status).json({
        error: "Coze request failed",
        detail: payload,
      });
    }

    res.json({ ok: true, coze: payload });
  } catch (error) {
    res.status(500).json({
      error: "Unable to submit url to Coze",
      message: error.message,
    });
  }
});

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

app.listen(PORT, () => {
  console.log(`Watch Later server running on port ${PORT}`);
});
