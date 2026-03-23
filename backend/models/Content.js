import mongoose from "mongoose";

const contentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["note", "link", "file"],
    required: true,
  },
  title:{
    type:String,
    required:true
  },
  body: {
    type: String,  // raw text / URL / file path
    required: true
  },
  tags:[String],
  isEmbedded:{
    type:Boolean,
    default:false
  }
});

const Content=mongoose.model("Content",contentSchema);
export default Content