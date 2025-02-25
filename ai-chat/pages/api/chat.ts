import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// 🔥 Pegando a API Key do ambiente do Azure ou do .env.local (caso esteja rodando localmente)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Apenas requisições POST são permitidas." });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Nenhuma mensagem foi enviada." });
  }

  try {
    console.log("🔹 Enviando requisição para OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 🔥 Você pode trocar para "gpt-4o" se desejar
      messages: [{ role: "user", content: message }],
      max_tokens: 200, // 🔥 Limita a resposta para economizar tokens
    });

    console.log("✅ Resposta da OpenAI:", completion);

    return res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("❌ Erro na API OpenAI:", error);
    
    return res.status(500).json({ 
      response: "Erro ao obter resposta da IA", 
      details: error.response?.data || error.message 
    });
  }
}
