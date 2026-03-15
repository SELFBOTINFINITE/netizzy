'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Verificar se o usuário é admin (você pode criar uma tabela de admins)
    // Por enquanto, vamos usar seu email como admin
    if (user.email === 'seuemail@admin.com') { // ← MUDE PARA SEU EMAIL
      setIsAdmin(true)
    } else {
      router.push('/dashboard')
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#0F0F1A',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        Carregando...
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div style={{
      backgroundColor: '#0F0F1A',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial'
    }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '250px',
        backgroundColor: '#1A1A2E',
        padding: '20px',
        borderRight: '1px solid #333'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '30px' }}>
          Admin Netizzy
        </h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#0F0F1A',
              borderRadius: '5px',
              color: 'white',
              transition: 'background 0.2s'
            }}>
              📊 Dashboard
            </div>
          </Link>

          <Link href="/admin/users" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#0F0F1A',
              borderRadius: '5px',
              color: 'white'
            }}>
              👥 Usuários
            </div>
          </Link>

          <Link href="/admin/reimbursements" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#0F0F1A',
              borderRadius: '5px',
              color: 'white'
            }}>
              💰 Reembolsos
            </div>
          </Link>

          <Link href="/admin/plans" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#0F0F1A',
              borderRadius: '5px',
              color: 'white'
            }}>
              📋 Planos
            </div>
          </Link>

          <Link href="/admin/settings" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#0F0F1A',
              borderRadius: '5px',
              color: 'white'
            }}>
              ⚙️ Configurações
            </div>
          </Link>

          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#0F0F1A',
              borderRadius: '5px',
              color: '#F5B041',
              marginTop: '20px'
            }}>
              ← Voltar ao Site
            </div>
          </Link>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div style={{
        marginLeft: '250px',
        padding: '20px'
      }}>
        {children}
      </div>
    </div>
  )
}