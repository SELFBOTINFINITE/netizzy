export default function Dashboard() {
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
        <button style={{
          padding: '10px 20px',
          backgroundColor: 'transparent',
          border: '2px solid #F5B041',
          color: '#F5B041',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Sair
        </button>
      </div>

      {/* Mensagem de boas-vindas */}
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '10px' }}>
          Bem-vindo ao Netizzy, João!
        </h2>
        <p style={{ color: '#CCC' }}>
          Gerencie suas linhas e solicite reembolsos abaixo
        </p>
      </div>

      {/* Cards de Resumo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#F5B041' }}>Saldo Total</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>R$ 450,00</p>
        </div>
        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#F5B041' }}>Reembolsos</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>12</p>
        </div>
        <div style={{
          backgroundColor: '#1A1A2E',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#F5B041' }}>Próximo Reembolso</h3>
          <p style={{ fontSize: '18px' }}>15/04/2026</p>
        </div>
      </div>

      {/* Linhas Mobile */}
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#F5B041' }}>📱 Linhas Mobile</h2>
          <button style={{
            padding: '8px 15px',
            backgroundColor: '#F5B041',
            color: '#0F0F1A',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            + Adicionar Linha
          </button>
        </div>

        {/* Linha Mobile 1 */}
        <div style={{
          backgroundColor: '#0F0F1A',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <span style={{ color: '#F5B041', fontWeight: 'bold' }}>📱 Linha 1</span>
              <p style={{ margin: '5px 0', color: '#CCC' }}>(11) 99999-9999</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '5px 0' }}>Consumo: <strong>R$ 89,90</strong></p>
              <p style={{ margin: '5px 0' }}>Reembolso: <strong style={{ color: '#00FF00' }}>R$ 89,90</strong></p>
            </div>
            <button style={{
              padding: '8px 15px',
              backgroundColor: '#6B2B8C',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Solicitar Reembolso
            </button>
          </div>
        </div>

        {/* Linha Mobile 2 */}
        <div style={{
          backgroundColor: '#0F0F1A',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <span style={{ color: '#F5B041', fontWeight: 'bold' }}>📱 Linha 2</span>
              <p style={{ margin: '5px 0', color: '#CCC' }}>(11) 98888-8888</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '5px 0' }}>Consumo: <strong>R$ 45,90</strong></p>
              <p style={{ margin: '5px 0' }}>Reembolso: <strong style={{ color: '#00FF00' }}>R$ 45,90</strong></p>
            </div>
            <button style={{
              padding: '8px 15px',
              backgroundColor: '#6B2B8C',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Solicitar Reembolso
            </button>
          </div>
        </div>
      </div>

      {/* Plano Residencial */}
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>🏠 Plano Residencial</h2>
        
        <div style={{
          backgroundColor: '#0F0F1A',
          padding: '15px',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <span style={{ color: '#F5B041', fontWeight: 'bold' }}>🏠 Internet Casa</span>
              <p style={{ margin: '5px 0', color: '#CCC' }}>Operadora: Claro Net</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '5px 0' }}>Consumo: <strong>R$ 199,90</strong></p>
              <p style={{ margin: '5px 0' }}>Reembolso: <strong style={{ color: '#00FF00' }}>R$ 199,90</strong></p>
            </div>
            <button style={{
              padding: '8px 15px',
              backgroundColor: '#F5B041',
              color: '#0F0F1A',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Solicitar Reembolso
            </button>
          </div>
        </div>
      </div>

      {/* Últimos Reembolsos */}
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <h2 style={{ color: '#F5B041', marginBottom: '20px' }}>📋 Últimos Reembolsos</h2>
        
        <div style={{
          backgroundColor: '#0F0F1A',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <span style={{ color: '#F5B041' }}>📱 Linha 1</span>
              <p style={{ margin: '5px 0', color: '#CCC' }}>R$ 89,90</p>
            </div>
            <span style={{
              padding: '5px 10px',
              backgroundColor: '#00FF00',
              color: '#0F0F1A',
              borderRadius: '5px',
              fontSize: '12px'
            }}>
              Aprovado
            </span>
          </div>
        </div>

        <div style={{
          backgroundColor: '#0F0F1A',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <span style={{ color: '#F5B041' }}>🏠 Residencial</span>
              <p style={{ margin: '5px 0', color: '#CCC' }}>R$ 199,90</p>
            </div>
            <span style={{
              padding: '5px 10px',
              backgroundColor: '#F5B041',
              color: '#0F0F1A',
              borderRadius: '5px',
              fontSize: '12px'
            }}>
              Processando
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}