import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env",
});


const app = express();
const port = process.env.PORT;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://chatingmaster-oog5.onrender.com/",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: "https://chatingmaster-oog5.onrender.com/",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Hello World!");
});





io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.emit("welcome", `Welcome ${socket.id}`);

    socket.broadcast.emit("welcome1", `Welcome from brodcast ${socket.id}`);

    socket.on("message", ({ message, room }) => {
        console.log(message);
        socket.to(room).emit("recived-message", message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
      });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});