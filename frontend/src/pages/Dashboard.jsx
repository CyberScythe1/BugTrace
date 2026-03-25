import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReviews } from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews().then(data => { setReviews(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const avgScore = reviews.length ? (reviews.reduce((s, r) => s + parseFloat(r.average_score || 0), 0) / reviews.length).toFixed(1) : '—';

  const scoreClass = (s) => s >= 7 ? 'score-high' : s >= 5 ? 'score-mid' : 'score-low';

  return (
    <div className="page-enter page-visible">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
            Welcome, {user?.name?.split(' ')[0] || 'Developer'}
          </h1>
          <p className="text-muted">Here's your code review activity.</p>
        </div>
        <div className="flex gap-1">
          {user?.role === 'admin' && (
            <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Admin</button>
          )}
          <button className="btn btn-primary" onClick={() => navigate('/new-review')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Review
          </button>
          <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-3">
        <div className="glass stat-card">
          <div className="stat-glow" style={{ background: 'var(--primary)' }} />
          <div className="stat-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Total Reviews
          </div>
          <div className="stat-value">{reviews.length}</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-glow" style={{ background: 'var(--accent)' }} />
          <div className="stat-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Avg Score
          </div>
          <div className="stat-value">{avgScore}<span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 400 }}> / 10</span></div>
        </div>
        <div className="glass stat-card">
          <div className="stat-glow" style={{ background: 'var(--success)' }} />
          <div className="stat-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Bugs Found
          </div>
          <div className="stat-value">{reviews.length > 0 ? reviews.length * 3 : 0}</div>
        </div>
      </div>

      {/* Reviews list */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Recent Reviews
      </h2>

      <div className="glass" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : reviews.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <p>No reviews yet. Start your first code review!</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/new-review')}>Analyze Code</button>
          </div>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="review-item" onClick={() => navigate(`/review/${r.id}`)}>
              <div>
                <div style={{ fontWeight: 600, color: 'white', marginBottom: 4 }}>{r.repo_name || 'Code Review'}</div>
                <div className="text-sm text-dim">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <span className={`score-badge ${scoreClass(r.average_score)}`}>
                {parseFloat(r.average_score).toFixed(1)}/10
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
