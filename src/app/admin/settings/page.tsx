'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Netizzy',
    siteUrl: 'https://netizzy.netlify.app',
    supportEmail: 'suporte@netizzy.com',
    pixKey: 'contato@netizzy.com',
    pixType: 'email',
    mobileLimit: 2,
    residentialLimit: 1
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    
    // Aqui você pode salvar as configurações no banco
    // Por enquanto, vamos só simular
    setTimeout(() => {
      setMessage('Configurações salvas com sucesso!')
      setLoading(false)
    }, 1000)
  }

  return (
    <div>
      <h1 style={{ color: '#F5B041', marginBottom: '30px' }}>
        ⚙️ Configurações do Sistema
      </h1>

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

      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
          Informações Gerais
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            Nome do Site
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              backgroundColor: '#0F0F1A',
              color: 'white',
              border: '1px solid #333'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            URL do Site
          </label>
          <input
            type="text"
            value={settings.siteUrl}
            onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              backgroundColor: '#0F0F1A',
              color: 'white',
              border: '1px solid #333'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            Email de Suporte
          </label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              backgroundColor: '#0F0F1A',
              color: 'white',
              border: '1px solid #333'
            }}
          />
        </div>
      </div>

      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
          Configurações de PIX
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            Tipo de Chave PIX
          </label>
          <select
            value={settings.pixType}
            onChange={(e) => setSettings({ ...settings, pixType: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              backgroundColor: '#0F0F1A',
              color: 'white',
              border: '1px solid #333'
            }}
          >
            <option value="cpf">CPF</option>
            <option value="email">E-mail</option>
            <option value="phone">Telefone</option>
            <option value="random">Chave Aleatória</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            Chave PIX da Empresa
          </label>
          <input
            type="text"
            value={settings.pixKey}
            onChange={(e) => setSettings({ ...settings, pixKey: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              backgroundColor: '#0F0F1A',
              color: 'white',
              border: '1px solid #333'
            }}
          />
        </div>
      </div>

      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
          Limites do Sistema
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            Máximo de Linhas Mobile por Usuário
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.mobileLimit}
            onChange={(e) => setSettings({ ...settings, mobileLimit: parseInt(e.target.value) })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              backgroundColor: '#0F0F1A',
              color: 'white',
              border: '1px solid #333'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            Máximo de Endereços Residenciais por Usuário
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={settings.residentialLimit}
            onChange={(e) => setSettings({ ...settings, residentialLimit: parseInt(e.target.value) })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              backgroundColor: '#0F0F1A',
              color: 'white',
              border: '1px solid #333'
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
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
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </div>
  )
}