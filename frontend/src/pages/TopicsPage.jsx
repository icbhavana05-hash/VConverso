import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const TopicsPage = () => {
  const { language_id } = useParams();
  const [topics, setTopics] = useState([]);
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get(`/topics/${language_id}`);
        setTopics(response.data.topics);
        setLanguage(response.data.language);
      } catch (err) {
        console.error('[TopicsPage Error]:', err);
        setError('Could not retrieve topics. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [language_id]);

  if (loading) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading topics...</span>
        </div>
        <p className="text-secondary mt-3 fs-5">Configuring curriculum modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 mt-4">
        <div className="alert alert-danger border-0 rounded-4 p-4 text-center glass-panel animate-fade-in" role="alert">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
          <h4 className="fw-bold text-white">Curriculum Offline</h4>
          <p className="text-secondary mb-4">{error}</p>
          <Link to="/languages" className="btn btn-premium-primary">
            Return to Languages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animate-fade-in">
      {/* Breadcrumb / Back Link */}
      <div className="mb-4">
        <Link to="/languages" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-1 hover-opacity">
          <i className="bi bi-arrow-left"></i> Back to Languages
        </Link>
      </div>

      {/* Header Info */}
      <div className="glass-panel p-4 p-md-5 mb-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
        <div>
          <span className="badge bg-primary px-3 py-2 rounded-pill mb-3 animate-fade-in">
            {language?.language_name} Grammar & Vocab
          </span>
          <h1 className="fw-bold text-white mb-2">{language?.language_name} Syllabus</h1>
          <p className="text-secondary mb-0 leading-relaxed" style={{ maxWidth: '700px' }}>
            {language?.description}
          </p>
        </div>
        
        {/* Dynamic decorative emblem */}
        <div className="bg-glow-primary rounded-4 p-3 d-flex align-items-center justify-content-center text-white" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
          <i className="bi bi-journal-check fs-1"></i>
        </div>
      </div>

      {/* Topic Grid */}
      <h2 className="fw-bold text-white mb-4 fs-3">Learning Modules</h2>
      
      {topics.length === 0 ? (
        <div className="glass-panel p-5 text-center">
          <i className="bi bi-search text-secondary fs-1 mb-3 d-block"></i>
          <h4 className="text-white fw-bold">No Modules Found</h4>
          <p className="text-secondary">We are currently designing the syllabus for this language. Please check back shortly!</p>
        </div>
      ) : (
        <div className="row g-4">
          {topics.map((topic, index) => (
            <div className="col-md-6" key={topic.topic_id}>
              <div className="glass-card h-100 p-4 d-flex flex-column">
                
                {/* Index & Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-primary fw-bold text-uppercase tracking-wider small">
                    Module 0{index + 1}
                  </span>
                  <span className="badge bg-secondary rounded-pill" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#94a3b8' }}>
                    <i className="bi bi-clock me-1"></i> ~20 Mins
                  </span>
                </div>

                <h3 className="h4 fw-bold text-white mb-2">{topic.topic_name}</h3>
                <p className="text-secondary small flex-grow-1 leading-relaxed mb-4">
                  {topic.topic_description}
                </p>

                {/* Actions */}
                <div className="row g-2 mt-auto">
                  <div className="col-6">
                    <button
                      onClick={() => navigate(`/notes/${topic.topic_id}`)}
                      className="btn btn-premium-secondary w-100 py-2.5 d-flex align-items-center justify-content-center gap-1.5"
                    >
                      <i className="bi bi-book text-primary"></i> Learn Notes
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      onClick={() => navigate(`/quiz/${topic.topic_id}`)}
                      className="btn btn-premium-primary w-100 py-2.5 d-flex align-items-center justify-content-center gap-1.5"
                    >
                      <i className="bi bi-play-circle-fill"></i> Start Quiz
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicsPage;
