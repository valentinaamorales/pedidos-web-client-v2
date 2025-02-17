'use client';

import { useEffect, useState } from "react";
import { UsersListDto } from "@/types/users";
import { DataTable } from "@/components/ui/data-table";
import { UserService } from "@/app/api/users/user-service";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { OrderDetailsDialog } from "@/components/MyOrders/OrderDetailsDialog";


const columns: ColumnDef<UsersListDto>[] = [
    {
      accessorKey: "full_name",
      header: "Nombre",
    },
    {
      accessorKey: "user_type",
      header: "Tipo de usuario",
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => {
        return (
          <div className="text-center">
            Estado
          </div>
        );
      },
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <div className={`text-center ${isActive ? 'text-green-600' : 'text-red-600'}`}>
            {isActive ? 'Activo' : 'Inactivo'}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button variant="ghost" className="h-8 w-8 p-0">
            
          </Button>
        );
      },
    },
  ];

  export function UsersTable() {
    const [data, setData] = useState<UsersListDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await UserService.getUsers();
          setData([response]);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error fetching users');
          console.error('Error fetching users:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);

    if (loading) {
        return (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Cargando usuarios...</span>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="text-red-500 p-4 text-center">
            Error: {error}
          </div>
        );
      }
    
      return (
        <div className="container mx-auto py-4">
          <DataTable columns={columns} data={data} />
        </div>
      );
}
