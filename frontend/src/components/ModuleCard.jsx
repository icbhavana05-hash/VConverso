import React from 'react';

const ModuleCard = ({ index, topic, metadata, navigate, progress = 0 }) => {
  // Extract metadata values or use elegant fallbacks
  const category = metadata?.category || 'Basics';
  const duration = metadata?.duration || '~20 Mins';
  const iconClass = metadata?.icon || 'bi-journal-bookmark';
  const subtopics = metadata?.subtopics || [];

  // Determine button icon color based on warm theme
  const learnBtnIconStyle = { color: 'var(--color-brown-dark)' };

  return (
    <div className="module-card h-100 p-4 d-flex flex-column animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
      
      {/* Top badges bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold text-uppercase tracking-wider small" style={{ color: 'var(--color-brown-med)', fontSize: '0.78rem' }}>
          Module {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <div className="d-flex gap-2">
          <span 
            className="badge rounded-pill font-semibold px-2.5 py-1.5" 
            style={{ 
              background: 'rgba(107, 62, 46, 0.06)', 
              color: 'var(--color-brown-dark)', 
              border: '1px solid rgba(107, 62, 46, 0.08)',
              fontSize: '0.72rem'
            }}
          >
            {category}
          </span>
          <span 
            className="badge rounded-pill font-semibold px-2.5 py-1.5 text-secondary" 
            style={{ 
              background: 'var(--bg-sec)', 
              border: '1px solid var(--card-border)',
              fontSize: '0.72rem'
            }}
          >
            <i className="bi bi-clock me-1"></i> {duration}
          </span>
        </div>
      </div>

      {/* Title & Icon Header */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <div 
          className="card-icon-container rounded-4 d-flex align-items-center justify-content-center" 
          style={{ width: '48px', height: '48px', flexShrink: 0 }}
        >
          <i className={`bi ${iconClass} fs-4`}></i>
        </div>
        <h3 className="h4 fw-bold mb-0" style={{ color: 'var(--color-brown-dark)', fontSize: '1.25rem', lineHeight: '1.3' }}>
          {topic.topic_name}
        </h3>
      </div>

      {/* Expandable Description */}
      <div className="description-container flex-grow-1">
        <p className="small leading-relaxed mb-0" style={{ color: 'var(--text-sec)', fontSize: '0.88rem' }}>
          {topic.topic_description}
        </p>
      </div>

      {/* Hover Reveal: Subtopics list */}
      {subtopics.length > 0 && (
        <div className="subtopics-drawer">
          <div className="p-3 rounded-3" style={{ background: 'var(--bg-sec)', border: '1px solid var(--card-border)' }}>
            <span className="fw-bold text-uppercase tracking-wider d-block mb-2 text-secondary" style={{ fontSize: '0.7rem' }}>
              <i className="bi bi-list-check me-1"></i> Topics Covered
            </span>
            <div className="row g-2">
              {subtopics.map((sub, sIdx) => (
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2 small text-secondary" key={sIdx} style={{ fontSize: '0.82rem' }}>
                  <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress placeholder bar */}
      <div className="mt-4 mb-4 pt-1">
        <div className="d-flex justify-content-between align-items-center mb-1.5">
          <span className="small text-muted font-semibold" style={{ fontSize: '0.78rem' }}>Syllabus Pathway Progress</span>
          <span className="small font-bold" style={{ color: 'var(--color-brown-dark)', fontSize: '0.78rem' }}>{progress}%</span>
        </div>
        <div className="progress-placeholder-bar">
          <div className="progress-placeholder-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row g-2 mt-auto">
        <div className="col-6">
          <button
            onClick={() => navigate(`/notes/${topic.topic_id}`)}
            className="btn btn-premium-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-1.5 text-truncate"
            style={{ fontSize: '0.88rem' }}
          >
            <i className="bi bi-book" style={learnBtnIconStyle}></i> Learn Notes
          </button>
        </div>
        <div className="col-6">
          <button
            onClick={() => navigate(`/quiz/${topic.topic_id}`)}
            className="btn btn-premium-primary w-100 py-2 d-flex align-items-center justify-content-center gap-1.5 text-truncate"
            style={{ fontSize: '0.88rem' }}
          >
            <i className="bi bi-play-circle-fill"></i> Start Quiz
          </button>
        </div>
      </div>

    </div>
  );
};

export default ModuleCard;
