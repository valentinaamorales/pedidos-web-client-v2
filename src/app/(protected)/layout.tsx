'use client';

import { usePathname } from 'next/navigation';
import CustomSidebar from '@/components/common/custom-sidebar';
import LanguageSelector from '@/components/common/language-selector';
import { Button } from '@/components/ui/button';
import {
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { sidebarItems } from '@/constants/sidebar';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  const currentTitle =
    sidebarItems.find(
      item => pathname === item.url || pathname.startsWith(`${item.url}/`),
    )?.title ?? 'Dashboard';

  return (
    <main className="min-h-screen">
      <SidebarProvider>
        <div className="flex w-full flex-row">
          <CustomSidebar />
          <SidebarInset className="flex flex-grow flex-col">
            <div className="grid h-16 grid-cols-2 border-b px-4 shadow-lg">
              <div className="flex items-center justify-start space-x-4">
                <SidebarTrigger />
                <h1 className="ml-4 truncate text-xl font-semibold">
                  {currentTitle}
                </h1>
              </div>
              <div className="flex items-center justify-end space-x-4">
                <LanguageSelector />
                <Button
                  className="rounded-lg bg-primary hover:bg-dark-green/90 hover:text-secondary"
                  asChild
                >
                  <a href="/auth/logout">
                    <LogOut />
                  </a>
                </Button>
              </div>
            </div>
            <div className="m-4 flex-grow overflow-auto p-2 sm:m-6 sm:p-4">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </main>
  );
}
