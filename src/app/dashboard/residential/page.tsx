'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email?: string
}

interface Address {
  id: string
  user_id: string
  address: string
  carrier: string | null
  monthly_value: number | null
  due_date: number | null
  status: string
  created_at: string
}

export default function ResidentialPage() {
  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [formData, setFormData] = useState({
    address: '',
    carrier: '',
    monthly_value: '',
    due_date: ''
  })

  // Carregar endereço do usuário
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user as User)
      await loadAddress(user.id)
    }
    loadData()
  }, [])

  const loadAddress = async (userId: string) => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (!error && data) {
      setAddress(data as Address)
      setFormData({
        address: data.address,
        carrier: data.carrier || '',
        monthly_value: data.monthly_value?.toString() || '',
        due_date: data.due_date?.toString() || ''
      })
      setShowForm(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const addressData = {
        user_id: user!.id,
        address: formData.address,
        carrier: formData.carrier,
        monthly_value: formData.monthly_value ? parseFloat(formData.monthly_value) : null,
        due_date: formData.due_date ? parseInt(formData.due_date) : null,
        status: 'ativo'
      }

      let error
      if (address) {
        // Atualizar endereço existente
        ({ error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('user_id', user!.id))
      } else {
        // Inserir novo endereço
        ({ error } = await supabase
          .from('addresses')
          .insert(addressData))
      }

      if (error) throw error

      await loadAddress(user!.id)
      setMessage(address ? 'Endereço atualizado com sucesso!' : 'Endereço cadastrado com sucesso!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir seu endereço residencial?')) return

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('user_id', user!.id)

    if (!error) {
      setAddress(null)
      setFormData({
        address: '',
        carrier: '',
        monthly_value: '',
        due_date: ''
      })
      setShowForm(false)
      setMessage('Endereço excluído com sucesso!')
    }
  }

  return (
    <div style={{
      backgroundColor: '#0F0F1A',
      minHeight: '100vh',
      padding: '20px',
      color: 'white',
      fontFamily: 'Arial'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ color: '#F5B041' }}>🏠 Endereço Residencial</h1>
          {!showForm && !address && (
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
              + Cadastrar Endereço
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

        {/* Formulário de cadastro/edição */}
        {showForm && (
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '30px',
            borderRadius: '10px'
          }}>
            <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
              {address ? 'Editar Endereço' : 'Cadastrar Endereço'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                  Endereço Completo <span style={{ color: '#F5B041' }}>*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Rua, número, complemento, bairro, cidade, CEP"
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
                  <option value="Claro">Claro</option>
                  <option value="Vivo">Vivo</option>
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
                  placeholder="199,90"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                  Dia de Vencimento
                </label>
                <input
                  type="number"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  placeholder="10"
                  min="1"
                  max="31"
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
                {address && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    style={{
                      padding: '12px 25px',
                      backgroundColor: '#FF4444',
                      border: 'none',
                      color: 'white',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Excluir
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    if (!address) {
                      setFormData({
                        address: '',
                        carrier: '',
                        monthly_value: '',
                        due_date: ''
                      })
                    }
                  }}
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
                  {loading ? 'Salvando...' : (address ? 'Atualizar' : 'Salvar')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}