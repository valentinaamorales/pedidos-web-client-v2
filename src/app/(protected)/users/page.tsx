import RoleGuard from '@/components/auth/role-guard'

export default function Users() {
  return (
    <RoleGuard
      allowedRoles={['admin']} 
      fallback={<div>Not authorized</div>}
    >
    <main>
      <h1>Users</h1>
    </main>
    </RoleGuard>
  );
}


