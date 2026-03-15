'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    // Carregar todos os perfis de usuários
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      // Para cada perfil, buscar dados adicionais
      const usersWithDetails = await Promise.all(
        profiles.map(async (profile) => {
          const [mobileRes, addressRes, bankRes, reimbursementsRes] = await Promise.all([
            supabase.from('mobile_lines').select('count').eq('user_id', profile.id).single(),
            supabase.from('addresses').select('*').eq('user_id', profile.id).maybeSingle(),
            supabase.from('bank_data').select('*').eq('user_id', profile.id).maybeSingle(),
            supabase.from('reimbursements').select('count').eq('user_id', profile.id).single()
          ])

          return {
            ...profile,
            mobile_count: mobileRes.count || 0,
            address: addressRes.data,
            bank: bankRes.data,
            reimbursements_count: reimbursementsRes.count || 0
          }
        })
      )
      setUsers(usersWithDetails)
    }
    setLoading(false)
  }

  const getPlanColor = (plan) => {
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
        👥 Gerenciar Usuários
      </h1>

      {/* Lista de usuários */}
      <div style={{
        backgroundColor: '#1A1A2E',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr',
          padding: '15px',
          backgroundColor: '#0F0F1A',
          fontWeight: 'bold',
          color: '#F5B041'
        }}>
          <div>Usuário</div>
          <div>Plano</div>
          <div>WhatsApp</div>
          <div>PIX</div>
          <div>Reembolsos</div>
          <div>Ações</div>
        </div>

        {users.map((user) => (
          <div key={user.id} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr',
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
              {user.whatsapp ? (
                <span style={{ color: '#00FF00' }}>✅ {user.whatsapp}</span>
              ) : (
                <span style={{ color: '#FF4444' }}>❌ Não cadastrado</span>
              )}
            </div>

            <div>
              {user.bank ? (
                <span style={{ color: '#00FF00' }}>✅ Cadastrado</span>
              ) : (
                <span style={{ color: '#FF4444' }}>❌ Não cadastrado</span>
              )}
            </div>

            <div>
              <span style={{
                padding: '5px 10px',
                backgroundColor: user.reimbursements_count > 0 ? '#6B2B8C' : '#333',
                borderRadius: '5px'
              }}>
                {user.reimbursements_count} solicitações
              </span>
            </div>

            <div>
              <button
                onClick={() => {
                  setSelectedUser(user)
                  setShowDetails(true)
                }}
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'transparent',
                  border: '1px solid #F5B041',
                  color: '#F5B041',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalhes do usuário */}
      {showDetails && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
              Detalhes do Usuário
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#999', fontSize: '14px' }}>Nome</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>{selectedUser.name}</div>

              <div style={{ color: '#999', fontSize: '14px' }}>Telefone</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>{selectedUser.phone}</div>

              <div style={{ color: '#999', fontSize: '14px' }}>WhatsApp</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {selectedUser.whatsapp || 'Não cadastrado'}
              </div>

              <div style={{ color: '#999', fontSize: '14px' }}>Plano</div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{
                  padding: '5px 10px',
                  backgroundColor: getPlanColor(selectedUser.plan_type),
                  color: 'white',
                  borderRadius: '5px'
                }}>
                  {selectedUser.plan_type}
                </span>
              </div>

              <div style={{ color: '#999', fontSize: '14px' }}>Dados PIX</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {selectedUser.bank ? (
                  <div>
                    <div>Tipo: {selectedUser.bank.pix_type}</div>
                    <div>Chave: {selectedUser.bank.pix_key}</div>
                  </div>
                ) : 'Não cadastrado'}
              </div>

              <div style={{ color: '#999', fontSize: '14px' }}>Endereço Residencial</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {selectedUser.address ? (
                  <div>
                    <div>{selectedUser.address.address}</div>
                    <div>Operadora: {selectedUser.address.carrier}</div>
                    <div>Valor: R$ {selectedUser.address.monthly_value}</div>
                  </div>
                ) : 'Não cadastrado'}
              </div>

              <div style={{ color: '#999', fontSize: '14px' }}>Linhas Mobile</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {selectedUser.mobile_count} linhas cadastradas
              </div>

              <div style={{ color: '#999', fontSize: '14px' }}>Reembolsos</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {selectedUser.reimbursements_count} solicitações
              </div>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#6B2B8C',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}