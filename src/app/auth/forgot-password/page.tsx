export default function ForgotPasswordPage() {
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
          marginBottom: '10px',
          fontSize: '28px'
        }}>
          Esqueceu a Senha?
        </h1>
        
        <p style={{
          color: '#CCCCCC',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Digite seu e-mail para receber um link de recuperação
        </p>

        <form>
          {/* Email */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
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

          {/* Botão */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#6B2B8C',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            Enviar Link
          </button>
        </form>

        {/* Link para voltar ao login */}
        <p style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          <a
            href="/auth/login"
            style={{
              color: '#F5B041',
              textDecoration: 'none'
            }}
          >
            Voltar para o login
          </a>
        </p>
      </div>
    </div>
  )
}