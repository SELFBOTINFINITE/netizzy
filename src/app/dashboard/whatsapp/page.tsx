'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email?: string
}

export default function WhatsAppPage() {
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Verificar se usuário está logado
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user as User)
        // Carregar WhatsApp já cadastrado
        const { data } = await supabase
          .from('profiles')
          .select('whatsapp')
          .eq('id', user.id)
          .single()
        
        if (data?.whatsapp) {
          setWhatsapp(data.whatsapp)
        }
      }
    }
    getUser()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ whatsapp })
        .eq('id', user!.id)

      if (error) throw error

      setMessage('WhatsApp cadastrado com sucesso!')
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
          📱 Cadastrar WhatsApp
        </h1>

        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '30px',
          borderRadius: '10px'
        }}>
          <p style={{ color: '#CCC', marginBottom: '20px' }}>
            Seu WhatsApp será usado para notificações e confirmações de reembolso.
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
              <label style={{
                color: 'white',
                display: 'block',
                marginBottom: '5px'
              }}>
                WhatsApp <span style={{ color: '#F5B041' }}>*</span>
              </label>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
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
              {loading ? 'Salvando...' : 'Salvar WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}