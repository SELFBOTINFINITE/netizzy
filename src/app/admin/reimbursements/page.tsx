'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Reimbursement {
  id: string
  user_id: string
  source_type: 'mobile' | 'residencial'
  source_id: string | null
  value: number
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'pago'
  receipt_url: string | null
  created_at: string
  approved_at: string | null
  profiles?: {
    name: string
    phone: string
    plan_type: string
  }
}

export default function AdminReimbursementsPage() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [filter, setFilter] = useState('todos')
  const supabase = createClient()

  useEffect(() => {
    loadReimbursements()
  }, [])

  const loadReimbursements = async () => {
    // Carregar todos os reembolsos com dados do usuário
    const { data, error } = await supabase
      .from('reimbursements')
      .select(`
        *,
        profiles!reimbursements_user_id_fkey (
          name,
          phone,
          plan_type
        )
      `)
      .order('created_at', { ascending: false })

    if (!error) {
      setReimbursements(data as Reimbursement[] || [])
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('reimbursements')
      .update({ 
        status: newStatus,
        approved_at: newStatus === 'aprovado' ? new Date().toISOString() : null
      })
      .eq('id', id)

    if (!error) {
      loadReimbursements()
      setShowDetails(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'aprovado': return '#00FF00'
      case 'rejeitado': return '#FF4444'
      case 'pago': return '#F5B041'
      default: return '#6B2B8C'
    }
  }

  const filteredReimbursements = filter === 'todos' 
    ? reimbursements 
    : reimbursements.filter(r => r.status === filter)

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
        💰 Gerenciar Reembolsos
      </h1>

      {/* Filtros */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {['todos', 'pendente', 'aprovado', 'rejeitado', 'pago'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === status ? '#F5B041' : '#1A1A2E',
              color: filter === status ? '#0F0F1A' : 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: filter === status ? 'bold' : 'normal'
            }}
          >
            {status === 'todos' ? '📋 Todos' : 
             status === 'pendente' ? '⏳ Pendentes' :
             status === 'aprovado' ? '✅ Aprovados' :
             status === 'rejeitado' ? '❌ Rejeitados' : '💰 Pago'}
          </button>
        ))}
      </div>

      {/* Lista de reembolsos */}
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
          <div>Tipo</div>
          <div>Valor</div>
          <div>Data</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {filteredReimbursements.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            Nenhum reembolso encontrado
          </div>
        ) : (
          filteredReimbursements.map((item) => (
            <div key={item.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr',
              padding: '15px',
              borderBottom: '1px solid #333',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.profiles?.name || 'Usuário'}</div>
                <div style={{ color: '#999', fontSize: '12px' }}>{item.profiles?.phone}</div>
              </div>
              
              <div>
                {item.source_type === 'mobile' ? '📱 Mobile' : '🏠 Residencial'}
              </div>

              <div style={{ fontWeight: 'bold' }}>
                R$ {item.value.toFixed(2)}
              </div>

              <div style={{ fontSize: '14px' }}>
                {new Date(item.created_at).toLocaleDateString('pt-BR')}
              </div>

              <div>
                <span style={{
                  padding: '5px 10px',
                  backgroundColor: getStatusColor(item.status),
                  color: '#0F0F1A',
                  borderRadius: '5px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {item.status.toUpperCase()}
                </span>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSelectedReimbursement(item)
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
          ))
        )}
      </div>

      {/* Modal de detalhes */}
      {showDetails && selectedReimbursement && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
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
            width: '90%'
          }}>
            <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
              Detalhes do Reembolso
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#999' }}>Usuário</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {selectedReimbursement.profiles?.name}
              </div>

              <div style={{ color: '#999' }}>Telefone</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {selectedReimbursement.profiles?.phone}
              </div>

              <div style={{ color: '#999' }}>Tipo</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {selectedReimbursement.source_type === 'mobile' ? '📱 Mobile' : '🏠 Residencial'}
              </div>

              <div style={{ color: '#999' }}>Valor</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#F5B041' }}>
                R$ {selectedReimbursement.value.toFixed(2)}
              </div>

              <div style={{ color: '#999' }}>Data da solicitação</div>
              <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                {new Date(selectedReimbursement.created_at).toLocaleString('pt-BR')}
              </div>

              {selectedReimbursement.receipt_url && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#999' }}>Comprovante</div>
                  <a 
                    href={selectedReimbursement.receipt_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '5px',
                      padding: '10px',
                      backgroundColor: '#6B2B8C',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '5px'
                    }}
                  >
                    📎 Visualizar comprovante
                  </a>
                </div>
              )}

              <div style={{ color: '#999' }}>Status atual</div>
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: getStatusColor(selectedReimbursement.status),
                  color: '#0F0F1A',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}>
                  {selectedReimbursement.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Botões de ação */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => updateStatus(selectedReimbursement.id, 'aprovado')}
                style={{
                  padding: '10px',
                  backgroundColor: '#00FF00',
                  color: '#0F0F1A',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ✅ Aprovar
              </button>
              <button
                onClick={() => updateStatus(selectedReimbursement.id, 'rejeitado')}
                style={{
                  padding: '10px',
                  backgroundColor: '#FF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ❌ Rejeitar
              </button>
              <button
                onClick={() => updateStatus(selectedReimbursement.id, 'pago')}
                style={{
                  padding: '10px',
                  backgroundColor: '#F5B041',
                  color: '#0F0F1A',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                💰 Marcar Pago
              </button>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                border: '2px solid #666',
                color: 'white',
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