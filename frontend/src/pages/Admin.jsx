import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAdminUsers, getAdminReviews } from '../services/api';

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminUsers(), getAdminReviews()])
      .then(([s, u, r]) => { setStats(s); setUsers(u); setReviews(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;

  return (
    <div className="page-enter page-visible">
      <div className="flex justify-between items-center mb-3">
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Admin Dashboard</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid mb-3">
          <div className="glass stat-card">
            <div className="stat-glow" style={{ background: 'var(--primary)' }} />
            <div className="stat-label">👥 Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="glass stat-card">
            <div className="stat-glow" style={{ background: 'var(--accent)' }} />
            <div className="stat-label">📊 Total Reviews</div>
            <div className="stat-value">{stats.totalReviews}</div>
          </div>
          <div className="glass stat-card">
            <div className="stat-glow" style={{ background: 'var(--success)' }} />
            <div className="stat-label">⭐ Avg Score</div>
            <div className="stat-value">{stats.averageScore}<span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 400 }}>/10</span></div>
          </div>
        </div>
      )}

      {/* Tab nav */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <div className="tabs">
          <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>All Users</button>
          <button className={`tab ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>All Reviews</button>
        </div>

        {tab === 'overview' ? (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>User</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>Reviews</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(30,41,59,0.4)' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      {u.avatar_url && <img src={u.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />}
                      <span style={{ color: 'white', fontWeight: 500 }}>{u.name}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: 'white', fontWeight: 600 }}>{u.review_count}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, background: u.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.15)', color: u.role === 'admin' ? 'var(--accent)' : 'var(--primary)' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.8rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Repo / Source</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>User</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>Score</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(30,41,59,0.4)', cursor: 'pointer' }} onClick={() => navigate(`/review/${r.id}`)}>
                    <td style={{ padding: '12px 16px', color: 'white', fontWeight: 500 }}>{r.repo_name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{r.user_name || r.user_email}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span className={`score-badge ${parseFloat(r.average_score) >= 7 ? 'score-high' : parseFloat(r.average_score) >= 5 ? 'score-mid' : 'score-low'}`}>
                        {parseFloat(r.average_score).toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.8rem' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
