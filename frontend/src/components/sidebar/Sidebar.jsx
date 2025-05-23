import React from "react";
import { SearchInput } from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";

const Sidebar = () => {
  return (
    <div className="flex flex-col w-full h-full bg-gray-800 p-4">
      <h1 className="text-xl font-bold bg-gradient-to-br from-pink-700 to-blue-700 bg-clip-text text-transparent mb-4">Messages</h1>
      <SearchInput />
      <div className="divider px-3"></div>
      <Conversations />
      <LogoutButton />
    </div>
  );
};

export default Sidebar;

