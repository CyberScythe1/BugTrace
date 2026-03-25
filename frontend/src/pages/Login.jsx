import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse) => {
    try {
      setError('');
      const { data } = await api.post('/auth/google', { credential: credentialResponse.credential });
      localStorage.setItem('bt_token', data.token);
      localStorage.setItem('bt_user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      console.error(err);
      setError('Authentication failed. Make sure the backend is running.');
    }
  };

  const features = [
    { icon: '🐛', title: 'Bug Detection', desc: 'AI finds potential bugs and runtime errors with severity ratings and line-level precision.' },
    { icon: '💡', title: 'Smart Suggestions', desc: 'Get before/after code improvements from a senior engineer perspective.' },
    { icon: '⭐', title: 'Quality Score', desc: 'Receive a 1-10 quality rating with detailed explanations of strengths and weaknesses.' },
    { icon: '📖', title: 'Auto Documentation', desc: 'Automatically generated docs explaining what each function and module does.' },
    { icon: '🔗', title: 'GitHub Integration', desc: 'Paste code or enter a public GitHub repo URL — we fetch and analyze the files for you.' },
    { icon: '📥', title: 'Export Reports', desc: 'Download your full review as a Markdown file for documentation or sharing.' },
  ];

  return (
    <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '2rem', maxWidth: 700 }}>
        <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 40px var(--primary-glow)', position: 'relative' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Bug<span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Trace</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
          Your 24/7 AI-powered senior developer. Paste code or link a repo — get expert-level bug reports, refactoring suggestions, and documentation in seconds.
        </p>
      </div>

      {/* CTA - Google Login */}
      <div className="glass" style={{ padding: '2rem 2.5rem', textAlign: 'center', marginBottom: '3rem', maxWidth: 420, width: '100%' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Get Started — It's Free</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>Sign in with Google to start reviewing code instantly.</p>
        
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', padding: '10px 16px', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Google popup closed or failed')}
            theme="filled_black"
            size="large"
            shape="pill"
            width="300"
          />
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: 900, width: '100%', marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>
          What BugTrace Does
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {features.map((f, i) => (
            <div key={i} className="glass" style={{ padding: '1.5rem', transition: 'transform 0.2s, border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', marginBottom: '0.4rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div style={{ maxWidth: 700, width: '100%', marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>How It Works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { step: '1', label: 'Sign In', desc: 'Authenticate with Google' },
            { step: '2', label: 'Submit Code', desc: 'Paste code or enter GitHub URL' },
            { step: '3', label: 'AI Reviews', desc: 'Gemini AI analyzes your code' },
            { step: '4', label: 'Get Results', desc: 'Bugs, fixes, score & docs' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 140 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '1.2rem', marginBottom: '0.75rem', boxShadow: '0 0 20px var(--primary-glow)' }}>
                {s.step}
              </div>
              <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem', marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', paddingBottom: '2rem', textAlign: 'center', width: '100%' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          Built with React, Express, Neon PostgreSQL & Google Gemini AI — <span style={{ color: 'var(--text-muted)' }}>Free & Open Source</span>
        </p>
      </div>
    </div>
  );
}
