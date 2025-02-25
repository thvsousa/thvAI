import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Apenas POST é permitido" });
  }

  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://deepseek.api.url", // Substitua pelo endpoint correto
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
    return res.status(500).json({ response: "Erro ao se conectar com a thvAI" });
  }
}
