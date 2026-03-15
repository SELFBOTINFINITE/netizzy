'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PixPage() {
  const [pixType, setPixType] = useState('cpf')
  const [pixKey, setPixKey] = useState('')
  const [accountName, setAccountName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [hasPix, setHasPix] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const pixTypes = [
    { value: 'cpf', label: 'CPF' },
    { value: 'email', label: 'E-mail' },
    { value: 'phone', label: 'Telefone' },
    { value: 'random', label: 'Chave Aleatória' }
  ]

  // Verificar se usuário está logado e carregar PIX existente
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
        // Carregar PIX já cadastrado
        const { data } = await supabase
          .from('bank_data')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        
        if (data) {
          setHasPix(true)
          setPixType(data.pix_type)
          setPixKey(data.pix_key)
          setAccountName(data.account_name || '')
        }
      }
    }
    getUser()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const pixData = {
        user_id: user.id,
        pix_type: pixType,
        pix_key: pixKey,
        account_name: accountName || null
      }

      let error
      if (hasPix) {
        // Atualizar PIX existente
        ({ error } = await supabase
          .from('bank_data')
          .update(pixData)
          .eq('user_id', user.id))
      } else {
        // Inserir novo PIX
        ({ error } = await supabase
          .from('bank_data')
          .insert(pixData))
      }

      if (error) throw error

      setMessage(hasPix ? 'PIX atualizado com sucesso!' : 'PIX cadastrado com sucesso!')
      setHasPix(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
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
        <h1 style={{ color: '#F5B041', marginBottom: '20px' }}>
          💳 Cadastrar Chave PIX
        </h1>

        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '30px',
          borderRadius: '10px'
        }}>
          <p style={{ color: '#CCC', marginBottom: '20px' }}>
            É por aqui que você receberá todos os seus reembolsos.
          </p>

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

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                Tipo de Chave <span style={{ color: '#F5B041' }}>*</span>
              </label>
              <select
                value={pixType}
                onChange={(e) => setPixType(e.target.value)}
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
                {pixTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                Chave PIX <span style={{ color: '#F5B041' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Digite sua chave PIX"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
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
                Nome do Titular (se diferente)
              </label>
              <input
                type="text"
                placeholder="Opcional"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
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
              {loading ? 'Salvando...' : (hasPix ? 'Atualizar PIX' : 'Salvar PIX')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}