import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

export const getRecieverSocketId = (recieverId) => {
  return userSocketMap[recieverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // io.emit is used to send event to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Join group chat rooms
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  // Leave group chat rooms
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`User ${userId} left group ${groupId}`);
  });

  // Handle group messages
  socket.on("sendGroupMessage", ({ groupId, message }) => {
    io.to(groupId).emit("newGroupMessage", {
      sender: userId,
      message,
      groupId,
      timestamp: new Date(),
    });
  });

  // socket.on is used to listen to the events. can be used both client and server side
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    console.log("user disconnected", socket.id);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
