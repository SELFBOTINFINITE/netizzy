export default function Home() {
  return (
    <div style={{ 
      backgroundColor: '#0F0F1A',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial'
    }}>
      {/* Cabeçalho */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#6B2B8C'
      }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>Netizzy</h1>
        <div>
          <a href="/auth/login" style={{ textDecoration: 'none' }}>
            <button style={{
              marginRight: '15px',
              padding: '10px 20px',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </a>
          <a href="/auth/register" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '10px 20px',
              background: '#F5B041',
              color: '#0F0F1A',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Criar Conta
            </button>
          </a>
        </div>
      </div>

      {/* Parte Principal */}
      <div style={{ 
        textAlign: 'center', 
        padding: '80px 20px'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          color: '#F5B041',
          marginBottom: '20px'
        }}>
          Chega de pagar internet do bolso!
        </h1>
        <p style={{ 
          fontSize: '24px',
          color: '#FFFFFF',
          marginBottom: '40px'
        }}>
          Recupere 100% do valor gasto com sua internet
        </p>
        
        {/* Cards dos Planos */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Plano Mobile */}
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '30px',
            borderRadius: '10px',
            width: '300px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📱</div>
            <h2 style={{ color: '#F5B041' }}>Mobile</h2>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>R$ 19,90</p>
            <p style={{ color: '#CCCCCC' }}>/mês</p>
            <ul style={{ textAlign: 'left', marginTop: '20px' }}>
              <li>✓ Reembolso até R$ 120/mês</li>
              <li>✓ App inclusa</li>
              <li>✓ Sem burocracia</li>
            </ul>
            <button style={{
              backgroundColor: '#6B2B8C',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '5px',
              marginTop: '20px',
              fontSize: '18px',
              cursor: 'pointer'
            }}>
              Assinar
            </button>
          </div>

          {/* Plano Residencial */}
          <div style={{
            backgroundColor: '#1A1A2E',
            padding: '30px',
            borderRadius: '10px',
            width: '300px',
            border: '2px solid #F5B041'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏠</div>
            <h2 style={{ color: '#F5B041' }}>Residencial</h2>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>R$ 39,90</p>
            <p style={{ color: '#CCCCCC' }}>/mês</p>
            <ul style={{ textAlign: 'left', marginTop: '20px' }}>
              <li>✓ Reembolso até R$ 300/mês</li>
              <li>✓ Suporte 24/7</li>
              <li>✓ Análise rápida</li>
            </ul>
            <button style={{
              backgroundColor: '#F5B041',
              color: '#0F0F1A',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '5px',
              marginTop: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Assinar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}