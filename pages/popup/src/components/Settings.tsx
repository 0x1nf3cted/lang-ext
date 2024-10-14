import { Link } from 'react-router-dom';
import React from 'react'
import { RiSettings3Line } from "react-icons/ri";
import { IoPersonSharp } from 'react-icons/io5';
function Settings() {
    return (
        <div className='flex flex-row  w-full bg-blue-700 gap-y-6 rounded-md p-2 justify-between items-center'>
            <IoPersonSharp size={24} color='white' className=' cursor-pointer' />
            <Link to="/settings"><RiSettings3Line size={24} color='white' /></Link>
        </div>
    )
}

export default Settings