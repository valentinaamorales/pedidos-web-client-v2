'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Address } from '@/types/addresses';
import { AddressService } from '@/app/api/interlocutors/address-service';

const FormSchema = z.object({
  merchandiseRecipient: z.string({
    required_error: 'Por favor selecciona una dirección de entrega.',
  }),
  billingRecipient: z.string({
    required_error: 'Por favor selecciona una dirección de facturación.',
  }),
  observations: z.string().optional(),
  file: z.any().optional(),
});

interface OrderAddressProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  onComplete: () => void;
}

export default function OrderAddress({ formData, updateFormData, onComplete }: OrderAddressProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAddresses, setDeliveryAddresses] = useState<Address[]>([]);
  const [invoiceAddresses, setInvoiceAddresses] = useState<Address[]>([]);
  const [isLoadingDelivery, setIsLoadingDelivery] = useState(false);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData || {},
  });

  // Cargar direcciones cuando el componente se monta
  useEffect(() => {
    if (!formData.customerId) {
      toast.error("No se ha seleccionado un cliente");
      return;
    }

    const fetchAddresses = async () => {
      // Cargar direcciones de entrega
      setIsLoadingDelivery(true);
      try {
        const deliveryData = await AddressService.getAddresses(formData.customerId, "delivery");
        setDeliveryAddresses(deliveryData);
      } catch (error) {
        console.error("Error fetching delivery addresses:", error);
        toast.error("Error al cargar direcciones de entrega");
      } finally {
        setIsLoadingDelivery(false);
      }

      // Cargar direcciones de facturación
      setIsLoadingInvoice(true);
      try {
        const invoiceData = await AddressService.getAddresses(formData.customerId, "invoice");
        setInvoiceAddresses(invoiceData);
      } catch (error) {
        console.error("Error fetching invoice addresses:", error);
        toast.error("Error al cargar direcciones de facturación");
      } finally {
        setIsLoadingInvoice(false);
      }
    };

    fetchAddresses();
  }, [formData.customerId]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      // Obtenemos las direcciones completas
      const selectedDeliveryAddress = deliveryAddresses.find(
        address => address.id === data.merchandiseRecipient
      );
      
      const selectedInvoiceAddress = invoiceAddresses.find(
        address => address.id === data.billingRecipient
      );

      const updatedFormData = {
        ...formData,
        ...data,
        // Guardamos información adicional para uso posterior
        deliveryAddress: selectedDeliveryAddress,
        invoiceAddress: selectedInvoiceAddress
      };
      
      updateFormData(updatedFormData);
      
      toast('Información del pedido guardada', {
        description: 'Las direcciones de entrega y facturación han sido guardadas correctamente.',
      });

      onComplete();
    } catch (error) {
      toast('Error', {
        description: 'Hubo un problema al guardar la información del pedido.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Información del Pedido
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Selecciona las direcciones de entrega y facturación para el pedido.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="merchandiseRecipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de Entrega</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingDelivery}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingDelivery ? "Cargando direcciones..." : "Seleccionar dirección"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingDelivery ? (
                          <SelectItem value="loading" disabled>Cargando direcciones...</SelectItem>
                        ) : deliveryAddresses.length === 0 ? (
                          <SelectItem value="empty" disabled>No hay direcciones disponibles</SelectItem>
                        ) : (
                          deliveryAddresses.map((address) => (
                            <SelectItem key={address.id} value={address.id}>
                              {address.name || "Dirección"} - {address.address}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingRecipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de Facturación</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingInvoice}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingInvoice ? "Cargando direcciones..." : "Seleccionar dirección"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingInvoice ? (
                          <SelectItem value="loading" disabled>Cargando direcciones...</SelectItem>
                        ) : invoiceAddresses.length === 0 ? (
                          <SelectItem value="empty" disabled>No hay direcciones disponibles</SelectItem>
                        ) : (
                          invoiceAddresses.map((address) => (
                            <SelectItem key={address.id} value={address.id}>
                              {address.name || "Dirección"} - {address.address}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa cualquier observación o instrucción especial para el pedido"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-dark-green hover:bg-dark-green/90 text-white"
                disabled={isSubmitting || isLoadingDelivery || isLoadingInvoice}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
