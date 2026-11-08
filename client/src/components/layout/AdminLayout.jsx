import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({
  activeSection,
  onSelectSection,
  searchTerm,
  onSearchChange,
  onSync,
  refreshing,
  children
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark' : ''} bg-[#f8fafc] dark:bg-[#090b10] text-slate-900 dark:text-slate-100`}>
      {/* Dedicated Enterprise Admin Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={onSelectSection}
      />

      {/* Main Admin Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onSync={onSync}
          refreshing={refreshing}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

