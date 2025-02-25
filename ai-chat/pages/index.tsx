import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages([...newMessages, { role: "thvAI", content: data.response }]);
    } catch (error) {
      setMessages([...newMessages, { role: "thvAI", content: "Erro ao obter resposta." }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4 text-center text-lg font-semibold text-gray-800">
        thvAI - Inteligência Artificial
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-3 max-w-xl rounded-2xl shadow-md ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              } whitespace-pre-line`}
              dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br />") }} // 🔥 Adiciona quebras de linha!
            />
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="p-3 max-w-lg rounded-2xl shadow-md bg-gray-200 text-gray-800">
              <span className="animate-pulse">Digitando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Pergunte algo para thvAI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
