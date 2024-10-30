import React from 'react';
import { RiSettings3Line } from 'react-icons/ri';
import { IoPersonSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import useAuth from '@src/hooks/useAuth';

function Settings() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="p-4 bg-white border rounded-md shadow-md text-sm flex justify-between items-center">
      <Link to={`${isAuthenticated ? '/profile' : '/login'}`}>
        {' '}
        <IoPersonSharp size={24} className="text-gray-600 cursor-pointer" />
      </Link>

      <Link to="/settings">
        <RiSettings3Line size={24} className="text-gray-600 cursor-pointer" />
      </Link>
    </div>
  );
}

export default Settings;
