'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function MobileLinesPage() {
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [formData, setFormData] = useState({
    phone_number: '',
    carrier: '',
    monthly_value: ''
  })

  // Carregar linhas do usuário
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      await loadLines(user.id)
    }
    loadData()
  }, [])

  const loadLines = async (userId) => {
    const { data, error } = await supabase
      .from('mobile_lines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (!error) {
      setLines(data || [])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Verificar limite de 2 linhas
    if (!editingId && lines.length >= 2) {
      setError('Você já atingiu o limite máximo de 2 linhas mobile.')
      setLoading(false)
      return
    }

    try {
      const lineData = {
        user_id: user.id,
        phone_number: formData.phone_number,
        carrier: formData.carrier,
        monthly_value: parseFloat(formData.monthly_value),
        status: 'ativo'
      }

      let error
      if (editingId) {
        // Atualizar linha existente
        ({ error } = await supabase
          .from('mobile_lines')
          .update(lineData)
          .eq('id', editingId))
      } else {
        // Inserir nova linha
        ({ error } = await supabase
          .from('mobile_lines')
          .insert(lineData))
      }

      if (error) throw error

      await loadLines(user.id)
      setMessage(editingId ? 'Linha atualizada com sucesso!' : 'Linha cadastrada com sucesso!')
      resetForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (line) => {
    setFormData({
      phone_number: line.phone_number,
      carrier: line.carrier || '',
      monthly_value: line.monthly_value?.toString() || ''
    })
    setEditingId(line.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta linha?')) return

    const { error } = await supabase
      .from('mobile_lines')
      .delete()
      .eq('id', id)

    if (!error) {
      await loadLines(user.id)
      setMessage('Linha excluída com sucesso!')
    }
  }

  const resetForm = () => {
    setFormData({
      phone_number: '',
      carrier: '',
      monthly_value: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div style={{
      backgroundColor: '#0F0F1A',
      minHeight: '100vh',
      padding: '20px',
      color: 'white',
      fontFamily: 'Arial'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ color: '#F5B041' }}>📱 Linhas Mobile</h1>
          {!showForm && lines.length < 2 && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#F5B041',
                color: '#0F0F1A',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              + Nova Linha
            </button>
          )}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FF4444',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: '#00FF00',
            color: '#0F0F1A',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Lista de linhas */}
        {lines.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#F5B041', marginBottom: '15px' }}>
              Suas Linhas ({lines.length}/2)
            </h2>
            {lines.map((line) => (
              <div
                key={line.id}
                style={{
                  backgroundColor: '#1A1A2E',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{line.phone_number}</div>
                  <div style={{ color: '#CCC', fontSize: '14px' }}>
                    {line.carrier || 'Operadora não informada'} • R$ {line.monthly_value?.toFixed(2) || '0,00'}/mês
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(line)}
                    style={{
                      padding: '5px 15px',
                      backgroundColor: 'transparent',
                      border: '2px solid #F5B041',
                      color: '#F5B041',
                      borderRadius: '5px',
                      marginRight: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(line.id)}
                    style={{
                      padding: '5px 15px',
                      backgroundColor: '#FF4444',
                      border: 'none',
                      color: 'white',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulário de cadastro/edição */}
        {(showForm || editingId) && (
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '30px',
            borderRadius: '10px'
          }}>
            <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
              {editingId ? 'Editar Linha' : 'Nova Linha Mobile'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                  Número <span style={{ color: '#F5B041' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    backgroundColor: '#0F0F1A',
                    color: 'white',
                    border: '1px solid #333',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                  Operadora
                </label>
                <select
                  name="carrier"
                  value={formData.carrier}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    backgroundColor: '#0F0F1A',
                    color: 'white',
                    border: '1px solid #333',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecione</option>
                  <option value="Vivo">Vivo</option>
                  <option value="Claro">Claro</option>
                  <option value="TIM">TIM</option>
                  <option value="Oi">Oi</option>
                  <option value="Outra">Outra</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                  Valor Mensal (R$)
                </label>
                <input
                  type="number"
                  name="monthly_value"
                  value={formData.monthly_value}
                  onChange={handleInputChange}
                  placeholder="89,90"
                  step="0.01"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    backgroundColor: '#0F0F1A',
                    color: 'white',
                    border: '1px solid #333',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: 'transparent',
                    border: '2px solid #666',
                    color: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#6B2B8C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {loading ? 'Salvando...' : (editingId ? 'Atualizar' : 'Salvar')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}