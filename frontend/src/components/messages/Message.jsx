import React from "react";

const Message = () => {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full ">
          <img src="https://avatar.iran.liara.run/public" alt="" />
        </div>
      </div>
      <div className={`chat-bubble text-white bg-blue-500`}>Hi What is up??</div>
      <div className={`chat-footer text-xs opacity-50 flex gap-1 items-center`}>Hi What is up??</div>
    </div>
  );
};

export default Message;
