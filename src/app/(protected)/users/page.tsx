import RoleGuard from '@/components/auth/role-guard'
import UsersCard from '@/components/users/users-card';

export default function Users() {
  return (
    <RoleGuard
      allowedRoles={['admin']} 
      fallback={<div>Not authorized</div>}
    >
    <main>
      <UsersCard />
    </main>
    </RoleGuard>
  );
}


