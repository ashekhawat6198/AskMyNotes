import mongoose from "mongoose";


const userSchema=mongoose.Schema({
 
    name:{
        type:String,
        required:true
    },
    email:{
         type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    googleId:{
         type:String,
        unique:true,
        sparse:true
    }


},{timestamps:true})

const User=mongoose.model("User",userSchema);
export default User