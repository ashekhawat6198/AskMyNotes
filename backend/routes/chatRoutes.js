import express from "express"
import {
    clearChat,
    deleteChat,
    askQuestion,
    getChatByFile,
    getAllChats
} from "../controllers/chatController.js"

import { protect } from "../middleware/authMiddleware.js"


const router=express.Router()

router.get('/:fileId',protect,getChatByFile);

router.get('/clear/:fileId',protect,clearChat);
router.get("/",protect,getAllChats)
router.delete("/:fileId",protect,deleteChat)
router.post("/message",protect,askQuestion)

export default router;