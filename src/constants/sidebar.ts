import { BadgePlus, Home, Archive, Users } from 'lucide-react';
import { SidebarItem } from '@/types/sidebarItem';

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Inicio',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Crear Pedido',
    url: '/orders/create',
    icon: BadgePlus,
  },
  {
    title: 'Mis Pedidos',
    url: '/orders',
    icon: Archive,
  },
  {
    title: 'Usuarios',
    url: '/users',
    icon: Users,
  },
];
