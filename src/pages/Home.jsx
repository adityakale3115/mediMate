import React from "react";

export default function Home() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '60px auto',
      padding: '2rem',
      border: '2px solid var(--primary)',
      borderRadius: 'var(--radius)',
      textAlign: 'center',
      background: 'transparent',
      boxShadow: 'var(--shadow-soft)',
      transition: 'transform 0.3s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      <h2 style={{
        color: 'var(--primary)',
        fontSize: '2rem',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        Welcome to <span style={{ color: 'var(--primary-dark)' }}>MediMate.Ai</span>
      </h2>
      <p style={{
        color: 'var(--text-muted)',
        fontSize: '1.1rem',
        lineHeight: '1.6'
      }}>
        Your personal AI-powered healthcare assistant. Get suggestions based on
        symptoms, upload reports, and manage appointments seamlessly.
      </p>
    </div>
  );
}
