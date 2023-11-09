import "./Login.css";
import { useState } from "react";
export default function Login() {
  const [showLogin, setShowLogin] = useState(true);

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

          {showLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <form className="login-form">
      <input type="text" placeholder="Usuario" />
      <input type="password" placeholder="Contraseña" />
      <button>Entrar</button>
    </form>
  );
}

function SignupForm() {
  return (
    <form className="login-form">
      <input type="text" placeholder="Usuario" />
      <input type="password" placeholder="Contraseña" />
      <button onClick={"./App.jsx"}>Registrarse</button>
    </form>
  );
}
