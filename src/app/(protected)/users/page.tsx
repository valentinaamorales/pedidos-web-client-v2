import RoleGuard from '@/components/auth/role-guard'
import UsersCard from '@/components/users/users-card';
import { redirect } from 'next/navigation';

export default function Users() {
  return (
    <RoleGuard
      allowedRoles={['admin']} 
      fallback={<div>Not Authorized</div>} //redirect('/home')
    >
    <main>
      <UsersCard />
    </main>
    </RoleGuard>
  );
}


