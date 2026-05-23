import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const NotesPage = () => {
  const { topic_id } = useParams();
  const [notes, setNotes] = useState([]);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get(`/notes/${topic_id}`);
        setNotes(response.data.notes);
        setTopic(response.data.topic);
      } catch (err) {
        console.error('[NotesPage Error]:', err);
        setError('Could not retrieve learning notes. Please verify your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [topic_id]);

  if (loading) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', borderColor: 'var(--color-brown-dark)', borderRightColor: 'transparent' }}>
          <span className="visually-hidden">Loading notes...</span>
        </div>
        <p className="mt-3 fs-5" style={{ color: 'var(--text-sec)' }}>Fetching notes and study guides...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 mt-4">
        <div className="alert alert-danger border-0 rounded-4 p-4 text-center glass-panel animate-fade-in" role="alert">
          <i className="bi bi-file-earmark-x text-danger fs-1 mb-3 d-block"></i>
          <h4 className="fw-bold" style={{ color: 'var(--color-brown-dark)' }}>Study Notes Unavailable</h4>
          <p className="mb-4" style={{ color: 'var(--text-sec)' }}>{error}</p>
          <button onClick={() => navigate(-1)} className="btn btn-premium-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // A helper function to parse basic markdown-like structures to HTML (e.g. lists, bold text, headers)
  // This gives the notes a beautiful rendering engine!
  const renderFormattedContent = (text) => {
    if (!text) return '';
    return text
      .split('\n')
      .map((line, idx) => {
        // Bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return <li key={idx} className="mb-2 ms-3" style={{ color: 'var(--text-sec)' }}>{line.replace(/^[-*]\s+/, '')}</li>;
        }
        // Bold tags: **text**
        if (line.includes('**')) {
          // simple bold replacement
          const parts = line.split('**');
          return (
            <p key={idx} className="mb-3 leading-relaxed" style={{ color: 'var(--text-sec)' }}>
              {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: 'var(--color-brown-dark)', fontWeight: '700' }}>{part}</strong> : part)}
            </p>
          );
        }
        // Headings: ###
        if (line.trim().startsWith('###')) {
          return <h4 key={idx} className="fw-bold mt-4 mb-3" style={{ color: 'var(--color-brown-dark)' }}>{line.replace(/^###\s+/, '')}</h4>;
        }
        if (line.trim().startsWith('##')) {
          return <h3 key={idx} className="fw-bold mt-4 mb-3 fs-4" style={{ color: 'var(--color-brown-dark)' }}>{line.replace(/^##\s+/, '')}</h3>;
        }
        // Table or other blocks
        if (line.trim().startsWith('|')) {
          // return table row
          const columns = line.split('|').map(c => c.trim()).filter(c => c !== '');
          if (line.includes('---')) return null; // skip separator
          return (
            <div key={idx} className="row border-bottom py-2 g-0" style={{ borderColor: 'rgba(107, 62, 46, 0.08)', background: 'var(--bg-sec)' }}>
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="col px-3 small font-semibold" style={{ color: 'var(--text-sec)' }}>{col}</div>
              ))}
            </div>
          );
        }
        
        return line.trim() === '' ? <br key={idx} /> : <p key={idx} className="mb-3 leading-relaxed" style={{ color: 'var(--text-sec)' }}>{line}</p>;
      });
  };

  return (
    <div className="container py-5 animate-fade-in">
      {/* Back to syllabus link */}
      <div className="mb-4">
        <button 
          onClick={() => navigate(`/topics/${topic?.language_id}`)}
          className="btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 hover-opacity p-0 border-0 font-semibold"
          style={{ color: 'var(--text-sec)', transition: 'color 0.2s' }}
        >
          <i className="bi bi-arrow-left"></i> Back to Syllabus
        </button>
      </div>

      <div className="row g-4">
        {/* Main Notes Reading Area */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 p-md-5">
            {/* Header info */}
            <div className="border-bottom pb-4 mb-4" style={{ borderColor: 'rgba(107, 62, 46, 0.08)' }}>
              <span className="fw-bold text-uppercase tracking-wider small d-block mb-1" style={{ color: 'var(--color-brown-med)' }}>
                {topic?.language_name} Grammar Laboratory
              </span>
              <h1 className="fw-bold mb-2" style={{ color: 'var(--color-brown-dark)' }}>{topic?.topic_name}</h1>
              <p className="mb-0 small" style={{ color: 'var(--text-sec)' }}>
                <i className="bi bi-book-half me-1"></i> Interactive Study Material
              </p>
            </div>

            {/* Render Notes */}
            {notes.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-file-earmark-text fs-1 mb-3 d-block" style={{ color: 'var(--text-muted)' }}></i>
                <h5 className="fw-bold" style={{ color: 'var(--color-brown-dark)' }}>Content Preparing</h5>
                <p style={{ color: 'var(--text-sec)' }}>Study notes for this topic are being formatted by our linguists. Check back soon!</p>
              </div>
            ) : (
              notes.map((note) => (
                <article className="mb-5" key={note.note_id}>
                  <h2 className="h3 fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--color-brown-dark)' }}>
                    <span className="p-1.5 rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', background: 'var(--bg-sec)', border: '1px solid var(--card-border)', color: 'var(--color-brown-dark)' }}>
                      <i className="bi bi-journal-text fs-6"></i>
                    </span>
                    {note.title}
                  </h2>
                  <div className="fs-6 lh-lg">
                    {renderFormattedContent(note.content)}
                  </div>
                </article>
              ))
            )}

            {/* Bottom Navigator */}
            <div className="border-top pt-4 mt-5 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3" style={{ borderColor: 'rgba(107, 62, 46, 0.08)' }}>
              <button 
                onClick={() => navigate(`/topics/${topic?.language_id}`)}
                className="btn btn-premium-secondary w-100 w-sm-auto py-2.5 px-4"
              >
                <i className="bi bi-list-check me-1"></i> View All Topics
              </button>
              
              <button 
                onClick={() => navigate(`/quiz/${topic_id}`)}
                className="btn btn-premium-primary w-100 w-sm-auto py-2.5 px-4 d-inline-flex align-items-center justify-content-center gap-2"
              >
                Test Knowledge <i className="bi bi-lightning-fill text-warning"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar reference guides */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 mb-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 fs-5" style={{ color: 'var(--color-brown-dark)' }}>
              <i className="bi bi-shield-check" style={{ color: 'var(--color-brown-med)' }}></i> Learning Tips
            </h4>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-2.5 small" style={{ color: 'var(--text-sec)' }}>
                <i className="bi bi-check-circle-fill mt-0.5" style={{ flexShrink: 0, color: 'var(--color-brown-med)' }}></i>
                <span><strong>Read out loud:</strong> Vocalizing foreign tenses helps muscle memory and pronunciation.</span>
              </li>
              <li className="d-flex align-items-start gap-2.5 small" style={{ color: 'var(--text-sec)' }}>
                <i className="bi bi-check-circle-fill mt-0.5" style={{ flexShrink: 0, color: 'var(--color-brown-med)' }}></i>
                <span><strong>Write conjugation drills:</strong> Penning the tables improves memorization by 40%.</span>
              </li>
              <li className="d-flex align-items-start gap-2.5 small" style={{ color: 'var(--text-sec)' }}>
                <i className="bi bi-check-circle-fill mt-0.5" style={{ flexShrink: 0, color: 'var(--color-brown-med)' }}></i>
                <span><strong>Review wrong answers:</strong> The quiz at the end provides instant correction guidelines.</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-4 text-center overflow-hidden position-relative" style={{ background: 'linear-gradient(135deg, var(--color-brown-dark) 0%, var(--color-brown-med) 100%)', border: 'none' }}>
            <div className="position-relative z-1">
              <i className="bi bi-trophy-fill text-warning display-4 mb-3 d-block" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))' }}></i>
              <h4 className="fw-bold mb-2 fs-5" style={{ color: '#FFFFFF' }}>Ready for the Quiz?</h4>
              <p className="small mb-4" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Challenge yourself! Finish this module's diagnostic evaluation to update your scoreboard.</p>
              <button 
                onClick={() => navigate(`/quiz/${topic_id}`)}
                className="btn btn-light fw-bold w-100 py-2.5 rounded-3"
                style={{ color: 'var(--color-brown-dark)', background: '#FFFFFF', border: 'none' }}
              >
                Launch Assessment
              </button>
            </div>
            {/* background circle decoration */}
            <div className="position-absolute bg-white rounded-circle opacity-10" style={{ width: '200px', height: '200px', bottom: '-80px', right: '-80px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
