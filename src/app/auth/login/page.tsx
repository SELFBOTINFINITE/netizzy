export default function LoginPage() {
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
          Entrar no Netizzy
        </h1>

        <form>
          <div style={{ marginBottom: '20px' }}>
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

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="********"
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

          <div style={{
            textAlign: 'right',
            marginBottom: '25px'
          }}>
            <a
              href="/auth/forgot-password"
              style={{
                color: '#F5B041',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Esqueceu a senha?
            </a>
          </div>

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
            Entrar
          </button>
        </form>

        <p style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          Não tem uma conta?{' '}
          <a
            href="/auth/register"
            style={{
              color: '#F5B041',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Registre-se
          </a>
        </p>
      </div>
    </div>
  )
}