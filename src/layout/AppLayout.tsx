import AppRoutes from '@/routes/AppRoutes/appRoutes';
import { AppSidebar } from '@/shared-resources/appSidebar/appSidebar';
import { SidebarProvider } from '@/shared-resources/ui/sidebar';
import React from 'react';

const AppLayout: React.FC = () => (
  <SidebarProvider>
    {/* Sidebar */}
    <AppSidebar />

    {/* Main Content */}
    <main className='flex-1 p-6'>
      <AppRoutes />
    </main>
  </SidebarProvider>
);

export default AppLayout;
