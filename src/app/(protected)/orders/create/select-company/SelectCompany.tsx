"use client"
 
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { CompanyService } from "@/app/api/companies/company-service"
import { Company } from "@/types/companies"
 
const FormSchema = z.object({
  company: z.string({
    required_error: "Por favor selecciona una empresa.",
  }),
})
 
interface SelectCompanyProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  onComplete: () => void;
}
 
export default function SelectCompany({ formData, updateFormData, onComplete }: SelectCompanyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData || {},
  })
 
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await CompanyService.getCompanies();
        setCompanies(data);
      } catch (error) {
        toast.error("Error al cargar las empresas");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchCompanies();
  }, []);
 
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    try {
      // Buscar el objeto de la compañía completo por su nombre
      const selectedCompany = companies.find(company => company.name === data.company);
      
      if (!selectedCompany) {
        toast.error("No se encontró la empresa seleccionada");
        return;
      }
      
      // Add debugging
      console.log("Selected company:", selectedCompany);
      
      // Actualizar formData con el objeto completo de la compañía
      const updatedFormData = {
        ...formData,
        company: data.company,
        companyId: selectedCompany.id // Make sure this is not undefined
      };
      
      console.log("Updated formData:", updatedFormData);
      updateFormData(updatedFormData);
      
      toast.success("Empresa seleccionada correctamente");
      onComplete();
    } catch (error) {
      toast.error("Error al seleccionar la empresa");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
 
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Seleccionar Empresa</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Selecciona la empresa para la cual deseas crear el pedido.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccionar empresa"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Cargando empresas...</SelectItem>
                      ) : (
                        companies.map((company) => (
                          <SelectItem key={company.id} value={company.name}>
                            {company.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-dark-green hover:bg-dark-green/90 text-white"
                disabled={isSubmitting || isLoading}
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
  )
}