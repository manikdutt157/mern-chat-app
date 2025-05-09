import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO functionality WIll go here
    const recieverSocketId = getRecieverSocketId(recieverId);
    if(recieverSocketId) {
      // io.to(<socket_id>).emit() used to send event to specific client
      io.to(recieverSocketId).emit("newMessage", newMessage)
    }

    

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in send message controller:", error.message);
    res.status(200).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if(!conversation) return res.status(200).json([]);
    const messages = conversation.messages;
    res.status(200).json(messages);

  } catch (error) {
    console.log("Error in getMessage controller:", error.message);
    res.status(200).json({ error: "Internal Server Error" });
  }
};
