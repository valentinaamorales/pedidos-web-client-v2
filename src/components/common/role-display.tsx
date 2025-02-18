'use client'

import { useRole } from '@/hooks/use-role'
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function RoleDisplay() {
  const { role, loading } = useRole()

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  return (
    <Badge variant="secondary" className="text-sm font-semibold capitalize bg-primary text-white">
      {role}
    </Badge>
  )
}