import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post("/api/chat", { message: input });
      setMessages([...newMessages, { role: "thvAI", content: res.data.response }]);
    } catch {
      setMessages([...newMessages, { role: "thvAI", content: "Erro ao obter resposta." }]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">thvAI - Chat Inteligente</h1>
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4">
        <div className="h-80 overflow-y-auto space-y-2 p-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                msg.role === "user" ? "bg-blue-200 self-end" : "bg-green-300 self-start"
              }`}
            >
              <strong>{msg.role === "user" ? "Você" : "thvAI"}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <input
            className="flex-1 border p-2 rounded-lg"
            type="text"
            placeholder="Pergunte algo para thvAI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
