'use client';

import { useProfile } from '@/hooks/use-profile';
import RoleDisplay from '@/components/common/role-display';
import RoleGuard from '@/components/auth/role-guard';
import { ProfileCard } from '@/components/home/profile-card';
import {Loader2} from 'lucide-react';


export default function Home() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-lg text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (!profile) {
    return null;
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