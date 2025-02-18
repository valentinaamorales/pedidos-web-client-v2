'use client';

import { UserProfile } from "@/types/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleDisplay from "@/components/common/role-display";

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Perfil</CardTitle>
        <RoleDisplay />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nombre Completo</h3>
            <p className="mt-1 text-lg font-medium">{profile.full_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Correo Electrónico</h3>
            <p className="mt-1 text-lg font-medium">{profile.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Código ERP</h3>
            <p className="mt-1 text-lg font-medium">{profile.code_erp}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tipo de Usuario</h3>
            <p className="mt-1 text-lg font-medium capitalize">{profile.user_type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Estado</h3>
            <p className={`mt-1 text-lg font-medium ${profile.is_active ? 'text-green-600' : 'text-red-600'}`}>
              {profile.is_active ? 'Activo' : 'Inactivo'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Auth0 ID</h3>
            <p className="mt-1 text-sm font-medium text-gray-600 truncate">{profile.auth0_id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}