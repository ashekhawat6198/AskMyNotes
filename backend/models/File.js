import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: {
      type: String,
      required: true,        // original file name e.g. "myresume.pdf"
    },
    filename: {
      type: String,
      required: true,        // stored file name e.g. "1234567890-myresume.pdf"
    },
    fileType: {
      type: String,
      enum: ["pdf", "docx", "txt", "link"],
      required: true,
    },
    filePath: {
      type: String,
      required: true,        // local path for files OR url for links
    },
    fileSize: {
      type: Number,          // in bytes (null for links)
      default: null,
    },
    isProcessed: {
      type: Boolean,
      default: false,        // true after AI embeds it
    },
    processingError: {
      type: String,
      default: null,         // stores error message if AI processing fails
    },
    pageCount: {
      type: Number,
      default: null,         // for PDFs
    },
    wordCount: {
      type: Number,
      default: null,         // for DOCX and TXT
    },
  },
  { timestamps: true }
);




const File=mongoose.model("File",fileSchema);
export default File