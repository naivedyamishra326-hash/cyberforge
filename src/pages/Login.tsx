import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = login(username.trim(), password);
    if (err) setError(err);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand__icon">
            <Shield size={28} />
          </div>
          <span className="login-brand__name">CYBERFORGE</span>
          <span className="login-brand__sub">AI × Security System</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-field__label">Username</label>
            <input
              className="login-field__input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label className="login-field__label">Password</label>
            <input
              className="login-field__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="login-submit"
            disabled={!username.trim() || !password.trim()}
          >
            ENTER COMMAND CENTER
          </button>
        </form>
      </div>
    </div>
  );
}
