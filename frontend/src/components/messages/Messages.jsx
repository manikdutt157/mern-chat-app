import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const { 
    selectedMessages, 
    clearSelectedMessages, 
    deleteSelectedMessages,
    setMessages 
  } = useConversation();
  useListenMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleDeleteSelected = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    if (selectedMessages.size === 0) return;

    try {
      const selectedMsgs = await deleteSelectedMessages();
      console.log("Selected messages to delete:", selectedMsgs); // Debug log

      // Make API call to delete messages
      const res = await fetch("/api/messages/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageIds: selectedMsgs }),
        credentials: 'include' // This will include cookies in the request
      });

      console.log("Response status:", res.status); // Debug log

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
        console.log("Response data:", data); // Debug log
      } else {
        console.log("No JSON response received"); // Debug log
        data = { message: "Messages deleted successfully" };
      }

      if (!res.ok) {
        throw new Error(data.error || `Failed to delete messages: ${res.status}`);
      }

      toast.success(data.message || "Messages deleted successfully");
    } catch (error) {
      console.error("Delete error details:", {
        message: error.message,
        stack: error.stack,
        selectedMessages: Array.from(selectedMessages)
      });
      toast.error(error.message || "Error deleting messages");
      // Restore messages if deletion failed
      setMessages(messages);
    }
  };

  return (
    <div className="px-4 flex-1 overflow-auto relative">
      {selectedMessages.size > 0 && (
        <div className="sticky top-0 z-10 bg-gray-800 p-2 rounded-lg mb-2 flex justify-between items-center">
          <span className="text-white">
            {selectedMessages.size} message{selectedMessages.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearSelectedMessages}
              className="text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="text-red-500 hover:text-red-400 transition flex items-center gap-1"
            >
              <MdDelete className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      )}

      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center">Send a Message to start the conversation.</p>
      )}
    </div>
  );
};

export default Messages;
