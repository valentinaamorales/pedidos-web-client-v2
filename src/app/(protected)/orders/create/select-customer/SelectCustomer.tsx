"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const FormSchema = z.object({
  customer: z.string({
    required_error: "Por favor selecciona un cliente.",
  }),
})

interface SelectCustomerProps {
    formData: Record<string, any>;
    updateFormData: (data: Record<string, any>) => void;
    onComplete: () => void;
  }
  

export default function SelectCustomer({ formData, updateFormData, onComplete }: SelectCustomerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData || {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      updateFormData(data)
      toast(
        "Cliente seleccionado",
        {description: `Has seleccionado a ${data.customer}`}
      )

      onComplete()
    } catch (error) {
      toast(
        "Error",
        {description: "Hubo un problema al seleccionar el cliente."}
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Seleccionar Cliente</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Selecciona el cliente para este pedido.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALIMENTOS CONCENTRADOS DEL CARIBE">
                        ALIMENTOS CONCENTRADOS DEL CARIBE
                      </SelectItem>
                      <SelectItem value="ALIMENTOS FINCA S.A.S">ALIMENTOS FINCA S.A.S</SelectItem>
                      <SelectItem value="AMASA S.A.S">AMASA S.A.S</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-dark-green hover:bg-dark-green/90 text-white" disabled={isSubmitting}>
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
  )
}

