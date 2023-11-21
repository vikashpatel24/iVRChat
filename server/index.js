// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const socket = require("socket.io");
const bcrypt = require("bcrypt");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute");

// Load environment variables
require("dotenv").config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// MongoDB Connection
const mongoDB = process.env.MONGODB_URI;
mongoose
  .connect(mongoDB, {})
  .then(() => {
    console.log(`DB Connetion Successfull at port ${mongoDB}`);
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

const server = app.listen(port, (req, res) => {
  console.log(`Server started running on port ${port}`);
});

const io = socket(server, {
  cors: {
    origin: "https://ivrchat.vercel.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket)
      socket.to(sendUserSocket).emit("msg-receive", data.message);
  });
});
