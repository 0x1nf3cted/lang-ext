import React from 'react'
import { IoPersonSharp } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";



function Tools() {
    return (
        <div className='flex flex-row w-full bg-blue-700 gap-y-6 rounded-md p-2 mt-4 gap-x-4 items-center'>
            <IoLogOutOutline size={24} color='white' className=' cursor-pointer'/>
        </div>
    )
}

export default Tools