import React from 'react';
import Sidebar from './Sidebar';

/**
 * Main Layout Component
 * Wraps pages with sidebar navigation
 */
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-cool-blue-gray">
      <Sidebar />
      <main className="flex-1 ml-[280px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;