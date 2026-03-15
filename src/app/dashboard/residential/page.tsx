'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)

      // Carregar perfil do usuário
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
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

  return (
    <div style={{
      backgroundColor: '#0F0F1A',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial',
      padding: '20px'
    }}>
      {/* Cabeçalho */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6B2B8C',
        padding: '20px 40px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '32px', margin: 0, color: 'white' }}>
          Netizzy
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            border: '2px solid #F5B041',
            color: '#F5B041',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Sair
        </button>
      </div>

      {/* Boas-vindas */}
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '10px' }}>
          Bem-vindo, {profile?.name || 'Usuário'}!
        </h2>
        <p style={{ color: '#CCC' }}>
          Complete seus dados para começar a solicitar reembolsos
        </p>
      </div>

      {/* Cards de Acesso Rápido */}
      <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
        Configurações da Conta
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Card WhatsApp */}
        <a href="/dashboard/whatsapp" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, border 0.2s',
            border: '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.border = '2px solid #F5B041'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.border = '2px solid transparent'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📱</div>
            <h3 style={{ color: '#F5B041' }}>WhatsApp</h3>
            <p style={{ color: '#CCC', fontSize: '14px' }}>
              Cadastre seu número para notificações
            </p>
          </div>
        </a>

        {/* Card PIX */}
        <a href="/dashboard/pix" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, border 0.2s',
            border: '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.border = '2px solid #F5B041'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.border = '2px solid transparent'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💳</div>
            <h3 style={{ color: '#F5B041' }}>Chave PIX</h3>
            <p style={{ color: '#CCC', fontSize: '14px' }}>
              Cadastre sua chave para receber reembolsos
            </p>
          </div>
        </a>

        {/* Card Linhas Mobile */}
        <a href="/dashboard/mobile" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, border 0.2s',
            border: '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.border = '2px solid #F5B041'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.border = '2px solid transparent'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📞</div>
            <h3 style={{ color: '#F5B041' }}>Linhas Mobile</h3>
            <p style={{ color: '#CCC', fontSize: '14px' }}>
              Cadastre até 2 números de celular
            </p>
          </div>
        </a>

        {/* Card Residencial */}
        <a href="/dashboard/residential" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, border 0.2s',
            border: '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.border = '2px solid #F5B041'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.border = '2px solid transparent'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏠</div>
            <h3 style={{ color: '#F5B041' }}>Residencial</h3>
            <p style={{ color: '#CCC', fontSize: '14px' }}>
              Cadastre seu endereço para internet de casa
            </p>
          </div>
        </a>
      </div>

      {/* Status do Cadastro */}
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <h3 style={{ color: '#F5B041', marginBottom: '15px' }}>
          Progresso do Cadastro
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#0F0F1A',
            borderRadius: '5px'
          }}>
            <span>📱 WhatsApp</span>
            <span style={{ color: '#00FF00' }}>✓ Pendente</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#0F0F1A',
            borderRadius: '5px'
          }}>
            <span>💳 Chave PIX</span>
            <span style={{ color: '#00FF00' }}>✓ Pendente</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#0F0F1A',
            borderRadius: '5px'
          }}>
            <span>📞 Linhas Mobile</span>
            <span style={{ color: '#00FF00' }}>✓ 0/2</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#0F0F1A',
            borderRadius: '5px'
          }}>
            <span>🏠 Residencial</span>
            <span style={{ color: '#FF4444' }}>✗ Não cadastrado</span>
          </div>
        </div>
      </div>
    </div>
  )
}