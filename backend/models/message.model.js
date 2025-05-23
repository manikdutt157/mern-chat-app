import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: function() {
        return !this.fileData; // message is required only if there's no file
      },
      default: "",
    },
    fileData: {
      type: Buffer,
      default: null,
    },
    fileType: {
      type: String,
      enum: ['image', 'document', null],
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    contentType: {
      type: String,
      default: null,
    },
    // created At and updateAt
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
