import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Apenas POST é permitido" });
  }

  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/chat",  // Confirme se esse é o endpoint correto!
      {
        prompt: message,
        max_tokens: 100,
      },
      {
        headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      }
    );

    return res.status(200).json({ response: response.data.text });
  } catch (error) {
    console.error("Erro na API:", error.response?.data || error.message);
    return res.status(500).json({ response: "Erro ao obter resposta da IA" });
  }
}
