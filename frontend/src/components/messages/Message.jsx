import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";
import { IoMdDownload } from "react-icons/io";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { 
    selectedConversation, 
    selectedMessages,
    setSelectedMessages,
  } = useConversation();

  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation.profilePic;
  const bubbleBgColor = fromMe ? "bg-purple-700" : "";
  const shakeClass = message.shouldShake ? "shake" : "";
  const isSelected = selectedMessages.has(message._id);

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent default context menu
    setSelectedMessages(message._id);
  };

  const handleClick = () => {
    if (selectedMessages.size > 0) {
      setSelectedMessages(message._id);
    }
  };

  const renderMessageContent = () => {
    if (message.fileType === "image") {
      return (
        <div className="relative max-w-sm">
          <img 
            src={message.fileUrl} 
            alt={message.fileName || "Image attachment"}
            className="rounded-lg max-w-full h-auto"
            loading="lazy"
          />
          <a 
            href={message.fileUrl}
            download={message.fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 p-2 rounded-full bg-gray-900/75 hover:bg-gray-900 transition-colors"
            title="Download image"
          >
            <IoMdDownload className="w-5 h-5 text-white" />
          </a>
        </div>
      );
    } else if (message.fileType === "document") {
      return (
        <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-lg max-w-sm">
          <IoMdDownload className="w-6 h-6 text-blue-400" />
          <a 
            href={message.fileUrl}
            download={message.fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors break-all"
            title="Download file"
          >
            {message.fileName || "Document"}
          </a>
        </div>
      );
    }
    return <div className="break-all">{message.message}</div>;
  };

  return (
    <div 
      className={`chat ${chatClassName}`} 
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="User avatar"
            src={profilePic}
          />
        </div>
      </div>
      <div 
        className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 ${
          isSelected ? "ring-2 ring-blue-500" : ""
        }`}
      >
        {renderMessageContent()}
      </div>
      <div className={`chat-footer text-xs opacity-50 flex gap-1 items-center`}>
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
