import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Apenas POST é permitido" });
  }

  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ response: "Mensagem inválida." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // Endpoint correto da OpenAI
      {
        model: "gpt-3.5-turbo", // Modelo mais barato da OpenAI
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Certifique-se de que a variável está definida no Azure
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      throw new Error("Resposta inválida da API OpenAI");
    }

    return res.status(200).json({ response: response.data.choices[0].message.content });
  } catch (error: any) {
    console.error("Erro na API OpenAI:", error.response?.data || error.message);
    return res.status(500).json({ response: "Erro ao obter resposta da IA" });
  }
}
