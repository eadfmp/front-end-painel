import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://back-end-painel.onrender.com/login",
        { username, password }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/admin");

    } catch (error) {
      alert("Usuário ou senha inválidos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Painel Administrativo</h2>
          <p style={styles.subtitle}>Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>Sistema protegido • Administração</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    animation: "fadeIn 0.5s ease",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    color: "#333",
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "10px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#555",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "#f8f9fa",
  },
  inputFocus: {
    borderColor: "#667eea",
    backgroundColor: "white",
    boxShadow: "0 0 0 3px rgba(102,126,234,0.1)",
  },
  button: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
    boxShadow: "0 4px 6px rgba(102,126,234,0.2)",
  },
  buttonHover: {
    backgroundColor: "#5a67d8",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(102,126,234,0.3)",
  },
  buttonDisabled: {
    backgroundColor: "#a0aec0",
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
    borderTop: "1px solid #eaeaea",
    paddingTop: "20px",
  },
  footerText: {
    color: "#999",
    fontSize: "12px",
    margin: 0,
  },
};

// Adicione este CSS no seu arquivo global ou no componente
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

input:hover {
  border-color: #667eea;
}

input:focus {
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}

button:hover {
  background-color: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102,126,234,0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Adicione isso no seu arquivo HTML principal ou crie um componente de estilo separado
const GlobalStyle = () => (
  <style>{globalStyles}</style>
);

export { GlobalStyle };