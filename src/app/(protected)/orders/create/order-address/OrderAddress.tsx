'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
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
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  salesDocument: z.string({
    required_error: 'Por favor selecciona un documento de venta.',
  }),
  merchandiseRecipient: z.string({
    required_error: 'Por favor selecciona un destinatario de mercancía.',
  }),
  billingRecipient: z.string({
    required_error: 'Por favor selecciona un destinatario de facturación.',
  }),
  paymentResponsible: z.string({
    required_error: 'Por favor selecciona un responsable de pago.',
  }),
  file: z.any().optional(),
});

interface OrderAddressProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  onComplete: () => void;
}

export default function OrderAddress({ formData, updateFormData, onComplete }: OrderAddressProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData || {},
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateFormData(data);
      toast('Información del pedido guardada', {
        description: 'Los datos del pedido han sido guardados correctamente.',
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
          Completa la información de entrega y facturación del pedido.
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
                name="salesDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento de Venta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Premex">Premex</SelectItem>
                        <SelectItem value="Nutreo">Nutreo</SelectItem>
                        <SelectItem value="Adiquim">Adiquim</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchandiseRecipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatario Mercancía</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALIMENTOS CONCENTRADOS DEL CARIBE">
                          ALIMENTOS CONCENTRADOS DEL CARIBE
                        </SelectItem>
                        <SelectItem value="ALIMENTOS FINCA S.A.S">
                          ALIMENTOS FINCA S.A.S
                        </SelectItem>
                        <SelectItem value="AMASA S.A.S">AMASA S.A.S</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="billingRecipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatario de Facturación</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALIMENTOS CONCENTRADOS DEL CARIBE">
                          ALIMENTOS CONCENTRADOS DEL CARIBE
                        </SelectItem>
                        <SelectItem value="ALIMENTOS FINCA S.A.S">
                          ALIMENTOS FINCA S.A.S
                        </SelectItem>
                        <SelectItem value="AMASA S.A.S">AMASA S.A.S</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentResponsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable de Pago</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALIMENTOS CONCENTRADOS DEL CARIBE">
                          ALIMENTOS CONCENTRADOS DEL CARIBE
                        </SelectItem>
                        <SelectItem value="ALIMENTOS FINCA S.A.S">
                          ALIMENTOS FINCA S.A.S
                        </SelectItem>
                        <SelectItem value="AMASA S.A.S">AMASA S.A.S</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjuntar Archivo (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={e => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          field.onChange(files);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-dark-green text-white hover:bg-dark-green/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando
                  </>
                ) : (
                  'Continuar'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
