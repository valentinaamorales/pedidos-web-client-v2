import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";

// import OrderDetailsCard from "@/components/MyOrders/OrderDetailsCard";
// import OrderProductsCard from "@/components/MyOrders/OrderProductsCard";

export function OrderDetailsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-primary hover:text-secondary"
        >
          <span className="sr-only">Ver detalles</span>
          <MoreHorizontal />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="orderDetails" className="w-full mx-auto mt-4">
          <TabsList className="flex flex-col sm:flex-row w-full gap-2 p-2 h-auto bg-white">
            <TabsTrigger
              value="orderDetails"
              className="flex-1 px-4 text-sm sm:text-base w-full bg-dark-green text-white rounded-md data-[state=active]:bg-dark-green/90 data-[state=active]:text-secondary  hover:text-secondary transition-colors"
            >
              Pedido
            </TabsTrigger>
            <TabsTrigger
              value="orderProducts"
              className="flex-1 px-4 text-sm sm:text-base w-full bg-dark-green text-white rounded-md data-[state=active]:bg-dark-green/90 data-[state=active]:text-secondary  hover:text-secondary transition-colors"
            >
              Productos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orderDetails" className="mt-2">
            {/* <OrderDetailsCard /> */}
            <h1>details</h1>
          </TabsContent>
          <TabsContent value="orderProducts" className="mt-2">
            {/* <OrderProductsCard /> */}
            <h1>products</h1>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-end">
          <Link href="/orders/create">
            <Button className="bg-primary hover:bg-primary hover:text-secondary">
              Pedir de nuevo
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
