'use client';

import { useProfile } from '@/hooks/use-profile';
import RoleDisplay from '@/components/common/role-display';
import RoleGuard from '@/components/auth/role-guard';
import { ProfileCard } from '@/components/home/profile-card';
import {Loader2} from 'lucide-react';


export default function Home() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!profile) {
    return (
      <main>
        <a href="/auth/login">Por favor inicia sesión para usar la aplicación!</a>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Bienvenido, {profile.full_name} 👋</h1> 
        <ProfileCard profile={profile} />
        {/* <RoleGuard 
          allowedRoles={['admin']} 
          fallback={<p>You don't have permission to view this content</p>}
        > */}
          {/* <div className="p-4 bg-green-100 rounded">
            <h2>Admin Panel</h2>
            <p>This content is only visible to administrators</p>
          </div> */}
        {/* </RoleGuard> */}
      </div>
    </main>
  );
}