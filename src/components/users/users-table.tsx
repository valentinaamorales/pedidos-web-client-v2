'use client';

import { useEffect, useState, useRef } from "react";
import { UsersListDto } from "@/types/users";
import { DataTable } from "@/components/ui/data-table";
import { UserService } from "@/app/api/users/user-service";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDetailsDialog } from "./user-details-dialog";

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
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown />
          </Button>
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
          <Button variant="ghost" className="h-8 w-8 p-0" >
            <UserDetailsDialog id={user.id} />
          </Button>
        );
      },
    },
  ];

  export function UsersTable() {
    const [data, setData] = useState<UsersListDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
    });
    
    // Caché para almacenar páginas ya cargadas
    const pagesCache = useRef<Record<number, UsersListDto[]>>({});
    
    const fetchUsers = async () => {
      // Si ya tenemos esta página en caché, usarla sin hacer petición
      if (pagesCache.current[pagination.pageIndex]) {
        console.log(`Usando datos en caché para página ${pagination.pageIndex + 1}`);
        setData(pagesCache.current[pagination.pageIndex]);
        return;
      }
      
      setLoading(true);
      setError(null);
  
      try {
        const offset = pagination.pageIndex * pagination.pageSize;
        
        // Actualiza el servicio UserService para que acepte parámetros de paginación
        const response = await UserService.getUsers({
          limit: pagination.pageSize,
          offset: offset
        });
        
        const usersData = Array.isArray(response) ? response : [response];
        
        // Guardar en caché para uso futuro
        pagesCache.current[pagination.pageIndex] = usersData;
        
        setData(usersData);
        
        // Lógica para detectar si hay más páginas
        const hasMore = usersData.length === pagination.pageSize;
        
        if (!hasMore) {
          setPageCount(pagination.pageIndex + 1);
        } else if (pagination.pageIndex >= pageCount - 1) {
          setPageCount(pagination.pageIndex + 2);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
  
    // Cargar datos cuando cambia la paginación
    useEffect(() => {
      fetchUsers();
    }, [pagination.pageIndex, pagination.pageSize]);
  
    return (
      <div className="container mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {loading && data.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Cargando usuarios...</span>
          </div>
        ) : (
          <>
            <DataTable 
              columns={columns} 
              data={data}
              pagination={{
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                pageCount: pageCount,
                onPaginationChange: setPagination,
              }}
            />
            
            {data.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-500">
                No hay usuarios disponibles
              </div>
            )}
            
            {/* Controles de paginación */}
            {data.length > 0 && (
              <div className="flex items-center justify-between border-t px-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Página {pagination.pageIndex + 1}
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                      disabled={pagination.pageIndex === 0 || loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                      <span>Anterior</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                      disabled={pagination.pageIndex >= pageCount - 1 || loading || data.length < pagination.pageSize}
                    >
                      <span>Siguiente</span>
                      {loading ? (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }