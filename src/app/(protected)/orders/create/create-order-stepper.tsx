"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CircleArrowLeft, CircleArrowRight, CircleCheck } from "lucide-react"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Product } from "@/types/products"
import { useRouter } from "next/navigation"
import { OrderService} from "@/app/api/order/order-service"

const SelectCompany = dynamic(() => import("./select-company/SelectCompany"))
const SelectCustomer = dynamic(() => import("./select-customer/SelectCustomer"))
const OrderAddress = dynamic(() => import("./order-address/OrderAddress"))
const SelectProducts = dynamic(() => import("./select-products/SelectProducts"))

const steps = [
  { id: "company", title: "Seleccionar Empresa", component: SelectCompany },
  { id: "customer", title: "Seleccionar Cliente", component: SelectCustomer },
  { id: "order", title: "Información del Pedido", component: OrderAddress },
  { id: "products", title: "Agregar Productos", component: SelectProducts },
]

interface FormData {
  company?: string;
  companyId?: string | number;
  customer?: string;
  customerId?: string | number;
  orderInfo?: any;
  products: Array<Product & { quantity: number }>;
  observations: string;
  priceListId?: number;
  deliveryAddress?: any;
  invoiceAddress?: any;
}

export function CreateOrderStepper() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    company: undefined,
    customer: undefined,
    orderInfo: undefined,
    products: [],
    observations: "",
  })

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: any) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      console.log("Nuevo formData:", newData); // Añadir log para debug
      return newData;
    });
  }

  const handleStepComplete = () => {
    // Solo avanzar si no es el último paso
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!formData.companyId || !formData.customerId) {
        throw new Error("Selecciona una empresa y un cliente para continuar")
      }

      if (!formData.products || formData.products.length === 0) {
        throw new Error("Agrega al menos un producto para continuar")
      }

      // Formatear la fecha actual en formato YYYY-MM-DD
      const shippingAddressId = formData.deliveryAddress?.id || null
      const invoiceAddressId = formData.invoiceAddress?.id || null

      const today = new Date();
      const dateOrder = today.toISOString().replace('T', ' ').split('.')[0];

      //Preparar los items del pedido
      const items = formData.products.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      }))

      //constuir el objeto de pedido
      const orderData = {
        companyId: Number(formData.companyId),
        customerId: Number(formData.customerId),
        dateOrder,
        priceListId: formData.priceListId || null,
        customerShippingAdressId: shippingAddressId ? Number(shippingAddressId) : null,
        customerInvoiceAdressId: invoiceAddressId ? Number(invoiceAddressId) : null,
        items,
      }

      console.log("Datos del pedido:", orderData);

      const response = await OrderService.createOrder(orderData);

      toast.success("Pedido creado exitosamente!", {
        description: `El pedido #${response.id} ha sido creado correctamente.`,
        duration: 5000
      })

      setTimeout(() => {
        router.push('/orders/');
      }, 1500);

    } catch (error: any) {
      toast("Error al crear el pedido",
        {description: error.message || "Ha ocurrido un error al enviar tu pedido. Por favor intenta nuevamente."
      });
    } finally{
      setIsSubmitting(false);
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm sm:text-base mb-2
                  ${
                    index < currentStep
                      ? "bg-dark-green text-white"
                      : index === currentStep
                      ? "bg-dark-green text-white border-2 border-dark-green"
                      : "bg-gray-100 text-gray-400"
                  }`}
              >
                {index < currentStep ? <CircleCheck className="h-5 w-5" />: index + 1}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  index <= currentStep ? "text-dark-green" : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Form */}
      <div className="mb-6">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          onComplete={handleStepComplete}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pb-8">
        {currentStep > 0 ? (
          <Button
            variant="outline"
            onClick={prevStep}
            className="flex items-center"
          >
            <CircleArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

