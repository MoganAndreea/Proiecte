import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importă useNavigate
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Creează o instanță a navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // Poți adăuga logica de autentificare aici, de exemplu, verificarea parolei
    console.log('Email:', email);
    console.log('Password:', password);

    // Apelează funcția onLogin pentru a indica că utilizatorul s-a autentificat
    onLogin();

    // Redirecționează utilizatorul către pagina de WedPlan
    navigate('/wedplan');
  };

  return (
    <div className="login-container">
      <h2>LOG IN</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;