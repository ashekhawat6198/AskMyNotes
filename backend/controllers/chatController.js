import Chat from "../models/Chat.js"
import File from "../models/File.js"
import axios from "axios"
import asyncHandler from "express-async-handler";

const AI_SERVICE_URL = "http://localhost:8000"

export const getChatByFile=asyncHandler(async(req,res)=>{
    
   const { fileId } = req.params;

   const file = await File.findById(fileId);

  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  if (file.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
   
   let chat = await Chat.findOne({
    user: req.user._id,
    file: fileId,
  });

   if (!chat) {
    chat = await Chat.create({
      user: req.user._id,
      file: fileId,
      title: `Chat - ${file.originalName}`,
      messages: [],
    });
  }

   res.status(200).json({
    success: true,
    data: chat,
  });
})



export const askQuestion=asyncHandler(async(req,res)=>{
  const { fileId } = req.body;
  const { query } = req.body;

  const io = req.app.get("io");
  const userId = req.user._id;

  if (!query) {
    res.status(400);
    throw new Error("Query is required");
  }

  const file = await File.findById(fileId);

  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  if (file.user.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

   if (!file.isProcessed) {
    res.status(400);
    throw new Error("File is still processing");
  }

   let chat = await Chat.findOne({
    user: userId,
    file: fileId,
  });

    if (!chat) {
    chat = await Chat.create({
      user: userId,
      file: fileId,
      messages: [],
    });
  }

   const chatHistory = chat.messages
    .slice(-10) // last 10 messages
    .map((msg) => [msg.role === "user" ? msg.content : "", msg.role === "ai" ? msg.content : ""]);

    chat.messages.push({
    role: "user",
    content: query,
  });

   await chat.save();

   io.to(userId.toString()).emit("chat_update", {
    chatId: chat._id,
    message: {
      role: "user",
      content: query,
    },
  });

    const response = await axios.post(
    `${AI_SERVICE_URL}/ask`,
    {
      query,
      fileId,
      chatHistory,
    },
    {
      responseType: "stream",
      timeout: 60000,
    }
  );
   

   let fullAnswer = "";

    response.data.on("data", (chunk) => {
    const text = chunk.toString();
    fullAnswer += text;

    // send chunk to frontend
    io.to(userId.toString()).emit("chat_stream", {
      chatId: chat._id,
      chunk: text,
    });
  });

  console.log(fullAnswer)

   response.data.on("end", async () => {
    // 💾 save final AI message
    chat.messages.push({
      role: "ai",
      content: fullAnswer,
    });

     await chat.save();

      io.to(userId.toString()).emit("chat_done", {
      chatId: chat._id,
      message: fullAnswer,
    });
  });

  response.data.on("error", (err) => {
    console.error("Stream error:", err.message);

    io.to(userId.toString()).emit("chat_error", {
      message: "Something went wrong",
    });
  });

  res.status(200).json({
    success: true,
    message: "Streaming started",
  });

})

export const deleteChat = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const chat = await Chat.findOneAndDelete({
    user: req.user._id,
    file: fileId,
  });

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  res.status(200).json({
    success: true,
    message: "Chat deleted",
  });
});

export const clearChat = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const chat = await Chat.findOne({
    user: req.user._id,
    file: fileId,
  });

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  chat.messages = [];
  await chat.save();

  res.status(200).json({
    success: true,
    message: "Chat cleared",
  });
});




export const getAllChats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const chats = await Chat.find({ user: userId })
    .populate("file", "originalName fileType") // get file info
    .sort({ updatedAt: -1 }); // latest first

  res.status(200).json({
    success: true,
    count: chats.length,
    data: chats,
  });
});




