"use client"
 
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
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
  onValidationChange?: (isValid: boolean) => void;
}
 
const SelectCompany = forwardRef(({ formData, updateFormData, onComplete, onValidationChange }: SelectCompanyProps, ref) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData || {},
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (onValidationChange) {
        // Validar cuando cambia el valor
        onValidationChange(!!values.company);
      }
    });
    
    // También validar inmediatamente con el valor actual
    if (onValidationChange) {
      const currentValue = form.getValues("company");
      onValidationChange(!!currentValue);
    }
    
    return () => subscription.unsubscribe();
  }, [form, onValidationChange]);

  useEffect(() => {
    if (onValidationChange) {
      const currentValue = form.getValues("company");
      onValidationChange(!!currentValue);
    }
  }, [form, onValidationChange]);
  
  // Exponer método saveData al componente padre
  useImperativeHandle(ref, () => ({
    saveData: () => {
      const data = form.getValues();
      
      // Validar que se haya seleccionado una compañía
      if (!data.company) {
        toast.error("Por favor selecciona una empresa");
        return false;
      }
      
      // Buscar la compañía completa
      const selectedCompany = companies.find(company => company.name === data.company);
      
      if (!selectedCompany) {
        toast.error("No se encontró la empresa seleccionada");
        return false;
      }
      
      // Actualizar formData
      updateFormData({
        ...formData,
        company: data.company,
        companyId: selectedCompany.id
      });
      
      return true; // Permitir continuar
    }
  }));

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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

SelectCompany.displayName = "SelectCompany";
export default SelectCompany;