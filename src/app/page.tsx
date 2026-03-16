'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email?: string
}

interface Profile {
  id: string
  name: string
  phone: string
  whatsapp: string | null
  plan_type: 'mobile' | 'residencial' | 'ambos' | null
  created_at: string
}

interface MobileLine {
  id: string
  phone_number: string
  monthly_value: number | null
}

interface Address {
  id: string
  address: string
}

interface BankData {
  id: string
  pix_type: string
  pix_key: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileLines, setMobileLines] = useState<MobileLine[]>([])
  const [address, setAddress] = useState<Address | null>(null)
  const [bankData, setBankData] = useState<BankData | null>(null)
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
      setUser(user as User)

      // Carregar todos os dados do usuário
      const [
        { data: profileData },
        { data: mobileData },
        { data: addressData },
        { data: bankData }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('mobile_lines').select('*').eq('user_id', user.id),
        supabase.from('addresses').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('bank_data').select('*').eq('user_id', user.id).maybeSingle()
      ])

      setProfile(profileData as Profile)
      setMobileLines(mobileData as MobileLine[] || [])
      setAddress(addressData as Address | null)
      setBankData(bankData as BankData | null)
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
            border: profile?.whatsapp ? '2px solid #00FF00' : '2px solid transparent'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📱</div>
            <h3 style={{ color: '#F5B041' }}>WhatsApp</h3>
            <p style={{ color: '#CCC', fontSize: '14px' }}>
              {profile?.whatsapp ? '✅ Cadastrado' : '⬜ Pendente'}
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
            border: bankData ? '2px solid #00FF00' : '2px solid transparent'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💳</div>
            <h3 style={{ color: '#F5B041' }}>Chave PIX</h3>
            <p style={{ color: '#CCC', fontSize: '14px' }}>
              {bankData ? '✅ Cadastrado' : '⬜ Pendente'}
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
            border: mobileLines.length > 0 ? '2px solid #00FF00' : '2px solid transparent'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📞</div>
            <h3 style={{ color: '#F5B041' }}>Linhas Mobile</h3>
            <p style={{ color: '#CCC', fontSize: '14px' }}>
              {mobileLines.length}/2 cadastradas
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
            border: address ? '2px solid #00FF00' : '2px solid transparent'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏠</div>
            <h3 style={{ color: '#F5B041' }}>Residencial</h3>
            <p style={{ color: '#CCC', fontSize: '14px' }}>
              {address ? '✅ Cadastrado' : '⬜ Pendente'}
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
            <span style={{ color: profile?.whatsapp ? '#00FF00' : '#FF4444' }}>
              {profile?.whatsapp ? '✓ Cadastrado' : '✗ Pendente'}
            </span>
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
            <span style={{ color: bankData ? '#00FF00' : '#FF4444' }}>
              {bankData ? '✓ Cadastrado' : '✗ Pendente'}
            </span>
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
            <span style={{ color: mobileLines.length > 0 ? '#00FF00' : '#FF4444' }}>
              {mobileLines.length}/2 cadastradas
            </span>
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
            <span style={{ color: address ? '#00FF00' : '#FF4444' }}>
              {address ? '✓ Cadastrado' : '✗ Pendente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}