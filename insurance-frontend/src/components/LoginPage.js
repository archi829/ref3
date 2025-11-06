import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure this import is here

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const loginUrl = isAdminLogin
      ? 'http://localhost:3001/api/admin/login'
      : 'http://localhost:3001/api/login';

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      onLoginSuccess(data.token); // Pass token up to App.js

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>{isAdminLogin ? 'Admin Login' : 'Customer Login'}</h2>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group admin-toggle">
          <label>
            <input
              type="checkbox"
              checked={isAdminLogin}
              onChange={() => setIsAdminLogin(!isAdminLogin)}
            />
            Login as Admin
          </label>
        </div>

        <button type="submit">Login</button>
      </form>
      {/* 👇 ADDED THIS PARAGRAPH 👇 */}
      <p className="form-footer-link">
        Don't have an account? <Link to="/register">Register Here</Link>
      </p>
    </div>
  );
}

export default LoginPage;