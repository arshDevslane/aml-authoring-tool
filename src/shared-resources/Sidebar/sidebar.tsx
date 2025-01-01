import { AuthContext } from '@/context/AuthContext';
import { isAuthenticatedSelector } from '@/store/selectors/auth.selector';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';

const Sidebar: React.FC = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  return (
    <div
      className={`transition-all duration-300 bg-gray-800 text-white ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className='flex items-center justify-between p-4'>
        <span className={`text-xl font-bold ${isCollapsed && 'hidden'}`}>
          Menu
        </span>
        <button
          className='text-gray-300 hover:text-white'
          onClick={() => setCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className='space-y-4 p-4'>
        <NavLink
          to='/app/questions'
          className={({ isActive }) =>
            `block py-2 px-4 rounded ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-600'
            }`
          }
        >
          <span className={isCollapsed ? 'hidden' : ''}>Questions</span>
        </NavLink>
        <NavLink
          to='/app/question-sets'
          className={({ isActive }) =>
            `block py-2 px-4 rounded ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-600'
            }`
          }
        >
          <span className={isCollapsed ? 'hidden' : ''}>Question Sets</span>
        </NavLink>
      </nav>
      {isAuthenticated && (
        <AuthContext.Consumer>
          {({ onLogout }) => <Button onClick={onLogout}>Logout</Button>}
        </AuthContext.Consumer>
      )}
    </div>
  );
};

export default Sidebar;
