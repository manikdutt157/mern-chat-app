import React, { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import { IoArrowBack } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="border-b border-gray-700 px-2 sm:px-6 md:px-8 py-3 flex items-center">
            {/* Back button visible only on small devices */}
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-gray-700 rounded-full mr-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Back to conversations"
            >
              <IoArrowBack size={22} className="text-white" />
            </button>

            <div>
              <span className="text-gray-400 text-xs sm:text-sm md:text-base">
                To:
              </span>{" "}
              <span
                className="font-extrabold
                           text-base sm:text-lg md:text-xl lg:text-2xl
                           bg-gradient-to-br from-pink-600 to-blue-500
                           bg-clip-text text-transparent select-text"
              >
                {selectedConversation.fullName}
              </span>
            </div>
          </div>

          {/* Messages container (flex-grow to fill space) */}
          <div className="flex-grow overflow-y-auto sm:px-2 md:px-4 py-3">
            <Messages />
          </div>

          {/* Message input */}
          <div className="px-2 sm:px-2 md:px-2 py-2 bg-gray-800 border-t border-gray-700">
            <MessageInput />
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full px-6">
      <div className="text-center text-gray-300 font-semibold flex flex-col items-center gap-3 max-w-md mx-auto">
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
          Welcome ✌️ {authUser.fullName}
        </p>
        <p className="text-sm sm:text-base md:text-lg">
          Select a chat to start messaging
        </p>
        <TiMessages className="text-5xl sm:text-6xl md:text-7xl mt-4 text-purple-500" />
      </div>
    </div>
  );
};
