import React, { useState, useRef } from "react";
import { BsSend } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    const formData = new FormData();
    if (message.trim()) formData.append("message", message);
    if (file) {
      formData.append("file", file);
      formData.append("fileType", file.type.startsWith("image/") ? "image" : "document");
    }

    await sendMessage(formData);
    setMessage("");
    setFile(null);
  };

  const handleFileClick = (type) => {
    if (type === "image") {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (type === "image" && !selectedFile.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setFile(selectedFile);
  };

  return (
    <form
      className="px-2 sm:px-4 py-2 w-full max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="relative flex items-center gap-3 bg-gray-800 rounded-lg ">
        <div className="flex gap-3 px-3">
          <button
            type="button"
            onClick={() => handleFileClick("image")}
            className="text-gray-400 hover:text-purple-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            aria-label="Attach Image"
          >
            <IoImageOutline className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => handleFileClick("document")}
            className="text-gray-400 hover:text-purple-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            aria-label="Attach File"
          >
            <IoMdAttach className="w-6 h-6" />
          </button>
        </div>

        <input
          type="text"
          className="flex-grow bg-gray-700 border border-gray-600 rounded-lg
                     py-2 pr-12 pl-4 text-white placeholder-gray-400 text-sm sm:text-base
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition-shadow duration-300 shadow-sm hover:shadow-md"
          placeholder={file ? `Selected file: ${file.name}` : "Send a message"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="file"
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, "image")}
          accept="image/*"
          className="hidden"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e, "document")}
          className="hidden"
        />

        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 text-white hover:text-purple-400
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send Message"
        >
          {loading ? (
            <div className="loading loading-spinner w-5 h-5" />
          ) : (
            <BsSend className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
