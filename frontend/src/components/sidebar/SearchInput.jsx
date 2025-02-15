import React from 'react'
import { IoSearch } from "react-icons/io5";

export const SearchInput = () => {
  return (
    <form>
        <input type="text" placeholder='Search..' className='input input-bordered rounded-full ' />
        <button className="btn btn-circle bg-sky-500 text-white">
        <IoSearch className='w-6 h-6 outline-none' />
        </button>
    </form>
  )
}
