import React from 'react';
import { Link } from 'react-router-dom';
import { MoveLeftIcon, Laptop } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, navItems, isDarkMode }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 shadow-2xl transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out flex flex-col ${
        isDarkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'
      }`}
    >
      {/* Header / Branding */}
      <div className={`flex justify-between items-center px-6 py-[21px] border-b ${
        isDarkMode ? 'border-gray-800' : 'border-gray-100'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-white/10" : "bg-blue-100"}`}>
            <Laptop size={18} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
          </div>
          <h2 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Oceon<span className='text-blue-500'>Of</span>Laptops
          </h2>
        </div>
        <button 
          onClick={onClose} 
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <MoveLeftIcon size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.url}
                className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={onClose}
              >
                <item.icon className="mr-3" size={20} />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

