import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserMessage,
  startAIResponse,
  appendAIChunk,
  endAIResponse,
  resetChat,
} from "../features/chat/chatSlice";

import axios from "axios";
import { connectSocket } from "../hooks/socket";
import { useParams } from "react-router-dom";

const Ask = () => {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();
  const { messages, isTyping } = useSelector((state) => state.chat);
  const user = useRef(JSON.parse(localStorage.getItem("user") || "null")).current;
  const { fileId } = useParams();
  const messagesEndRef = useRef(null);

  // 🔥 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 LOAD PREVIOUS CHAT
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const chat = res.data.data;

        chat.messages.forEach((msg) => {
          if (msg.role === "user") {
            dispatch(addUserMessage(msg.content));
          } else {
            dispatch(startAIResponse());
            dispatch(appendAIChunk(msg.content));
            dispatch(endAIResponse());
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (fileId) {
      dispatch(resetChat());
      fetchChat();
    }
  }, [fileId, dispatch]);

  // 🔥 SOCKET CONNECTION
  useEffect(() => {
    if (!user?._id) return;

    const socket = connectSocket(user._id);

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("chat_stream", (data) => {
      dispatch(appendAIChunk(data.chunk));
    });

    socket.on("chat_done", () => {
      dispatch(endAIResponse());
    });

    socket.on("chat_error", () => {
      alert("Something went wrong");
      dispatch(endAIResponse());
    });

    return () => socket.disconnect();
  }, [dispatch]);

  // 🔥 SEND QUESTION
  const handleSend = async () => {
    if (!input.trim() || isSending || isTyping) return;

    const query = input;
    setInput("");
    setIsSending(true);

    dispatch(addUserMessage(query));
    dispatch(startAIResponse());

    try {
      await axios.post(
        "http://localhost:5000/api/chat/message",
        { fileId, query },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
      dispatch(endAIResponse());
    } finally {
      setIsSending(false);
    }
  };

  const showDots =
    (isSending || isTyping) &&
    messages[messages.length - 1]?.content === "" &&
    messages[messages.length - 1]?.role === "ai";

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white">

      {/* Header */}
      <div className="p-4 border-b border-white/20 backdrop-blur-xl flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold">AskMyNotes</h1>
        <span className="text-xs text-gray-300">Chat with your notes</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-400">
            Hi 👋 Ask me anything from your uploaded notes!
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm sm:text-base shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                  : "bg-white/10 border border-white/20 backdrop-blur-xl text-gray-200"
              }`}
            >
              {/* ✅ Show dots while waiting for first chunk */}
              {msg.role === "ai" &&
              msg.content === "" &&
              index === messages.length - 1 &&
              showDots ? (
                <span className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </span>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={
              isSending || isTyping
                ? "AI is typing..."
                : "Ask something from your notes..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isSending || isTyping}
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <button
            onClick={handleSend}
            disabled={isSending || isTyping}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition shadow-lg active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ask;