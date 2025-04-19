import React, { useState, useEffect } from "react";
import { SearchInput } from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import { IoMdClose } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import useConversation from "../../zustand/useConversation";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { selectedConversation } = useConversation();

  // Close sidebar when a conversation is selected on mobile
  useEffect(() => {
    if (selectedConversation && isMobileMenuOpen && window.innerWidth < 640) {
      setIsMobileMenuOpen(false);
    }
  }, [selectedConversation, isMobileMenuOpen]);

  // Listen for window resize to handle responsive state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(true); // Always visible on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    // Initialize state based on current window size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile toggle button - visible only on small screens */}
      {!selectedConversation && (
        <button
          className={`fixed top-4 left-4 z-50 sm:hidden bg-gradient-to-br from-pink-700 to-blue-700 p-2 rounded-full text-white shadow-lg transition-all duration-300 ${
            isMobileMenuOpen
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Sidebar with mobile responsive behavior */}
      <div
        className={`fixed sm:relative inset-0 sm:inset-auto z-40 sm:z-auto transition-transform duration-300 ease-in-out bg-gray-800 sm:bg-transparent
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0"
          }
          w-3/4 sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] h-full border-r border-slate-500 p-4 flex flex-col
          sm:transform-none overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold bg-gradient-to-br from-pink-700 to-blue-700 bg-clip-text text-transparent">Chats</h1>
          <button
            className="sm:hidden text-white p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <SearchInput />
        <div className="divider px-3"></div>
        <Conversations />
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </div>

      {/* Overlay to close sidebar when clicking outside on mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
