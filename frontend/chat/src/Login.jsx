import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = () => {
    // Lógica de autenticación, etc.

    // Navegar a la ruta "/rooms" después de iniciar sesión
    navigate('/rooms');
  };

  return (
    <div className="app">
      <div className="login-container">
        <div className="login-card">
          <div className="login-options">
            <div
              className={`login-option ${showLogin ? "selected" : ""}`}
              onClick={() => setShowLogin(true)}
            >
              Iniciar Sesión
            </div>
            <div
              className={`login-option ${!showLogin ? "selected" : ""}`}
              onClick={() => setShowLogin(false)}
            >
              Registrarse
            </div>
          </div>

          {showLogin ? <LoginForm onLogin={handleLogin} /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de validación del formulario, etc.

    // Llama a la función onLogin para navegar a la ruta "/rooms"
    onLogin();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Usuario" />
      <input type="password" placeholder="Contraseña" />
      <button type="submit">Entrar</button>
    </form>
  );
}

function SignupForm() {
  return (
    <form className="login-form">
      <input type="text" placeholder="Usuario" />
      <input type="password" placeholder="Contraseña" />
      {/* No uses un string para el evento onClick, utiliza una función */}
      <button type="button" onClick={() => alert('Registrarse')}>
        Registrarse
      </button>
    </form>
  );
}
