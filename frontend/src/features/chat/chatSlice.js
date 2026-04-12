import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],   // [{ role: "user" | "ai", content: "" }]
  isTyping: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // 🟢 Add user message
    addUserMessage: (state, action) => {
      state.messages.push({
        role: "user",
        content: action.payload,
      });
    },

    // 🟢 Start AI response
    startAIResponse: (state) => {
      state.isTyping = true;
      state.messages.push({
        role: "ai",
        content: "",
      });
    },

    // 🟢 Stream AI chunks
    appendAIChunk: (state, action) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.role === "ai") {
        lastMessage.content += action.payload;
      }
    },

    // 🟢 End AI response
    endAIResponse: (state) => {
      state.isTyping = false;
    },

    // 🟢 Reset chat
    resetChat: (state) => {
      state.messages = [];
      state.isTyping = false;
    },
  },
});

export const {
  addUserMessage,
  startAIResponse,
  appendAIChunk,
  endAIResponse,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;