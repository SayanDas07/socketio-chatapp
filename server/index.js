import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env",
});


const app = express();
const port = process.env.PORT;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Hello World!");
});


const secretKey = process.env.KEY;


app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, secretKey);

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" }).json({
        message: "Login Success",
    });
});

//Middleware for authentication
io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err);

        const token = socket.request.cookies.token;
        if (!token) return next(new Error("Authentication Error"));

        const decoded = jwt.verify(token, secretKey);
        next();
    });
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