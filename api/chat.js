import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const body = req.body || {};
    const messages = body.messages || [];

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "你是一个专业、耐心、简洁的中文助手。"
        },
        ...messages
      ],
      temperature: 0.7
    });

    res.status(200).json({
      reply: completion.choices[0].message.content
    });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({
      error: "Chat API failed",
      detail: err.message
    });
  }
}