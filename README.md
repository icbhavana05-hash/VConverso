# VConverso - Language Learning Management System (LMS)

VConverso is a complete, modular, secure, and beautiful full-stack Language Learning Management System designed as a college DBMS + Full-Stack project.

---

## 🚀 System Architecture

1. **Frontend:** React.js built with Vite, styled with Bootstrap 5 and custom premium glassmorphism layouts. Runs on port `3000`.
2. **Backend API:** Node.js + Express.js with JWT session authentication and bcrypt password hashing. Runs on port `5000`.
3. **Database Layer:** Standard MySQL using connection pooling, with an **adaptive local SQLite fallback** that automatically initializes and seeds all academic content (English, French, German, Spanish lessons & quizzes) out-of-the-box if MySQL is offline.

---

## 🏁 How to Run Locally

### 1. Launch the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the development server (runs on Port 5000):
   ```bash
   npm start
   ```

*Note: The backend automatically falls back to a local SQLite database (`backend/database.sqlite`) populated with data if no MySQL credentials are provided!*

### 2. Launch the Frontend React Client
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite React client (runs on Port 3000):
   ```bash
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`.

---

## 📂 Project Directory Structure

```
language_learning_project/
├── database/
│   └── schema.sql                # Complete MySQL DDL & Seeding SQL
├── backend/
│   ├── config/
│   │   └── db.js                 # Universal DB Adapter (MySQL + SQLite Fallback)
│   ├── controllers/
│   │   ├── authController.js     # User registration & password encryption
│   │   ├── langController.js     # Retrieves English, French, German, Spanish
│   │   ├── topicController.js     # Serves curriculum syllabus
│   │   ├── noteController.js     # Lesson notes reader
│   │   ├── quizController.js     # Scoring algorithm & quiz reports
│   │   └── progressController.js # Prepares student progress statistics
│   ├── middleware/
│   │   └── authMiddleware.js     # Protects private routes via JWT verification
│   ├── routes/
│   │   ├── auth.js               # Route mapping for registration/login
│   │   ├── languages.js
│   │   ├── topics.js
│   │   ├── notes.js
│   │   ├── quizzes.js            # Handles quizzes, questions, and submits
│   │   └── progress.js
│   ├── .env                      # Backend local environment variables
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Express server launcher
│   └── database.sqlite           # Local SQLite database (auto-seeded)
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── images/           # Store your local image assets here
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Glassmorphic responsive header navigation
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Context API for user authentication session
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Card-based secure login
│   │   │   ├── RegisterPage.jsx  # Student onboarding
│   │   │   ├── LanguagePage.jsx  # Elegant pathway cards with flag gradients
│   │   │   ├── TopicsPage.jsx    # Curriculum topics listing
│   │   │   ├── NotesPage.jsx     # Learning notes reading room
│   │   │   ├── QuizPage.jsx      # Interactive quiz assessment and review report
│   │   │   └── DashboardPage.jsx # Analytics dashboard with visual progress rings
│   │   ├── services/
│   │   │   └── api.js            # Axios client with automated JWT request headers
│   │   ├── App.jsx               # React Router DOM 6 configuration and Guards
│   │   ├── index.css             # HSL-derived premium glassmorphic stylesheet
│   │   └── main.jsx              # React mounting root
│   ├── .env                      # Frontend local environment variables
│   ├── index.html                # SEO metadata and Google Fonts setup
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configurations setting server to Port 3000
```

---

## 🌐 Production Deployment Steps

For a step-by-step walkthrough on how to deploy this project in production (Database to Railway MySQL, Backend to Render, Frontend to Railway Static), open the detailed walkthrough guide:
👉 **[walkthrough.md](file:///C:/Users/icbha/.gemini/antigravity/brain/ab8b0681-255c-4d14-b1f9-12e0afeb082e/walkthrough.md)**
