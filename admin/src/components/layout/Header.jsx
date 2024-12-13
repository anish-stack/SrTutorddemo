import React from 'react';
import { MenuIcon, BellIcon, UserCircle, Paintbrush, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Header = ({ onMenuClick }) => {
  const token = localStorage.getItem('Sr-token');

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successful 👍✔️");
    window.location.reload();
  };



  const CleanCaches = async () => {
    try {
      const response = await axios.get('https://api.srtutorsbureau.com/flush-all-Redis-Cached', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("All Caches Cleared From Website 👍✔️");
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        {/* Search bar */}
        <div className="hidden md:invisible lg:flex flex-1 max-w-lg ml-8">
          <input
            type="search"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right section */}

        <div className="flex items-center space-x-4">
          <button onClick={CleanCaches} className="p-2 rounded-full hover:bg-gray-100">
            <Paintbrush className="h-6 w-6" />
          </button>
          {/* <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="h-6 w-6" />
          </button> */}
          <button onClick={()=> window.location.href="/Manage-Profile"} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
            <UserCircle className="h-6 w-6" />
            <span className="hidden lg:block text-sm font-medium">Admin</span>
          </button>
          <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
            <LogOut className="h-6 w-6" />
            <span className="hidden lg:block text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;