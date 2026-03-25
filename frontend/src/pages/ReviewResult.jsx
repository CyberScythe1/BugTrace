import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReview } from '../services/api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ReviewResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeFile, setActiveFile] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReview(id).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const exportMarkdown = () => {
    if (!data) return;
    const file = data.files[activeFile];
    const bugs = (typeof file.bug_report === 'string' ? JSON.parse(file.bug_report) : file.bug_report) || [];
    const imps = (typeof file.improvements === 'string' ? JSON.parse(file.improvements) : file.improvements) || [];
    
    let md = `# BugTrace Code Review Report\n\n`;
    md += `**File:** ${file.file_path}  \n**Language:** ${file.language}  \n**Quality Score:** ${file.quality_score}/10  \n**Date:** ${new Date(data.review.created_at).toLocaleDateString()}\n\n`;
    md += `---\n\n## Bug Report\n\n`;
    bugs.forEach((b, i) => { md += `### ${i + 1}. ${b.issue}\n- **Severity:** ${b.severity}\n- **Line:** ${b.line_number || 'N/A'}\n- **Explanation:** ${b.explanation}\n\n`; });
    md += `## Improvements\n\n`;
    imps.forEach((imp, i) => { md += `### ${i + 1}. ${imp.suggestion}\n**Before:**\n\`\`\`\n${imp.before_code}\n\`\`\`\n**After:**\n\`\`\`\n${imp.after_code}\n\`\`\`\n\n`; });
    md += `## Documentation\n\n${file.documentation}\n`;
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bugtrace-review-${file.file_path}.md`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;
  if (!data) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>Review not found.</div>;

  const file = data.files[activeFile];
  const bugs = (typeof file.bug_report === 'string' ? JSON.parse(file.bug_report) : file.bug_report) || [];
  const improvements = (typeof file.improvements === 'string' ? JSON.parse(file.improvements) : file.improvements) || [];
  const score = parseFloat(file.quality_score);
  const scoreClass = score >= 7 ? 'score-high' : score >= 5 ? 'score-mid' : 'score-low';

  return (
    <div className="page-enter page-visible">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>Review Results</h1>
          <p className="text-sm text-muted">{data.review.repo_name} • {new Date(data.review.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-1">
          <button className="btn btn-primary" onClick={exportMarkdown}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export MD
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </div>

      {/* File tabs if multiple */}
      {data.files.length > 1 && (
        <div className="flex gap-1 mb-2" style={{ flexWrap: 'wrap' }}>
          {data.files.map((f, i) => (
            <button key={i} className={`btn ${i === activeFile ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={() => setActiveFile(i)}>
              {f.file_path}
            </button>
          ))}
        </div>
      )}

      {/* Score overview */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `conic-gradient(${score >= 7 ? 'var(--success)' : score >= 5 ? 'var(--warning)' : 'var(--danger)'} ${score * 10}%, var(--bg-dark) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>
            {score}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem', marginBottom: 4 }}>Quality Score</div>
          <p className="text-sm text-muted">{file.file_path} — {bugs.length} bug{bugs.length !== 1 ? 's' : ''} found, {improvements.length} improvement{improvements.length !== 1 ? 's' : ''} suggested</p>
        </div>
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Code viewer */}
        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>
            📄 {file.file_path}
          </div>
          <div className="code-viewer" style={{ maxHeight: 500, overflow: 'auto' }}>
            <SyntaxHighlighter language={file.language || 'javascript'} style={vscDarkPlus} showLineNumbers wrapLines customStyle={{ margin: 0, padding: '1rem', background: '#0a0e1a', fontSize: '0.82rem' }}>
              {file.code_content || '// No code available'}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Analysis panel */}
        <div className="flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Bugs */}
          <div className="glass" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>
              🐛 Bug Report ({bugs.length})
            </div>
            <div style={{ maxHeight: 240, overflow: 'auto' }}>
              {bugs.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--success)', fontSize: '0.9rem' }}>✓ No bugs detected!</div>
              ) : bugs.map((b, i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,41,59,0.4)' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>{b.issue}</span>
                    <span className={`severity severity-${b.severity}`}>{b.severity}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{b.explanation}</p>
                  {b.line_number && <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4, display: 'block' }}>Line: ~{b.line_number}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="glass" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>
              💡 Improvements ({improvements.length})
            </div>
            <div style={{ maxHeight: 240, overflow: 'auto' }}>
              {improvements.map((imp, i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,41,59,0.4)' }}>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '0.85rem', marginBottom: 8 }}>{imp.suggestion}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>Before</div>
                      <pre style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: 8, fontSize: '0.75rem', color: '#fca5a5', overflow: 'auto', whiteSpace: 'pre-wrap' }}>{imp.before_code}</pre>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>After</div>
                      <pre style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, padding: 8, fontSize: '0.75rem', color: '#86efac', overflow: 'auto', whiteSpace: 'pre-wrap' }}>{imp.after_code}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="glass mt-2" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, color: 'white', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          📖 Auto-Generated Documentation
        </h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{file.documentation}</p>
      </div>
    </div>
  );
}
