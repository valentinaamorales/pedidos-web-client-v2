'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserService } from "@/app/api/users/user-service";
import { UserProfile } from "@/types/users";
import { Loader2, Save, Edit2 } from "lucide-react";

interface UserDetailsCardProps {
    id: string;
  }

const UserDetailsCard = ({ id }: UserDetailsCardProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await UserService.getUserById(id);
      setProfile(data);
      setEditedProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      setLoading(true);
      await UserService.updateProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          Detalles del Usuario
        </CardTitle>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={handleSave} variant="default" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancelar
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-2 sm:p-4 space-y-4">
        <div>
          <Label htmlFor="full_name">Nombre Completo</Label>
          <Input
            id="full_name"
            value={editedProfile?.full_name || ''}
            onChange={(e) => setEditedProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
            readOnly={!isEditing}
            className="focus-visible:ring-neutral-50"
          />
        </div>
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            value={editedProfile?.email || ''}
            onChange={(e) => setEditedProfile(prev => prev ? {...prev, email: e.target.value} : null)}
            readOnly={!isEditing}
            className="focus-visible:ring-neutral-50"
          />
        </div>
        <div>
          <Label htmlFor="code_erp">Código ERP</Label>
          <Input
            id="code_erp"
            value={editedProfile?.code_erp || ''}
            onChange={(e) => setEditedProfile(prev => prev ? {...prev, code_erp: e.target.value} : null)}
            readOnly={!isEditing}
            className="focus-visible:ring-neutral-50"
          />
        </div>
        <div>
          <Label htmlFor="user_type">Tipo de Usuario</Label>
          <Input
            id="user_type"
            value={editedProfile?.user_type || ''}
            readOnly
            className="focus-visible:ring-neutral-50"
          />
        </div>
        <div>
          <Label htmlFor="is_active">Estado</Label>
          <Input
            id="is_active"
            value={editedProfile?.is_active ? 'Activo' : 'Inactivo'}
            readOnly
            className="focus-visible:ring-neutral-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard;