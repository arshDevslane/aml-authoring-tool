import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '../ui/sidebar';
import { Home, Inbox } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AppSidebar: React.FC = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const items = [
    {
      title: 'Questions',
      url: '/app/questions',
      icon: Home,
    },
    {
      title: 'Question Sets',
      url: '/app/question-sets',
      icon: Inbox,
    },
  ];

  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleItemClick = (url: string) => {
    setActiveItem(url);
  };

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        {/* Sidebar Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'flex items-center space-x-2 px-2 py-1 rounded',
                      activeItem === item.url ? 'bg-gray-600' : ''
                    )}
                    onClick={() => handleItemClick(item.url)}
                  >
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-2 w-full${
                        activeItem ? 'bg-gray-600' : 'hover:bg-gray-600'
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
