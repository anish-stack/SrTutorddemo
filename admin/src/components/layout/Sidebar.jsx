import React from 'react';
import { NavLink } from 'react-router-dom';
import { X  } from 'lucide-react';
import { navigationItems } from './navigationConfig';
import logo from './logo.webp';

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-200 lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-white text-lg font-semibold">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X  className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-0.5 px-4 mb-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-gray-100 text-white-900'
                    : 'text-white hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 mb-1 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;