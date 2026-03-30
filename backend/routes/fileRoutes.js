import express from "express";
import {protect} from "../middleware/authMiddleware.js"

import {deleteFile, getAllFiles, uploadFile} from "../controllers/fileController.js"
import {upload} from "../middleware/multer.js"

const router = express.Router();




router.post(
  "/upload",
  protect,               
  upload.single("file"), 
  uploadFile           
);


router.get("/",protect,getAllFiles)
router.delete("/:id",protect,deleteFile)


export default router;