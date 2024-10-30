import React from 'react';
import { IoPersonSharp, IoLogOutOutline } from 'react-icons/io5';

function Tools() {
  return (
    <div className="flex items-center justify-between w-full bg-blue-600 rounded-lg p-4 mt-4 shadow-lg">
      <div className="flex items-center gap-4">
        <IoPersonSharp size={28} color="white" className="cursor-pointer hover:text-gray-300 transition-colors" />
        <span className="text-white text-lg font-semibold">Profile</span>
      </div>
      <IoLogOutOutline size={28} color="white" className="cursor-pointer hover:text-gray-300 transition-colors" />
    </div>
  );
}

export default Tools;
