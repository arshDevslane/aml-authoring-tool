import AppRoutes from '@/routes/AppRoutes/appRoutes';
import React from 'react';
import AppSidebar from '@/shared-resources/Sidebar/AppSidebar';
import { SidebarProvider } from '@/shared-resources/ui/sidebar';

const AppLayout: React.FC = () => (
  <div className='flex  min-h-screen'>
    {/* Sidebar */}
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>

    {/* Main Content */}
    <div className='flex-1 p-6 w-full'>
      <AppRoutes />
    </div>
  </div>
);

export default AppLayout;
