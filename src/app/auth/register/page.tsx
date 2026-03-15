'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validar se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      // Criar usuário no Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            phone: phone,
          },
        },
      })

      if (error) throw error

      // Verificar se precisa confirmar email
      if (data.user?.identities?.length === 0) {
        setError('Este e-mail já está cadastrado')
      } else {
        setSuccess('Cadastro realizado! Verifique seu e-mail para confirmar sua conta.')
        // Limpar formulário
        setName('')
        setEmail('')
        setPhone('')
        setPassword('')
        setConfirmPassword('')
        
        // Opcional: redirecionar após alguns segundos
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: '#0F0F1A',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial'
    }}>
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '40px',
        borderRadius: '10px',
        width: '350px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          color: '#F5B041',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '28px'
        }}>
          Criar Conta Netizzy
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#FF4444',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#00FF00',
            color: '#0F0F1A',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              Nome Completo <span style={{ color: '#F5B041' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #333',
                backgroundColor: '#0F0F1A',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              E-mail <span style={{ color: '#F5B041' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #333',
                backgroundColor: '#0F0F1A',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              Celular <span style={{ color: '#F5B041' }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #333',
                backgroundColor: '#0F0F1A',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              Senha <span style={{ color: '#F5B041' }}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #333',
                backgroundColor: '#0F0F1A',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            <small style={{ color: '#999', fontSize: '12px' }}>
              Mínimo 6 caracteres
            </small>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              Confirmar Senha <span style={{ color: '#F5B041' }}>*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #333',
                backgroundColor: '#0F0F1A',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#6B2B8C',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              marginBottom: '20px'
            }}
          >
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <p style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          Já tem uma conta?{' '}
          <a
            href="/auth/login"
            style={{
              color: '#F5B041',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Entrar
          </a>
        </p>
      </div>
    </div>
  )
}