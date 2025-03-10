import UnauthorizedPage from '@/app/unauthorized/page';
import RoleGuard from '@/components/auth/role-guard'
import UsersCard from '@/components/users/users-card';
import { redirect } from 'next/navigation';

export default function Users() {
  return (
    <RoleGuard
      allowedRoles={['admin']} 
      fallback={<UnauthorizedPage/>}
    >
    <main>
      <UsersCard />
    </main>
    </RoleGuard>
  );
}


