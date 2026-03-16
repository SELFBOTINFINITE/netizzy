'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email?: string
}

interface Profile {
  name: string
  phone: string
  plan_type: string
}

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
  profiles?: Profile
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

export default function ReimbursementsPage() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([])
  const [mobileLines, setMobileLines] = useState<MobileLine[]>([])
  const [address, setAddress] = useState<Address | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    source_type: 'mobile',
    source_id: '',
    value: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user as User)

    // Carregar reembolsos e dados do usuário
    const [reimbursementsRes, mobileRes, addressRes, profileRes] = await Promise.all([
      supabase.from('reimbursements').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('mobile_lines').select('*').eq('user_id', user.id),
      supabase.from('addresses').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('profiles').select('*').eq('id', user.id).single()
    ])

    setReimbursements(reimbursementsRes.data as Reimbursement[] || [])
    setMobileLines(mobileRes.data as MobileLine[] || [])
    setAddress(addressRes.data as Address | null)
    setProfile(profileRes.data as Profile)
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadFile = async (userId: string) => {
    if (!selectedFile) return null

    setUploading(true)
    try {
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      const filePath = `reimbursements/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload do comprovante')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (formData.source_type === 'mobile' && profile?.plan_type === 'residencial') {
        alert('Seu plano não inclui reembolsos mobile')
        setLoading(false)
        return
      }
      if (formData.source_type === 'residencial' && profile?.plan_type === 'mobile') {
        alert('Seu plano não inclui reembolsos residenciais')
        setLoading(false)
        return
      }

      const userObj = (await supabase.auth.getUser()).data.user
      
      let receiptUrl = null
      if (selectedFile) {
        receiptUrl = await uploadFile(userObj!.id)
        if (!receiptUrl) {
          setLoading(false)
          return
        }
      }

      const { error } = await supabase.from('reimbursements').insert({
        user_id: userObj!.id,
        source_type: formData.source_type,
        source_id: formData.source_id || null,
        value: parseFloat(formData.value),
        status: 'pendente',
        receipt_url: receiptUrl
      })

      if (error) throw error

      setShowForm(false)
      setFormData({ source_type: 'mobile', source_id: '', value: '' })
      setSelectedFile(null)
      loadData()
    } catch (error) {
      alert('Erro ao solicitar reembolso')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'aprovado': return '#00FF00'
      case 'rejeitado': return '#FF4444'
      case 'pago': return '#F5B041'
      default: return '#F5B041'
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0F0F1A', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        Carregando...
      </div>
    )
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
          <h1 style={{ color: '#F5B041' }}>💰 Reembolsos</h1>
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
            + Solicitar Reembolso
          </button>
        </div>

        {reimbursements.length === 0 ? (
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '40px',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#CCC'
          }}>
            Nenhum reembolso solicitado ainda
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reimbursements.map((item) => (
              <div key={item.id} style={{
                backgroundColor: '#1A1A2E',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {item.source_type === 'mobile' ? '📱 Linha Mobile' : '🏠 Residencial'} - R$ {item.value.toFixed(2)}
                  </div>
                  <div style={{ color: '#CCC', fontSize: '14px' }}>
                    Solicitado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  {item.receipt_url && (
                    <a 
                      href={item.receipt_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#F5B041', fontSize: '12px', textDecoration: 'none' }}
                    >
                      📎 Ver comprovante
                    </a>
                  )}
                </div>
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
            ))}
          </div>
        )}

        {showForm && (
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '30px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>
              Solicitar Reembolso
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                  Tipo <span style={{ color: '#F5B041' }}>*</span>
                </label>
                <select
                  value={formData.source_type}
                  onChange={(e) => setFormData({ ...formData, source_type: e.target.value as 'mobile' | 'residencial', source_id: '' })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    backgroundColor: '#0F0F1A',
                    color: 'white',
                    border: '1px solid #333'
                  }}
                  required
                >
                  <option value="mobile">📱 Mobile</option>
                  <option value="residencial">🏠 Residencial</option>
                </select>
              </div>

              {formData.source_type === 'mobile' && mobileLines.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                    Selecione a Linha <span style={{ color: '#F5B041' }}>*</span>
                  </label>
                  <select
                    value={formData.source_id}
                    onChange={(e) => setFormData({ ...formData, source_id: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '5px',
                      backgroundColor: '#0F0F1A',
                      color: 'white',
                      border: '1px solid #333'
                    }}
                  >
                    <option value="">Selecione...</option>
                    {mobileLines.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.phone_number} - R$ {line.monthly_value?.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.source_type === 'residencial' && address && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                    Endereço
                  </label>
                  <div style={{
                    backgroundColor: '#0F0F1A',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #333'
                  }}>
                    {address.address}
                  </div>
                  <input
                    type="hidden"
                    value={address.id}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                  Valor (R$) <span style={{ color: '#F5B041' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
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
                  Comprovante (PDF ou imagem) <span style={{ color: '#F5B041' }}>*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    backgroundColor: '#0F0F1A',
                    color: 'white',
                    border: '1px solid #333'
                  }}
                />
                <small style={{ color: '#999', fontSize: '12px' }}>
                  Formatos aceitos: PDF, JPG, PNG
                </small>
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setSelectedFile(null)
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
                  disabled={loading || uploading}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#6B2B8C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: (loading || uploading) ? 'not-allowed' : 'pointer',
                    opacity: (loading || uploading) ? 0.5 : 1
                  }}
                >
                  {uploading ? 'Enviando arquivo...' : loading ? 'Enviando...' : 'Solicitar'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}