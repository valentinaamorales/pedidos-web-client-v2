'use client'

import { useState, useEffect } from 'react'
import { getUserRole } from '@/app/actions/getUserRole'

export function useRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await getUserRole()
        setRole(userRole)
        console.log('Role:', userRole)
      } catch (error) {
        console.error('Error fetching role:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRole()
  }, [])

  return { role, loading }
}