const COZE_API_BASE = "https://api.coze.cn";
const DEFAULT_BOT_ID = "7642949621601533998";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.COZE_PAT_TOKEN;
  const botId = process.env.COZE_BOT_ID || DEFAULT_BOT_ID;

  if (!token) {
    response.status(500).json({ error: "COZE_PAT_TOKEN is not configured" });
    return;
  }

  const { url } = request.body || {};

  if (!isValidUrl(url)) {
    response.status(400).json({ error: "A valid url is required" });
    return;
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
      response.status(cozeResponse.status).json({
        error: "Coze request failed",
        detail: payload,
      });
      return;
    }

    response.status(200).json({
      ok: true,
      coze: payload,
    });
  } catch (error) {
    response.status(500).json({
      error: "Unable to submit url to Coze",
      message: error.message,
    });
  }
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
