// src/components/Login.jsx
import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Chama nosso backend seguro
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Email ou senha inválidos.');
      }

      const data = await response.json();
      localStorage.setItem('spinAuthToken', data.token); // Salva o token
      onLoginSuccess(); // Avisa o App.jsx que o login foi um sucesso
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* --- INÍCIO DA CORREÇÃO --- */}
        {/* Garante que o arquivo 'logospindle.png' está na pasta 'public' */}
        <img src="/logospindle.png" alt="Logo Spindle" className="login-logo" />
        {/* --- FIM DA CORREÇÃO --- */}
        
        <h2>Acesso Restrito</h2>
        <p>Assistente Spindle</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
