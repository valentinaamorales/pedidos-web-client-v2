import { type LucideIcon } from 'lucide-react';

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  children?: SidebarItem[];
  allowedRoles: string[];
}
