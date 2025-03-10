"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Trash2, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Product {
  id: string
  name: string
  quantity: number
  unit: string
}

interface SelectProductsProps {
  formData?: {
    products?: Product[]
    observations?: string
  }
  updateFormData: (data: { products: Product[]; observations: string }) => void
}

export default function SelectProducts({ formData, updateFormData }: SelectProductsProps) {
  const [products, setProducts] = useState<Product[]>(formData?.products || [])
  const [observations, setObservations] = useState(formData?.observations || "")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock product catalog
  const productCatalog = [
    { id: "1", name: "Producto A", unit: "kg" },
    { id: "2", name: "Producto B", unit: "L" },
    { id: "3", name: "Producto C", unit: "unidad" },
    { id: "4", name: "Producto D", unit: "kg" },
    { id: "5", name: "Producto E", unit: "L" },
  ]

  useEffect(() => {
    const filtered = productCatalog
      .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((product) => ({ ...product, quantity: 0 }))
    setFilteredProducts(filtered)
  }, [searchTerm])

  const addProduct = (product: Product) => {
    const existingProduct = products.find((p) => p.id === product.id)

    if (existingProduct) {
      toast("Producto ya agregado", { description: "Este producto ya está en tu lista." })
      return
    }

    setProducts([...products, { ...product, quantity: 1 }])
    setIsDialogOpen(false)

    toast("Producto agregado", { description: `${product.name} ha sido agregado a tu pedido.` })
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))

    toast("Producto eliminado", { description: "El producto ha sido eliminado de tu pedido." })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return

    setProducts(products.map((product) => (product.id === id ? { ...product, quantity } : product)))
  }

  const handleSave = () => {
    updateFormData({ products, observations })

    toast("Productos guardados", { description: `Se han guardado ${products.length} productos en tu pedido.` })
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Agregar Productos</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Selecciona los productos que deseas añadir al pedido.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h3 className="text-lg font-medium">Productos seleccionados ({products.length})</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-dark-green hover:bg-dark-green/90 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-[95vw] w-full">
              <DialogHeader>
                <DialogTitle>Buscar Productos</DialogTitle>
                <DialogDescription>Busca y selecciona los productos que deseas agregar a tu pedido.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 my-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="search" className="sr-only">
                    Buscar
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Buscar productos..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Unidad: {product.unit}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => addProduct(product)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No se encontraron productos</p>
                )}
              </ScrollArea>
              <DialogFooter className="sm:justify-end">
                <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {products.length > 0 ? (
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="hidden sm:block">
              {/* Desktop table view */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Producto</th>
                    <th className="text-left py-3 font-medium">Cantidad</th>
                    <th className="text-left py-3 font-medium">Unidad</th>
                    <th className="text-right py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center">{product.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-3">{product.unit}</td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">Unidad: {product.unit}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 -mt-1 -mr-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium">Cantidad:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{product.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">No hay productos agregados</p>
            <p className="text-sm text-muted-foreground mt-1">Haz clic en "Agregar Producto" para comenzar</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="observations">Observaciones</Label>
          <Textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Añade cualquier observación adicional aquí"
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-dark-green hover:bg-dark-green/90 w-full sm:w-auto">
            Guardar Productos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

