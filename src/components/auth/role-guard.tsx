'use client'

import { useRole } from '@/hooks/use-role'
import { ReactNode } from 'react'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGuardProps) {
  const { role, loading } = useRole()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!role || !allowedRoles.includes(role)) {
    return fallback
  }

  return <>{children}</>
}