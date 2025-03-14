"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CircleArrowLeft, CircleArrowRight, CircleCheck } from "lucide-react"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Product } from "@/types/products"

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
}

export function CreateOrderStepper() {
  const [currentStep, setCurrentStep] = useState(0)
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
    console.log("Actualizando formData con:", data); // Añadir log para debug
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
    try {
      // Here you would submit the complete form data to your API
      console.log("Submitting order:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast("Pedido creado con éxito",
        {description: "Tu pedido ha sido enviado correctamente.",
      })

      // Reset form or redirect
    } catch (error) {
      toast("Error al crear el pedido",
        {description: "Ha ocurrido un error al enviar tu pedido. Por favor intenta nuevamente."
      })
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
                {index < currentStep ? "✓" : index + 1}
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

