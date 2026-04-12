// src/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  socket = io("http://localhost:5000", {
    query: { userId },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("chat_update", (data) => {
  dispatch(addUserMessage(data.message.content));
});

  return socket;
};

export const getSocket = () => socket;