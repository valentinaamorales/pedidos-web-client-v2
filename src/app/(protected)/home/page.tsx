'use client';

import { useProfile } from '@/hooks/use-profile';
import RoleDisplay from '@/components/common/role-display';
import RoleGuard from '@/components/auth/role-guard';

export default function Home() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!profile) {
    return (
      <main>
        <a href="/auth/login">Please log in to use the application!</a>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Bienvenido, {profile.full_name} 👋</h1>
        <RoleDisplay />
        {/* <img src={profile.picture} alt="Profile" className="rounded-full w-16 h-16" /> */}
        <h2 className="text-3xl font-bold">Codigo ERP: {profile.code_erp}</h2>
        <RoleGuard 
          allowedRoles={['admin']} 
          fallback={<p>You don't have permission to view this content</p>}
        >
          <div className="p-4 bg-green-100 rounded">
            <h2>Admin Panel</h2>
            <p>This content is only visible to administrators</p>
          </div>
        </RoleGuard>
      </div>
    </main>
  );
}