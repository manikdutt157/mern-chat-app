import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversation from "../../hooks/useGetConversation";
import toast from "react-hot-toast";

export const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );
    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error("No such user found!");
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full max-w-full"
    >
      <input
        type="text"
        placeholder="Search.."
        className="w-full input input-bordered rounded-full focus:ring-2 focus:ring-purple-700
                   text-sm sm:text-base px-4 py-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search conversations"
      />
      <button
        type="submit"
        className="btn btn-circle bg-gradient-to-br from-pink-700 to-blue-700 text-white hover:opacity-50
                   flex justify-center items-center p-2 sm:p-3"
        aria-label="Search"
      >
        <IoSearch className="w-5 h-5 sm:w-6 sm:h-6 outline-none" />
      </button>
    </form>
  );
};
