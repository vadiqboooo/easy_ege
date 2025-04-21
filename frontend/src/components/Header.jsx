import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        )}
        <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
      </div>
    </header>
  );
};

export default Header;