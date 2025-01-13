import AppRoutes from '@/routes/AppRoutes/appRoutes';
import { AppSidebar } from '@/shared-resources/appSidebar/appSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

const AppLayout: React.FC = () => (
  <SidebarProvider>
    {/* Sidebar */}
    <AppSidebar />

    {/* Main Content */}
    <main className='relative flex-1 p-6 flex overflow-x-hidden overflow-y-scroll'>
      <AppRoutes />
    </main>
  </SidebarProvider>
);

export default AppLayout;
