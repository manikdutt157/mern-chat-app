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
    // cleanup function (unmounts)
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="md:w-full h-full flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="border-b-2 px-4 py-4 mb-2 flex items-center">
            <button 
              onClick={() => setSelectedConversation(null)}
              className="sm:hidden p-2 hover:bg-gray-700 rounded-full mr-2"
            >
              <IoArrowBack size={20} className="text-white" />
            </button>
            <div>
              <span className="label-text">To:</span>{" "}
              <span className="text-transparent font-bold bg-gradient-to-br from-pink-700 to-blue-700 bg-clip-text">
                {selectedConversation.fullName}
              </span>
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const {authUser} = useAuthContext()
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="p-x text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome ✌️ {authUser.fullName} </p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
