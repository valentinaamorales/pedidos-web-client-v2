'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { sidebarItems } from '@/constants/sidebar';
import { cn } from '@/lib/utils';
import { useUser } from '@auth0/nextjs-auth0';

const CustomSidebar = () => {
  const { user, isLoading } = useUser();
  const { state } = useSidebar();
  const pathname = usePathname();

  const isSidebarCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-primary">
      <SidebarHeader className="my-6 flex items-center justify-center sm:my-8">
        <Image
          src="/logo_iluma_small.svg"
          width={140}
          height={200}
          alt="Iluma Logo"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map(sidebarItem => (
                <SidebarMenuItem key={sidebarItem.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'sm:h-18 flex h-14 items-center justify-start',
                      'text-base font-semibold sm:text-lg',
                      'transition-all duration-200 ease-in-out',
                      'hover:bg-secondary/10 hover:text-secondary',
                      pathname === sidebarItem.url &&
                        'bg-secondary/10 text-secondary',
                    )}
                  >
                    <Link
                      href={sidebarItem.url}
                      className="flex w-full items-center px-4"
                    >
                      <sidebarItem.icon className="mr-3 h-10 w-10 sm:h-9 sm:w-9" />
                      <span className="truncate">{sidebarItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!isSidebarCollapsed && (
        <SidebarFooter>
          {isLoading ? (
            <div className="flex h-4 flex-col items-center justify-center">
              <div className="h-4 w-4 animate-bounce rounded-full bg-stone-200" />
              <div className="sr-only">Loading...</div>
            </div>
          ) : (
            user && (
              <div className="flex h-4 flex-col items-center justify-center">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs font-medium text-white">{user.email}</p>
              </div>
            )
          )}
          <div className="flex h-16 flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Iluma Alliance
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default CustomSidebar;
