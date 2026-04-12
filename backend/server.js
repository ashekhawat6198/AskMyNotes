import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"
import fileRoutes from "./routes/fileRoutes.js"
import path from "path";

dotenv.config();

connectDB();

const app = express();



const server = http.createServer(app);

const allowedOrigin = [
   'http://localhost:5174',
    'http://localhost:5173',
   
]

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE',  'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
})

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization',"X-Requested-With"],
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("io", io);



app.use("/api/users", userRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/chat",chatRoutes)


io.on("connection", (socket) => {
    console.log(`🟢 A user Connected ${socket.id}`);

    const userId = socket.handshake.query.userId;

    console.log("👉 userId from query:", userId);

    if (userId) {
        socket.join(userId.toString());   // ✅ FIX HERE
        console.log(`✅ User ${socket.id} joined room: ${userId}`);
    } else {
        console.log("❌ No userId received");
    }

    socket.on("disconnect", () => {
        console.log(`🔴 User Disconnected ${socket.id}`);
    });
});



const PORT = process.env.PORT || 5000;




server.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);


