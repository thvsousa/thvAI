import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 🔥 Agora a API Key está no .env.local
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
      model: "gpt-4o-mini",  // 🔥 Usando o modelo da OpenAI
      messages: [{ role: "user", content: message }],
    });

    console.log("✅ Resposta da OpenAI:", completion);

    return res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("❌ Erro na API OpenAI:", error);
    return res.status(500).json({ response: "Erro ao obter resposta da IA", details: error.message });
  }
}
