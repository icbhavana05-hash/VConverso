import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const QuizPage = () => {
  const { topic_id } = useParams();
  
  // State for quiz listing and selection
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  // Quiz running states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { question_id: 'A' }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Post-submission grade report states
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null); // { score, total_questions, report }
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  // 1. Fetch quizzes belonging to this topic first
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get(`/quizzes/${topic_id}`);
        setQuizzes(response.data.quizzes);
        
        if (response.data.quizzes && response.data.quizzes.length > 0) {
          // Auto-select the first quiz of the topic
          await loadQuizQuestions(response.data.quizzes[0]);
        } else {
          setError('No assessment quizzes found for this topic.');
          setLoading(false);
        }
      } catch (err) {
        console.error('[QuizPage Load Error]:', err);
        setError('Failed to retrieve topic quizzes.');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [topic_id]);

  // 2. Fetch questions for the selected quiz
  const loadQuizQuestions = async (quiz) => {
    setLoading(true);
    setError('');
    setCurrentQuiz(quiz);
    
    try {
      const response = await api.get(`/questions/${quiz.quiz_id}`);
      setQuestions(response.data.questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setSubmissionResult(null);
    } catch (err) {
      console.error('[Load Questions Error]:', err);
      setError('Could not load quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionKey) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if user has answered all questions to warn them (optional, but premium detail!)
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `You have only answered ${answeredCount} of ${questions.length} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/submit-quiz', {
        quiz_id: currentQuiz.quiz_id,
        answers: selectedAnswers
      });
      setSubmissionResult(response.data);
      setIsSubmitted(true);
    } catch (err) {
      console.error('[Quiz Submit Error]:', err);
      alert('Failed to submit answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render Loading
  if (loading) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', borderColor: 'var(--color-brown-dark)', borderRightColor: 'transparent' }}>
          <span className="visually-hidden">Loading assessment...</span>
        </div>
        <p className="mt-3 fs-5" style={{ color: 'var(--text-sec)' }}>Formulating quiz board and timer keys...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 mt-4">
        <div className="alert alert-danger border-0 rounded-4 p-4 text-center glass-panel" role="alert">
          <i className="bi bi-patch-question-fill text-danger fs-1 mb-3 d-block"></i>
          <h4 className="fw-bold" style={{ color: 'var(--color-brown-dark)' }}>Quiz Engine Offline</h4>
          <p className="mb-4" style={{ color: 'var(--text-sec)' }}>{error}</p>
          <button onClick={() => navigate(-1)} className="btn btn-premium-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render Results Diagnostic Review
  if (isSubmitted && submissionResult) {
    const { score, total_questions, report } = submissionResult;
    const scorePercentage = parseFloat(((score / total_questions) * 100).toFixed(1));
    
    // Circle math parameters for visual svg score gauge
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

    return (
      <div className="container py-5 animate-fade-in">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* Score Summary Panel */}
            <div className="glass-panel p-4 p-md-5 text-center mb-4 overflow-hidden position-relative">
              <div className="position-relative z-1">
                <span className="badge px-3 py-2 rounded-pill mb-3" style={{ background: 'var(--bg-sec)', color: 'var(--color-brown-dark)', border: '1px solid var(--card-border)' }}>
                  <i className="bi bi-shield-lock-fill"></i> Quiz Complete
                </span>
                <h1 className="fw-bold mb-4" style={{ color: 'var(--color-brown-dark)' }}>Performance Report</h1>
                
                {/* SVG Progress Circle */}
                <div className="d-flex justify-content-center mb-4">
                  <div className="progress-ring" style={{ width: '130px', height: '130px' }}>
                    <svg width="130" height="130">
                      <circle 
                        stroke="var(--bg-sec)" 
                        strokeWidth="8" 
                        fill="transparent" 
                        r={radius} 
                        cx="65" 
                        cy="65" 
                      />
                      <circle 
                        stroke={scorePercentage >= 70 ? 'var(--color-brown-dark)' : scorePercentage >= 40 ? 'var(--color-brown-med)' : 'var(--text-muted)'} 
                        strokeWidth="8" 
                        fill="transparent" 
                        r={radius} 
                        cx="65" 
                        cy="65" 
                        className="progress-ring-circle"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                    </svg>
                    <div className="progress-ring-text d-flex flex-column align-items-center" style={{ color: 'var(--color-brown-dark)' }}>
                      <span className="fs-3 fw-bold">{score}/{total_questions}</span>
                      <span className="small" style={{ fontSize: '0.75rem', color: 'var(--text-sec)' }}>{scorePercentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Score Message */}
                <h3 className="fw-bold mb-2" style={{ color: 'var(--color-brown-dark)' }}>
                  {scorePercentage >= 80 ? 'Excellent! Master Linguist!' : scorePercentage >= 60 ? 'Great Job! Keep Practicing!' : 'Keep Learning! Retake anytime!'}
                </h3>
                <p className="mb-4 mx-auto" style={{ maxWidth: '500px', color: 'var(--text-sec)' }}>
                  Your score has been updated in your profile. You can review detailed question diagnostics below.
                </p>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button 
                    onClick={() => loadQuizQuestions(currentQuiz)}
                    className="btn btn-premium-secondary d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-arrow-clockwise" style={{ color: 'var(--color-brown-dark)' }}></i> Retake Quiz
                  </button>
                  <Link 
                    to="/dashboard"
                    className="btn btn-premium-primary d-flex align-items-center justify-content-center gap-2"
                  >
                    View Progress Dashboard <i className="bi bi-speedometer2"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Diagnostic review cards list */}
            <h2 className="fw-bold mb-4 fs-4" style={{ color: 'var(--color-brown-dark)' }}>Question Diagnostics</h2>
            <div className="d-flex flex-column gap-3">
              {report.map((item, index) => (
                <div 
                  key={item.question_id} 
                  className="glass-panel p-4 border-start border-4"
                  style={{ 
                    borderLeftColor: item.is_correct ? '#4A5D4E' : item.selected_answer === '' ? 'var(--text-muted)' : '#7A4B39'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <h5 className="fw-bold mb-0 small" style={{ color: 'var(--color-brown-dark)' }}>
                      Question {index + 1}
                    </h5>
                    <span className="badge px-2.5 py-1 rounded-pill" style={{
                      background: item.is_correct ? '#4A5D4E' : item.selected_answer === '' ? 'var(--bg-sec)' : '#7A4B39',
                      color: item.selected_answer === '' ? 'var(--text-sec)' : '#FFFFFF',
                      border: item.selected_answer === '' ? '1px solid var(--card-border)' : 'none'
                    }}>
                      {item.is_correct ? (
                        <><i className="bi bi-check-circle-fill"></i> Correct</>
                      ) : item.selected_answer === '' ? (
                        <><i className="bi bi-slash-circle-fill"></i> Skipped</>
                      ) : (
                        <><i className="bi bi-x-circle-fill"></i> Incorrect</>
                      )}
                    </span>
                  </div>

                  <p className="fw-semibold mb-3" style={{ color: 'var(--text-sec)' }}>{item.question_text}</p>
                  
                  {/* Options review list */}
                  <div className="d-flex flex-column gap-2 mb-3">
                    {Object.entries(item.options).map(([key, text]) => {
                      const isUserChoice = item.selected_answer === key;
                      const isCorrectChoice = item.correct_answer === key;
                      
                      let optionBg = 'var(--bg-card)';
                      let optionBorder = 'rgba(107, 62, 46, 0.08)';
                      let textCol = 'var(--text-prim)';
                      let fontW = '500';
                      let icon = '';

                      if (isCorrectChoice) {
                        optionBg = 'rgba(74, 93, 78, 0.08)';
                        optionBorder = 'rgba(74, 93, 78, 0.3)';
                        textCol = '#4A5D4E';
                        fontW = '700';
                        icon = <i className="bi bi-check-circle-fill float-end mt-1" style={{ color: '#4A5D4E' }}></i>;
                      } else if (isUserChoice && !item.is_correct) {
                        optionBg = 'rgba(180, 24, 45, 0.05)';
                        optionBorder = 'rgba(180, 24, 45, 0.25)';
                        textCol = '#B4182D';
                        fontW = '700';
                        icon = <i className="bi bi-x-circle-fill float-end mt-1" style={{ color: '#B4182D' }}></i>;
                      }

                      return (
                        <div 
                          key={key} 
                          className="p-3 rounded-3 text-start small"
                          style={{ background: optionBg, border: `1px solid ${optionBorder}` }}
                        >
                          <span style={{ color: textCol, fontWeight: fontW }}>
                            <strong className="me-2">{key}.</strong> {text}
                          </span>
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Active Quiz taking layout
  const currentQuestion = questions[currentQuestionIndex];
  const hasSelected = selectedAnswers[currentQuestion?.question_id] !== undefined;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          
          {/* Header Info */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <Link to={`/topics/${currentQuiz?.language_id}`} className="text-decoration-none small font-semibold" style={{ color: 'var(--text-sec)', transition: 'color 0.2s' }}>
                <i className="bi bi-arrow-left"></i> Exit Quiz
              </Link>
              <h2 className="fw-bold mb-0 mt-1 fs-4" style={{ color: 'var(--color-brown-dark)' }}>{currentQuiz?.quiz_title}</h2>
            </div>
            
            <div className="text-end">
              <span className="badge py-2 px-3 rounded-pill" style={{ background: 'var(--color-brown-dark)', color: '#FFFFFF' }}>
                Q {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress mb-4" style={{ height: '6px', background: 'rgba(107, 62, 46, 0.08)' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                background: 'linear-gradient(135deg, var(--color-brown-dark) 0%, var(--color-brown-med) 100%)'
              }}
              aria-valuenow={currentQuestionIndex + 1} 
              aria-valuemin="1" 
              aria-valuemax={questions.length}
            ></div>
          </div>

          {/* Question Card */}
          <div className="glass-panel p-4 p-md-5 mb-4 position-relative">
            {/* Question Text */}
            <h4 className="fw-bold leading-relaxed mb-4 fs-5" style={{ color: 'var(--color-brown-dark)' }}>
              {currentQuestion?.question_text}
            </h4>

            {/* Options list */}
            <div className="d-flex flex-column gap-3">
              {[
                { key: 'A', text: currentQuestion?.option_a },
                { key: 'B', text: currentQuestion?.option_b },
                { key: 'C', text: currentQuestion?.option_c },
                { key: 'D', text: currentQuestion?.option_d }
              ].map(({ key, text }) => {
                const isSelected = selectedAnswers[currentQuestion.question_id] === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleOptionSelect(currentQuestion.question_id, key)}
                    className="p-3.5 rounded-3 text-start glass-card d-flex align-items-center gap-3 w-100"
                    style={{ 
                      background: isSelected ? 'var(--bg-sec)' : 'var(--bg-card)',
                      borderColor: isSelected ? 'var(--color-brown-dark)' : 'rgba(107, 62, 46, 0.15)',
                      borderWidth: isSelected ? '2px' : '1px',
                      borderStyle: 'solid',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span 
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ 
                        width: '28px', 
                        height: '28px', 
                        background: isSelected ? 'var(--color-brown-dark)' : 'var(--bg-sec)',
                        color: isSelected ? '#ffffff' : 'var(--text-sec)',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {key}
                    </span>
                    <span className="small" style={{ color: 'var(--text-prim)', fontWeight: isSelected ? '700' : '500' }}>
                      {text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="d-flex justify-content-between align-items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn btn-premium-secondary d-flex align-items-center gap-1 py-2.5 px-4"
              style={{ opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
            >
              <i className="bi bi-chevron-left"></i> Prev
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn btn-premium-secondary d-flex align-items-center gap-1 py-2.5 px-4"
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-premium-success d-flex align-items-center gap-1.5 py-2.5 px-4"
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Evaluating...
                  </>
                ) : (
                  <>
                    Submit Quiz <i className="bi bi-check-circle-fill text-white"></i>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuizPage;
