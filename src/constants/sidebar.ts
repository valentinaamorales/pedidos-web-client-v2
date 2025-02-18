import { BadgePlus, Home, Archive, Users } from 'lucide-react';
import { SidebarItem } from '@/types/sidebarItem';

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Inicio',
    url: '/home',
    icon: Home,
    allowedRoles: ['admin', 'employee', 'customer'],
  },
  {
    title: 'Crear Pedido',
    url: '/orders/create',
    icon: BadgePlus,
    allowedRoles: ['admin', 'employee', 'customer'],
  },
  {
    title: 'Mis Pedidos',
    url: '/orders',
    icon: Archive,
    allowedRoles: ['admin', 'employee', 'customer'],
  },
  {
    title: 'Usuarios',
    url: '/users',
    icon: Users,
    allowedRoles: ['admin'],
  },
];
