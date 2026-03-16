'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  name: string
  phone: string
  plan_type: 'mobile' | 'residencial' | 'ambos' | null
  created_at: string
}

export default function AdminPlansPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [stats, setStats] = useState({
    mobile: 0,
    residencial: 0,
    ambos: 0,
    total: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Carregar todos os usuários com seus planos
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && profiles) {
      setUsers(profiles as Profile[])
      
      // Calcular estatísticas
      const mobile = profiles.filter(p => p.plan_type === 'mobile').length
      const residencial = profiles.filter(p => p.plan_type === 'residencial').length
      const ambos = profiles.filter(p => p.plan_type === 'ambos').length
      
      setStats({
        mobile,
        residencial,
        ambos,
        total: profiles.length
      })
    }
    setLoading(false)
  }

  const updateUserPlan = async (userId: string, newPlan: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ plan_type: newPlan })
      .eq('id', userId)

    if (!error) {
      loadData()
    }
  }

  const getPlanColor = (plan: string | null) => {
    switch(plan) {
      case 'mobile': return '#6B2B8C'
      case 'residencial': return '#F5B041'
      case 'ambos': return '#00FF00'
      default: return '#666'
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
        Carregando...
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ color: '#F5B041', marginBottom: '30px' }}>
        📋 Gerenciar Planos
      </h1>

      {/* Cards de estatísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📱</div>
          <h3 style={{ color: '#F5B041' }}>Mobile</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.mobile}</p>
        </div>

        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏠</div>
          <h3 style={{ color: '#F5B041' }}>Residencial</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.residencial}</p>
        </div>

        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📱🏠</div>
          <h3 style={{ color: '#F5B041' }}>Ambos</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.ambos}</p>
        </div>

        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
          <h3 style={{ color: '#F5B041' }}>Total</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</p>
        </div>
      </div>

      {/* Lista de usuários com planos */}
      <div style={{
        backgroundColor: '#1A1A2E',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 2fr',
          padding: '15px',
          backgroundColor: '#0F0F1A',
          fontWeight: 'bold',
          color: '#F5B041'
        }}>
          <div>Usuário</div>
          <div>Plano Atual</div>
          <div>Alterar Plano</div>
        </div>

        {users.map((user) => (
          <div key={user.id} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 2fr',
            padding: '15px',
            borderBottom: '1px solid #333',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{user.name || 'Sem nome'}</div>
              <div style={{ color: '#999', fontSize: '12px' }}>{user.phone || 'Sem telefone'}</div>
            </div>

            <div>
              <span style={{
                padding: '5px 10px',
                backgroundColor: getPlanColor(user.plan_type),
                color: 'white',
                borderRadius: '5px',
                fontSize: '12px'
              }}>
                {user.plan_type || 'Não definido'}
              </span>
            </div>

            <div>
              <select
                value={user.plan_type || ''}
                onChange={(e) => updateUserPlan(user.id, e.target.value)}
                style={{
                  padding: '8px',
                  backgroundColor: '#0F0F1A',
                  color: 'white',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  width: '100%'
                }}
              >
                <option value="mobile">📱 Mobile</option>
                <option value="residencial">🏠 Residencial</option>
                <option value="ambos">📱🏠 Ambos</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}