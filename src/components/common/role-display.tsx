'use client'

import { useRole } from '@/hooks/use-role'

export default function RoleDisplay() {
  const { role, loading } = useRole()

  if (loading) {
    return <p>Loading role...</p>
  }

  return <p className="text-lg">Your role is: <span className="font-semibold">{role}</span></p>
}