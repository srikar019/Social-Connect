import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Auth({ onAuthSuccess, addToast }) {
  const [isLogin, setIsLogin] = useState(false); // Default to registration (Create an account) matching user screenshot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/signup`;
      const bodyPayload = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong, please try again.');
      }

      addToast(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
      addToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 5000,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #faf5ff 50%, #f3e8ff 100%)',
        padding: '16px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#ffffff',
          borderRadius: '40px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          padding: '40px 32px 32px 32px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          minHeight: '680px',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Header: Brand Tag Logo */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 24px',
              borderRadius: '9999px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: '#ffffff',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#191b23', letterSpacing: '-0.01em' }}>
              Social Connect
            </span>
          </div>
        </div>

        {/* Center: Title and Form */}
        <div style={{ width: '100%', marginTop: '32px', marginBottom: '32px' }}>
          {/* Main Title & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#191b23',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {isLogin ? 'Sign in to account' : 'Create an account'}
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: '#737686',
                marginTop: '8px',
                margin: 0,
              }}
            >
              {isLogin ? 'Sign in and connect with your feed' : 'Sign up'}
            </p>
          </div>

          {/* Errors display */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--color-error-container)',
                color: 'var(--color-on-error-container)',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500',
                marginBottom: '16px',
                border: '1px solid rgba(186, 26, 26, 0.08)',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Full Name field (Register only) */}
            {!isLogin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: '#737686', paddingLeft: '16px', fontWeight: '500' }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid transparent',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    color: '#191b23',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#f5f5f5';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.boxShadow = 'none';
                  }}
                  required={!isLogin}
                  aria-label="Full name"
                />
              </div>
            )}

            {/* Email field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: '#737686', paddingLeft: '16px', fontWeight: '500' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid transparent',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  color: '#191b23',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = 'transparent';
                  e.target.style.boxShadow = 'none';
                }}
                required
                aria-label="Email"
              />
            </div>

            {/* Password field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: '#737686', paddingLeft: '16px', fontWeight: '500' }}>
                Password
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 54px 14px 24px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid transparent',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    color: '#191b23',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#f5f5f5';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#737686',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '12px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign up')}
            </button>

          </form>
        </div>

        {/* Footer: Bottom Links */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#737686' }}>
              {isLogin ? "Don't have an account? " : "Have any account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#191b23',
                textDecoration: 'underline',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
