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
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (type === 'image' && !selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFile(selectedFile);
  };

  return (
    <form className="px-2 sm:px-4 py-2" onSubmit={handleSubmit}>
      <div className="w-full relative flex items-center gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleFileClick('image')}
            className="text-gray-300 hover:text-purple-400 transition"
          >
            <IoImageOutline className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => handleFileClick('document')}
            className="text-gray-300 hover:text-purple-400 transition"
          >
            <IoMdAttach className="w-6 h-6" />
          </button>
        </div>
        
        <input
          type="text"
          className="border text-sm sm:text-base rounded-lg block w-full py-2 pr-10 pl-3 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder={file ? `Selected file: ${file.name}` : "Send a message"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="file"
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, 'image')}
          accept="image/*"
          className="hidden"
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e, 'document')}
          className="hidden"
        />

        <button
          type="submit"
          className="absolute right-0 flex items-center pr-3 text-white hover:text-purple-400 transition"
        >
          {loading ? (
            <div className="loading loading-spinner w-4 h-4" />
          ) : (
            <BsSend className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
