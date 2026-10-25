import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CyberShield App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{
            background: '#ffffff',
            padding: 32,
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            maxWidth: 500,
            border: '1px solid #e2e8f0',
          }}>
            <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Sentinel Recovery Active</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              An issue was intercepted. Click below to clear stored state and restore defaults.
            </p>
            <button
              onClick={() => {
                try { localStorage.clear(); } catch(e) {}
                window.location.reload();
              }}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset State & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
