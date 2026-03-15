'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingReimbursements: 0,
    totalReimbursements: 0,
    totalValue: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    // Carregar estatísticas
    const [
      { count: usersCount },
      { count: pendingCount },
      { data: reimbursements }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('reimbursements').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
      supabase.from('reimbursements').select('value')
    ])

    const totalValue = reimbursements?.reduce((acc, item) => acc + (item.value || 0), 0) || 0

    setStats({
      totalUsers: usersCount || 0,
      pendingReimbursements: pendingCount || 0,
      totalReimbursements: reimbursements?.length || 0,
      totalValue
    })
    setLoading(false)
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <h1 style={{ color: '#F5B041', marginBottom: '30px' }}>
        📊 Dashboard Administrativo
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>👥</div>
          <h3 style={{ color: '#F5B041' }}>Total de Usuários</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
        </div>

        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
          <h3 style={{ color: '#F5B041' }}>Reembolsos Pendentes</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.pendingReimbursements}</p>
        </div>

        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>💰</div>
          <h3 style={{ color: '#F5B041' }}>Total de Reembolsos</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalReimbursements}</p>
        </div>

        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>💵</div>
          <h3 style={{ color: '#F5B041' }}>Valor Total</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>R$ {stats.totalValue.toFixed(2)}</p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
          Ações Rápidas
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <a href="/admin/reimbursements" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#0F0F1A',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              Ver reembolsos pendentes
            </div>
          </a>
          <a href="/admin/users" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#0F0F1A',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              Gerenciar usuários
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}