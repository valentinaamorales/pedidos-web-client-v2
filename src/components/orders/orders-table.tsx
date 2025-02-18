'use client';

import { useEffect, useState } from "react";
import { Order } from "@/types/orders";
import { DataTable } from "@/components/ui/data-table";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog";

// este getdata se debe pasar para /services ya que es el llamado a la api de pedidos
async function getData(): Promise<Order[]> {
  // aca se pone el llamado a la api para traer los pedidos de la db
  await new Promise((resolve) => setTimeout(resolve, 1000)); // delay de respuesta
  return [
    // datos de prueba
    {
      id: "12345",
      code: "67890",
      date: "20241209",
      details: "orden 1",
    },
    {
      id: "37637",
      code: "99999",
      date: "20241211",
      details: "orden 2",
    },
    {
      id: "12345",
      code: "67890",
      date: "20241209",
      details: "orden 1",
    },
    {
      id: "37637",
      code: "99999",
      date: "20241211",
      details: "orden 2",
    },
    {
      id: "12345",
      code: "67890",
      date: "20241209",
      details: "orden 1",
    },
    {
      id: "37637",
      code: "99999",
      date: "20241211",
      details: "orden 2",
    },
    {
      id: "12345",
      code: "67890",
      date: "20241209",
      details: "orden 1",
    },
    {
      id: "37637",
      code: "99999",
      date: "20241211",
      details: "orden 2",
    },
    {
      id: "12345",
      code: "67890",
      date: "20241209",
      details: "orden 1",
    },
    {
      id: "37637",
      code: "99999",
      date: "20241211",
      details: "orden 2",
    },
    {
      id: "12345",
      code: "67890",
      date: "20241209",
      details: "orden 1",
    },
    {
      id: "37637",
      code: "99999",
      date: "20241211",
      details: "orden 2",
    },
    {
      id: "12345",
      code: "67890",
      date: "20241209",
      details: "orden 1",
    },
    {
      id: "37637",
      code: "99999",
      date: "20241211",
      details: "orden 2",
    },
  ];
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const order = row.original;
      return <OrderDetailsDialog />;
    },
  },
];

export function OrdersTable() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData()
      .then((orders) => {
        setData(orders);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error consultando los pedidos", error);
        setLoading(false);
      });
  }, []);

  {
    loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Cargando
      </>
    ) : (
      ""
    );
  }

  return (
    <div className="container mx-auto ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

// aca puedo meter las columnas de la tabla, para que no quede tan raro
