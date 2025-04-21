'use client';

import { useEffect, useState, useRef } from "react";
import { Order, OrderResponseDTO, OrdersQueryParams } from "@/types/orders";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog";
import { OrderService } from "@/app/api/order/order-service";

interface OrdersTableProps {
  userCreateOrderId?: number;
  isCustomerView?: boolean;
}

function mapOrderResponseToTableFormat(order: OrderResponseDTO): Order {
  return {
    id: order.id,
    name: order.name || '',
    dateOrder: order.dateOrder,
    state: order.state,
    customer: order.customer,
    amounTotal: order.amounTotal
  };
}

// Función auxiliar para formatear fechas en formato legible
function formatDate(dateString: string): string {
  try {
    // El formato viene como "DD-MM-YYYY HH:MM:SS"
    const [datePart, timePart] = dateString.split(' ');
    
    // Si solo queremos quitar los segundos del tiempo
    const timeWithoutSeconds = timePart ? timePart.split(':').slice(0, 2).join(':') : '';
    
    // Retornamos un formato amigable con fecha y hora
    return timeWithoutSeconds ? `${datePart} ${timeWithoutSeconds}` : datePart;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return dateString;
  }
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Código",
    cell: ({ row }) => {
      const orderCode = row.getValue("name") as string;
      const orderId = row.original.id;
      return (
        <Button
          variant="link"
          className="p-0 text-blue-600 hover:underline"
          onClick={() => {
            // Abrir ventana popup con la URL deseada
            window.open(
              `/orders/popup/${orderId}`, 
              `Pedido ${orderCode}`,
              'width=600,height=400,resizable=yes'
            );
          }}
        >
          {orderCode}
        </Button>
      );
    }
  },
  {
    accessorKey: "dateOrder",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("dateOrder") as string;
      return formatDate(dateValue);
    }
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const order = row.original;
      return <OrderDetailsDialog orderId={order.id}/>;
    },
  },
];

export function OrdersTable({ userCreateOrderId, isCustomerView = false }: OrdersTableProps) {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0); // Total de páginas estimado
  const [pagination, setPagination] = useState({
    pageIndex: 0, // página actual (inicia en 0)
    pageSize: 10, // tamaño de página
  });
  
  const pagesCache = useRef<Record<number, Order[]>>({});

  // Obtiene datos para la página actual
  const fetchOrders = async () => {
    // Si no hay ID de usuario, no podemos filtrar los pedidos
    if (!userCreateOrderId) {
      console.warn("No se pudo obtener el ID del usuario para filtrar pedidos.");
      setLoading(false);
      return;
    }
  
    if(pagesCache.current[pagination.pageIndex]) {
      setData(pagesCache.current[pagination.pageIndex]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convertir pageIndex a offset para la API
      const offset = pagination.pageIndex * pagination.pageSize;
      
      const ordersData = await OrderService.getOrders({
        limit: pagination.pageSize,
        offset: offset,
        userCreateOrderId: userCreateOrderId 
      });
      
      // Convertir al formato de la tabla
      const formattedData = ordersData.map(mapOrderResponseToTableFormat);
      pagesCache.current[pagination.pageIndex] = formattedData;
      
      setData(formattedData);
      
      const hasMore = formattedData.length === pagination.pageSize;
      
      // Actualizar el estimado de pageCount
      if (!hasMore) {
        setPageCount(pagination.pageIndex + 1);
      } else if (pagination.pageIndex >= pageCount - 1) {
        // Si estamos en la última página conocida y aún hay más, incrementar
        setPageCount(pagination.pageIndex + 2);
      }
      
    } catch (error: any) {
      console.error("Error consultando los pedidos:", error);
      setError(error.message || "Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  // Actualizamos datos cuando cambia la paginación
  useEffect(() => {
    fetchOrders();
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
          <span>Cargando pedidos...</span>
        </div>
      ) : (
        <>
          <DataTable 
            columns={columns} 
            data={data}
            // Pasamos la configuración de paginación y pageCount al componente DataTable
            pagination={{
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              pageCount: pageCount,
              onPaginationChange: setPagination,
            }}
          />
          
          {data.length === 0 && !loading && (
            <div className="text-center py-10 text-gray-500">
              No hay pedidos disponibles
            </div>
          )}
          
          {/* Controles de paginación custom fuera del DataTable */}
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