import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/chat",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setChats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white p-6 sm:p-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-black">
          Chat <span className="text-purple-400">History</span>
        </h1>
        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          View all your uploaded files and continue chatting
        </p>
      </div>

      {/* Chat List */}
      {chats.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          No chats found 😢 <br />
          Upload a file to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => navigate(`/chat/${chat.file._id}`)}
              className="cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-[1.03] transition"
            >
              <h2 className="text-lg font-bold text-purple-300 truncate">
                {chat.file?.originalName || "Untitled File"}
              </h2>

              <p className="text-gray-300 text-sm mt-2">
                Type: {chat.file?.fileType?.toUpperCase()}
              </p>

              <p className="text-gray-400 text-xs mt-2">
                Messages: {chat.messages.length}
              </p>

              <p className="text-gray-500 text-xs mt-2">
                Last updated: {new Date(chat.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default History;