import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeCode } from '../services/api';

export default function NewReview() {
  const [tab, setTab] = useState('paste');
  const [code, setCode] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (tab === 'paste' && !code.trim()) return setError('Please paste some code.');
    if (tab === 'github' && !githubUrl.trim()) return setError('Please enter a GitHub URL.');

    setLoading(true);
    try {
      const payload = tab === 'paste'
        ? { sourceType: 'paste', codeContent: code, language }
        : { sourceType: 'github', githubUrl };
      
      const result = await analyzeCode(payload);
      if (result.reviewId) navigate(`/review/${result.reviewId}`);
      else setError('Analysis succeeded but no review ID returned.');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const languages = ['javascript', 'python', 'typescript', 'java', 'cpp', 'go', 'rust', 'php', 'ruby', 'swift'];

  return (
    <div className="page-enter page-visible">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>Start a New Review</h1>
        <p className="text-muted">Paste code directly or link a public GitHub repository.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '1rem', textAlign: 'center', maxWidth: 700, margin: '0 auto 1rem' }}>
          {error}
        </div>
      )}

      <div className="glass" style={{ maxWidth: 800, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
            <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600, letterSpacing: 1 }}>AI is reviewing your logic...</p>
            <p className="text-sm text-dim">This may take 15-30 seconds.</p>
          </div>
        )}

        <div className="tabs">
          <button className={`tab ${tab === 'paste' ? 'active' : ''}`} onClick={() => setTab('paste')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Paste Code
          </button>
          <button className={`tab ${tab === 'github' ? 'active' : ''}`} onClick={() => setTab('github')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            GitHub Repo
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {tab === 'paste' ? (
            <div className="flex-col gap-2">
              <div className="flex gap-1 items-center">
                <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Language:</label>
                <select className="input" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }} value={language} onChange={e => setLanguage(e.target.value)}>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <textarea
                className="input textarea"
                style={{ marginTop: '0.75rem', height: 280, fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", background: '#0a0e1a' }}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder={`function calculateTotal() {\n  // Paste your code here...\n}`}
              />
            </div>
          ) : (
            <div className="flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Public GitHub Repository URL</label>
              <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                <input className="input" style={{ paddingLeft: 44, height: 52, fontSize: '1rem' }} type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/owner/repo" />
              </div>
              <div style={{ marginTop: '0.75rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', padding: '10px 14px', borderRadius: 'var(--radius)', color: 'var(--warning)', fontSize: '0.8rem' }}>
                ⚡ We scan up to 5 code files from the repo root to respect free-tier limits.
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1rem' }} onClick={handleSubmit} disabled={loading}>
              Analyze Code
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>
    </div>
  );
}
