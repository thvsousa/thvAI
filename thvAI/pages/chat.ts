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

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ response: "Chave da OpenAI não configurada." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Verifica se a resposta da API contém os dados esperados
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      return res.status(500).json({ response: "Resposta inválida da OpenAI." });
    }

    return res.status(200).json({ response: response.data.choices[0].message.content });
  } catch (error: any) {
    console.error("Erro na API OpenAI:", error.response?.data || error.message);

    return res.status(500).json({ response: `Erro ao obter resposta da IA: ${error.response?.data?.error?.message || error.message}` });
  }
}
