import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userProfile } from '../service/UserService';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminLayout = () => {


 
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar  />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        {/* <AdminFooter /> */}
      </div>
    </div>
  );
};

export default AdminLayout;