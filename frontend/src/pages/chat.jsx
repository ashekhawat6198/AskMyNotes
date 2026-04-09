import { useState } from "react";

const Ask = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi 👋 Ask me anything from your uploaded notes!",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };

    const botMessage = {
      type: "bot",
      text: "This is a sample AI response based on your notes.",
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-white/20 backdrop-blur-xl flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold">
          AskMyNotes  
        </h1>
        <span className="text-xs text-gray-300">
          Chat with your notes
        </span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 chat-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm sm:text-base shadow-lg ${
                msg.type === "user"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                  : "bg-white/10 border border-white/20 text-gray-200 backdrop-blur-xl"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask something from your notes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition shadow-lg shadow-purple-900/40 active:scale-[0.95]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ask;