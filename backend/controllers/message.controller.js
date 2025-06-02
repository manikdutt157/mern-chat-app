import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";
import multer from "multer";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images and documents
  if (file.mimetype.startsWith('image/') || 
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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

    let messageData = {
      senderId,
      recieverId,
    };

    // Add message if present
    if (message) {
      messageData.message = message;
    }

    // Handle file upload if present
    if (req.file) {
      messageData.fileData = req.file.buffer;
      messageData.contentType = req.file.mimetype;
      messageData.fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'document';
      messageData.fileName = req.file.originalname;
    }

    const newMessage = new Message(messageData);

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Create a sanitized version of the message for the response
    const messageForResponse = {
      ...newMessage.toJSON(),
      fileUrl: newMessage.fileData ? `/api/messages/file/${newMessage._id}` : null,
      fileData: undefined // Remove binary data from response
    };

    const recieverSocketId = getRecieverSocketId(recieverId);
    if(recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", messageForResponse);
    }

    res.status(201).json(messageForResponse);
  } catch (error) {
    console.log("Error in send message controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
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

    // Sanitize messages to include file URLs instead of binary data
    const messages = conversation.messages.map(msg => {
      const messageObj = msg.toJSON();
      if (messageObj.fileData) {
        messageObj.fileUrl = `/api/messages/file/${msg._id}`;
        delete messageObj.fileData;
      }
      return messageObj;
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// New endpoint to serve files
export const getMessageFile = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message || !message.fileData) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set the correct content type
    res.set('Content-Type', message.contentType);
    
    // Set content disposition based on file type
    if (message.fileType === 'document') {
      res.set('Content-Disposition', `attachment; filename="${message.fileName}"`);
    }

    // Send the file data
    res.send(message.fileData);
  } catch (error) {
    console.log("Error in getMessageFile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMessages = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const userId = req.user._id;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ error: "No messages to delete" });
    }

    // Find messages that belong to the user
    const messages = await Message.find({
      _id: { $in: messageIds },
      senderId: userId
    });

    if (messages.length === 0) {
      return res.status(404).json({ error: "No messages found" });
    }

    // Delete the messages
    const deleteResult = await Message.deleteMany({
      _id: { $in: messages.map(msg => msg._id) }
    });

    // Update conversations by removing the deleted message IDs
    const updateResult = await Conversation.updateMany(
      { messages: { $in: messages.map(msg => msg._id) } },
      { $pull: { messages: { $in: messages.map(msg => msg._id) } } }
    );

    // Send success response with content-type header
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ 
      message: "Messages deleted successfully",
      deletedCount: messages.length,
      deleteResult,
      updateResult
    });
  } catch (error) {
    console.error("Error in deleteMessages controller:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};
