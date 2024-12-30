import AppRoutes from '@/routes/AppRoutes/appRoutes';
import Sidebar from '@/shared-resources/Sidebar/sidebar';
import React from 'react';

const AppLayout: React.FC = () => (
  <div className='flex min-h-screen'>
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className='flex-1 p-6'>
      <AppRoutes />
    </div>
  </div>
);

export default AppLayout;
