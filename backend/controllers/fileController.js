import File from "../models/File.js";
import fs from "fs";
import path from "path";
import axios from "axios";
import asyncHandler from "express-async-handler";

const AI_SERVICE_URL = "http://localhost:8000";

const pushFileUpdate = (io, userId, fileId, status, message, file = null) => {
  io.to(userId.toString()).emit("file:update", {
    fileId,
    status,
    message,
    file,
  });
};

export const uploadFile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const io = req.app.get("io");

  let file;

  if (req.body.type === "link") {
    file = await File.create({
      user: userId,
      originalName: req.body.title || req.body.url,
      filename: req.body.url,
      fileType: "link",
      filePath: req.body.url,
    });

    res.status(202).json({
      message: "Link uploaded. Processing started...",
      fileId: file._id,
    });
  } else {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }

    const typeMap = {
      "application/pdf": "pdf",
      "text/plain": "txt",
    };

    const fileType = typeMap[req.file.mimetype];

    if (!fileType) {
      fs.unlinkSync(req.file.path); // delete invalid file
      res.status(400);
      throw new Error("Unsupported file type");
    }

    file = await File.create({
      user: userId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      fileType,
      filePath: req.file.path,
      fileSize: req.file.size,
    });

    res.status(202).json({
      message: "File uploaded. Processing started...",
      fileId: file._id,
    });
  }

  (async () => {
    try {
      pushFileUpdate(io, userId, file._id, "PROCESSING", "Processing File...");

       const absolutePath = path.resolve(file.filePath);

      const response = await axios.post(`${AI_SERVICE_URL}/ingest`, {
        fileId: file._id,
        filePath: absolutePath,
        fileType: file.fileType,
      });

       if (response.data.error) {
      throw new Error(response.data.error);
    }

      // console.log(response.status);
      file.isProcessed = true;
      await file.save();

      pushFileUpdate(
        io,
        userId,
        file._id,
        "READY",
        "File ready for questions",
        file,
      );
    } catch (err) {
      file.processingError = err.message;
      await file.save();
     console.log("INGEST ERROR:",  err.message);

      pushFileUpdate(io, userId, file._id, "FAILED", "Processing failed");
    }
  })();
});

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete physical file from server (not for links)
    if (file.fileType !== "link" && fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Tell AI service to delete embeddings
    try {
      await axios.delete(
        `${process.env.AI_SERVICE_URL}/delete/${req.params.id}`,
      );
    } catch (err) {
      console.error("Failed to delete embeddings:", err.message);
    }

    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllFiles = asyncHandler(async (req, res) => {
  const files = await File.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: files,
  });
});
