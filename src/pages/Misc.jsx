import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: 80 }}>🔍</div>
      <h1 style={{ fontSize: 64, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--accent)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text2)', maxWidth: 360 }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>Back to Dashboard</Link>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '20px 24px',
      textAlign: 'center',
      color: 'var(--text2)',
      fontSize: 13,
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span>© 2026 <strong style={{ color: 'var(--text)' }}>SpendTrack</strong> — Group N Project</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/" style={{ color: 'var(--text2)' }}>Dashboard</Link>
          <Link to="/history" style={{ color: 'var(--text2)' }}>History</Link>
          <Link to="/charts" style={{ color: 'var(--text2)' }}>Charts</Link>
          <Link to="/settings" style={{ color: 'var(--text2)' }}>Settings</Link>
        </div>
      </div>
    </footer>
  );
}
