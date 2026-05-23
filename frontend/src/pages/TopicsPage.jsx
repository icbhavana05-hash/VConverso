import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import ModuleCard from '../components/ModuleCard';

// Comprehensive Spanish syllabus module metadata
const SPANISH_METADATA = {
  "introduction to the language": {
    category: "Basics",
    duration: "~15 Mins",
    icon: "bi-info-circle",
    subtopics: ["Los alfabetos", "Los vocales", "The rules of pronunciation", "Consonants C & G", "La guía de pronunciación", "El Abecedario"]
  },
  "numbers": {
    category: "Basics",
    duration: "~20 Mins",
    icon: "bi-hash",
    subtopics: ["Los números cardinales (1–100)", "Los números cardinales (1–1000)", "Los números ordinales"]
  },
  "los artículos": {
    category: "Grammar",
    duration: "~20 Mins",
    icon: "bi-body-text",
    subtopics: ["Definite Articles (el, la, los, las)", "Indefinite Articles (un, una, unos, unas)", "Gender Agreement Rules"]
  },
  "las cosas de la clase": {
    category: "Vocabulary",
    duration: "~15 Mins",
    icon: "bi-backpack",
    subtopics: ["Classroom Objects", "School & Education Vocab", "Common Phrases"]
  },
  "los datos personales": {
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-person-badge",
    subtopics: ["Introducing Yourself", "Stating Age & Birthdays", "Sharing Contacts & Address"]
  },
  "el origen y la nacionalidad": {
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-globe",
    subtopics: ["Asking Origin with SER", "Countries & Adjectives", "Nationalities Agreement"]
  },
  "saludar y despedirse": {
    category: "Conversation",
    duration: "~15 Mins",
    icon: "bi-chat-dots",
    subtopics: ["Greetings (Saludos)", "Polite Cues & Social Cues", "Farewells (Despedidas)"]
  },
  "el verbo ser en presente de indicativo": {
    category: "Grammar",
    duration: "~25 Mins",
    icon: "bi-activity",
    subtopics: ["Present Conjugation", "Permanent Characteristics", "Origin & Descriptions"]
  },
  "la profesión": {
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-briefcase",
    subtopics: ["Common Occupations", "Stating Your Career", "Professional Fields"]
  },
  "grammar": {
    category: "Grammar",
    duration: "~30 Mins",
    icon: "bi-journal-code",
    subtopics: ["Regular Verbs Conjugation", "Irregular Verb TENER", "Adjective Agreement", "Possessive & Demonstrative"]
  },
  "los días de la semana": {
    category: "Vocabulary",
    duration: "~15 Mins",
    icon: "bi-calendar-week",
    subtopics: ["Days of the Week", "Masculine Gender Rules", "Telling Dates & Schedules"]
  },
  "los colores": {
    category: "Vocabulary",
    duration: "~15 Mins",
    icon: "bi-palette",
    subtopics: ["Main Colors Adjectives", "Visual Expression", "Number & Gender Matching"]
  },
  "vocabularios de la casa": {
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-house",
    subtopics: ["Rooms & Spaces", "Major Home Furniture", "Household Objects"]
  },
  "las emociones": {
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-emoji-smile",
    subtopics: ["Temporary Feelings", "Conjugating ESTAR", "Emotional State Matching"]
  },
  "las direcciones": {
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-compass",
    subtopics: ["Asking for Locations", "Navigating Streets", "Travel Commands"]
  },
  "expresar la hora": {
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-clock",
    subtopics: ["Asking '¿Qué hora es?'", "Rules of Es la / Son las", "Adding & Subtracting Minutes"]
  },
  "los meses del año": {
    category: "Vocabulary",
    duration: "~15 Mins",
    icon: "bi-calendar2-range",
    subtopics: ["Twelve Months", "Formatting Spanish Dates", "Seasons & Calendars"]
  },
  "vocabularios de la familia": {
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-people",
    subtopics: ["Immediate Family Members", "Extended Family Tree", "Expressing Kinship"]
  },
  "el clima y la estación": {
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-cloud-sun",
    subtopics: ["Weather with HACER", "Atmospheric Cues", "The Four Seasons"]
  },
  "los vocabularios de la geografía": {
    category: "Vocabulary",
    duration: "~20 Mins",
    icon: "bi-map",
    subtopics: ["Geography landscapes", "Natural features", "Rivers, lakes & mountains"]
  }
};

// General metadata mapping for other syllabus items (English, French, German)
const GENERAL_METADATA = {
  // English
  "tenses & verb aspects": {
    category: "Grammar",
    duration: "~25 Mins",
    icon: "bi-clock-history",
    subtopics: ["Simple, Continuous, Perfect", "Past, Present, Future", "Verb Aspect Rules"]
  },
  "conversational english": {
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-chat-quote",
    subtopics: ["Idiomatic Expressions", "Polite Request Modal Cues", "Active Dialogue Cues"]
  },
  // French
  "nouns & articles": {
    category: "Grammar",
    duration: "~20 Mins",
    icon: "bi-gender-ambiguous",
    subtopics: ["Grammatical Gender Agreement", "Definite & Indefinite Articles", "Pluralization Nouns"]
  },
  "basic greetings & everyday vocabulary": {
    category: "Conversation",
    duration: "~15 Mins",
    icon: "bi-chat-dots",
    subtopics: ["Formal/Informal Greetings", "Politeness Formula", "Daily Greetings & Vocab"]
  },
  // German
  "german genders & cases": {
    category: "Grammar",
    duration: "~25 Mins",
    icon: "bi-diagram-3",
    subtopics: ["Der, Die, Das Genders", "Nominative Case Subject", "Accusative Direct Object"]
  },
  "survival german phrases": {
    category: "Conversation",
    duration: "~20 Mins",
    icon: "bi-chat-dots",
    subtopics: ["Transit & Directions Cues", "Ordering Food & Drinks", "Locals Meet-and-Greet"]
  }
};

const getMetadata = (topicName) => {
  const cleanName = topicName.trim().toLowerCase();
  return SPANISH_METADATA[cleanName] || GENERAL_METADATA[cleanName] || {
    category: "Grammar",
    duration: "~20 Mins",
    icon: "bi-journal-bookmark",
    subtopics: []
  };
};

const renderFlagBackground = (langName) => {
  if (!langName) return null;
  const name = langName.trim().toLowerCase();

  const svgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
    filter: 'blur(4px)' // Higher blur for ultra-soft vaporous texture
  };

  switch (name) {
    case 'spanish':
      return (
        <svg style={{ ...svgStyle, opacity: 0.022 }} viewBox="0 0 3 2" preserveAspectRatio="none">
          <rect width="3" height="2" fill="#C60B1E" />
          <rect y="0.5" width="3" height="1" fill="#FCD116" />
          {/* Faint simplified shield */}
          <rect x="0.4" y="0.7" width="0.22" height="0.36" fill="#C60B1E" rx="0.04" opacity="0.2" />
          <circle cx="0.51" cy="0.7" r="0.07" fill="#FCD116" opacity="0.2" />
        </svg>
      );
    case 'french':
      return (
        <svg style={{ ...svgStyle, opacity: 0.022 }} viewBox="0 0 9 6" preserveAspectRatio="none">
          <rect width="3" height="6" fill="#00209F" />
          <rect x="3" width="3" height="6" fill="#FFFFFF" />
          <rect x="6" width="3" height="6" fill="#F42E38" />
        </svg>
      );
    case 'german':
      return (
        <svg style={{ ...svgStyle, opacity: 0.018 }} viewBox="0 0 5 3" preserveAspectRatio="none">
          <rect width="5" height="1" fill="#000000" />
          <rect y="1" width="5" height="1" fill="#DD0000" />
          <rect y="2" width="5" height="1" fill="#FFCC00" />
        </svg>
      );
    case 'english':
      return (
        <svg style={{ ...svgStyle, opacity: 0.018 }} viewBox="0 0 60 30" preserveAspectRatio="none">
          <rect width="60" height="30" fill="#00247d" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#b22222" strokeWidth="4" />
          <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 L30,30 M0,15 L60,15" stroke="#b22222" strokeWidth="6" />
        </svg>
      );
    default:
      return null;
  }
};

const TopicsPage = () => {
  const { language_id } = useParams();
  const [topics, setTopics] = useState([]);
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
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
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', borderColor: 'var(--color-brown-dark)', borderRightColor: 'transparent' }}>
          <span className="visually-hidden">Loading topics...</span>
        </div>
        <p className="mt-3 fs-5" style={{ color: 'var(--text-sec)' }}>Configuring curriculum modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 mt-4">
        <div className="alert alert-danger border-0 rounded-4 p-4 text-center glass-panel animate-fade-in" role="alert">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
          <h4 className="fw-bold" style={{ color: 'var(--color-brown-dark)' }}>Curriculum Offline</h4>
          <p className="mb-4" style={{ color: 'var(--text-sec)' }}>{error}</p>
          <Link to="/languages" className="btn btn-premium-primary">
            Return to Languages
          </Link>
        </div>
      </div>
    );
  }

  // Filter topics based on search and category inputs
  const filteredTopics = topics.filter(topic => {
    const meta = getMetadata(topic.topic_name);
    const matchesSearch = topic.topic_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.topic_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || meta.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Unique categories for the current syllabus
  const categoriesList = ['All', 'Basics', 'Grammar', 'Vocabulary', 'Conversation'];

  return (
    <div className="container py-5 animate-fade-in">
      {/* Breadcrumb / Back Link */}
      <div className="mb-4">
        <Link to="/languages" className="text-decoration-none d-inline-flex align-items-center gap-2 hover-opacity font-semibold" style={{ color: 'var(--text-sec)', transition: 'color 0.2s' }}>
          <i className="bi bi-arrow-left"></i> Back to Languages
        </Link>
      </div>

      {/* Header Info */}
      <div className="glass-panel p-4 p-md-5 mb-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4" style={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* Absolute Translucent Flag Overlay */}
        {renderFlagBackground(language?.language_name)}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge px-3 py-2 rounded-pill mb-3 animate-fade-in" style={{ background: 'var(--color-brown-dark)', color: '#FFFFFF' }}>
            {language?.language_name} Grammar & Vocab
          </span>
          <h1 className="fw-bold mb-2" style={{ color: 'var(--color-brown-dark)' }}>{language?.language_name} Syllabus</h1>
          <p className="mb-0 leading-relaxed" style={{ maxWidth: '700px', color: 'var(--text-sec)' }}>
            {language?.description}
          </p>
        </div>
        
        {/* Dynamic decorative emblem */}
        <div className="rounded-4 p-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', flexShrink: 0, background: 'var(--bg-sec)', border: '1px solid var(--card-border)', color: 'var(--color-brown-dark)', position: 'relative', zIndex: 1 }}>
          <i className="bi bi-journal-check fs-1"></i>
        </div>
      </div>

      {/* Filter and Search Dashboard Controls */}
      <div className="glass-panel p-4 mb-5">
        <div className="row g-4 align-items-center">
          
          {/* Search bar */}
          <div className="col-lg-5 col-md-6">
            <div className="search-container">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search modules by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control custom-input search-input w-100"
              />
            </div>
          </div>

          {/* Category Filter Badges */}
          <div className="col-lg-7 col-md-6">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Topics Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 fs-3" style={{ color: 'var(--color-brown-dark)' }}>Learning Modules</h2>
        <span className="small font-semibold text-secondary" style={{ background: 'var(--bg-sec)', padding: '6px 14px', borderRadius: '50px', border: '1px solid var(--card-border)' }}>
          Showing {filteredTopics.length} of {topics.length} Modules
        </span>
      </div>
      
      {filteredTopics.length === 0 ? (
        <div className="glass-panel p-5 text-center">
          <i className="bi bi-search fs-1 mb-3 d-block" style={{ color: 'var(--text-muted)' }}></i>
          <h4 className="fw-bold" style={{ color: 'var(--color-brown-dark)' }}>No Modules Found</h4>
          <p className="mb-0" style={{ color: 'var(--text-sec)' }}>
            We couldn't find any modules matching your filter inputs. Try typing something else!
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredTopics.map((topic, index) => {
            const meta = getMetadata(topic.topic_name);
            
            // Generate elegant progressive mock completion state based on index for Spanish
            let mockProgress = 0;
            if (language?.language_name?.toLowerCase() === 'spanish') {
              if (index === 0) mockProgress = 100;
              else if (index === 1) mockProgress = 60;
              else if (index === 2) mockProgress = 15;
            } else {
              // English/French/German basic progress states
              if (index === 0) mockProgress = 100;
            }

            return (
              <div className="col-md-6" key={topic.topic_id}>
                <ModuleCard
                  index={index}
                  topic={topic}
                  metadata={meta}
                  navigate={navigate}
                  progress={mockProgress}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopicsPage;
