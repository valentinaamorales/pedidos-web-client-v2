import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import UserDetailsCard from "@/components/users/user-details-card";
// import OrderProductsCard from "@/components/MyOrders/OrderProductsCard";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface UserDetailsDialogProps {
  id: string;
}

export function UserDetailsDialog({ id }: UserDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-primary hover:text-secondary cursor-pointer">
          <span className="sr-only">Ver detalles del usuario {id}</span>
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DialogTrigger>
      
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Detalles del usuario</DialogTitle>
        </VisuallyHidden>
        <Tabs defaultValue="userDetails" className="w-full mx-auto mt-4">
          <TabsContent value="userDetails" className="mt-2">
            <UserDetailsCard id={id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
