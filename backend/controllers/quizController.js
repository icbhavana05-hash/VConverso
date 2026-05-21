const db = require('../config/db');

/**
 * Fetch quizzes for a selected topic
 * GET /api/quizzes/:topic_id
 */
exports.getQuizzesByTopic = async (req, res) => {
  const { topic_id } = req.params;

  try {
    const [quizzes] = await db.query(
      'SELECT * FROM Quizzes WHERE topic_id = ? ORDER BY quiz_id ASC',
      [topic_id]
    );

    res.status(200).json({
      success: true,
      quizzes
    });
  } catch (err) {
    console.error('[Get Quizzes Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quizzes for this topic.'
    });
  }
};

/**
 * Fetch all questions for a selected quiz
 * GET /api/questions/:quiz_id
 */
exports.getQuestionsByQuiz = async (req, res) => {
  const { quiz_id } = req.params;

  try {
    // 1. Verify quiz exists
    const [quizInfo] = await db.query(
      'SELECT q.*, t.topic_name, t.language_id FROM Quizzes q JOIN Topics t ON q.topic_id = t.topic_id WHERE q.quiz_id = ?',
      [quiz_id]
    );

    if (!quizInfo || quizInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Selected quiz not found.'
      });
    }

    // 2. Fetch questions but DO NOT send correct_answer if we want to be secure (though we can send it or verify on backend). Let's fetch the full questions for backend verification, but for the client request we can choose to omit correct_answer or keep it if requested. The frontend needs correct_answer only on submission review, so we will omit correct_answer from this fetch to prevent cheating! When they submit, we evaluate on the backend and return the results. Perfect security!
    // Wait, the prompt says "Quiz page: After submission show score, correct answers, performance summary". So the client gets the correct answers after submitting! This is ideal.
    const [questions] = await db.query(
      'SELECT question_id, quiz_id, question_text, option_a, option_b, option_c, option_d FROM Qs WHERE quiz_id = ? ORDER BY question_id ASC',
      [quiz_id]
    );

    res.status(200).json({
      success: true,
      quiz: quizInfo[0],
      questions
    });
  } catch (err) {
    console.error('[Get Questions Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve questions for this quiz.'
    });
  }
};

/**
 * Submit quiz answers and auto-evaluate performance
 * POST /api/submit-quiz
 */
exports.submitQuiz = async (req, res) => {
  const userId = req.user.user_id; // Decoded from authMiddleware JWT
  const { quiz_id, answers } = req.body; // answers is an object/array: e.g. { "question_id": "selected_option" }

  if (!quiz_id || !answers) {
    return res.status(400).json({
      success: false,
      message: 'Missing required submission fields (quiz_id, answers).'
    });
  }

  try {
    // 1. Get all correct answers for this quiz
    const [correctAnswers] = await db.query(
      'SELECT question_id, question_text, option_a, option_b, option_c, option_d, correct_answer FROM Qs WHERE quiz_id = ?',
      [quiz_id]
    );

    if (!correctAnswers || correctAnswers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Questions for this quiz were not found.'
      });
    }

    // 2. Evaluate answers
    let score = 0;
    const diagnosticReport = [];

    for (const q of correctAnswers) {
      const qId = q.question_id;
      const selected = answers[qId] || ''; // User's answer for this question ID (e.g. 'A', 'B', etc.)
      const isCorrect = selected.trim().toUpperCase() === q.correct_answer.trim().toUpperCase();

      if (isCorrect) {
        score++;
      }

      diagnosticReport.push({
        question_id: qId,
        question_text: q.question_text,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d
        },
        selected_answer: selected,
        correct_answer: q.correct_answer,
        is_correct: isCorrect
      });

      // Save/Update Answers table record for each question
      // Remove old answer if exists, then insert (or ON DUPLICATE / SQLite equivalent)
      await db.query(
        'DELETE FROM Answers WHERE user_id = ? AND question_id = ?',
        [userId, qId]
      );
      
      await db.query(
        'INSERT INTO Answers (question_id, user_id, selected_answer) VALUES (?, ?, ?)',
        [qId, userId, selected]
      );
    }

    // 3. Save Attempt details in Attempts table
    await db.query(
      'INSERT INTO Attempts (user_id, quiz_id, score) VALUES (?, ?, ?)',
      [userId, quiz_id, score]
    );

    // 4. Update the User's overall Scores table for this language!
    // First, find the language_id of the quiz
    const [quizLanguageResult] = await db.query(
      'SELECT t.language_id FROM Quizzes q JOIN Topics t ON q.topic_id = t.topic_id WHERE q.quiz_id = ?',
      [quiz_id]
    );

    if (quizLanguageResult && quizLanguageResult.length > 0) {
      const languageId = quizLanguageResult[0].language_id;

      // Find all quizzes belonging to this language
      const [allQuizzes] = await db.query(
        'SELECT q.quiz_id, q.total_marks FROM Quizzes q JOIN Topics t ON q.topic_id = t.topic_id WHERE t.language_id = ?',
        [languageId]
      );

      const totalQuizzesInLanguage = allQuizzes.length;

      // Find all completed (attempted) quizzes in this language by this user, and their HIGHEST scores
      let completedQuizzesCount = 0;
      let cumulativeBestScore = 0;

      for (const qItem of allQuizzes) {
        const [bestAttempt] = await db.query(
          'SELECT MAX(score) as max_score FROM Attempts WHERE user_id = ? AND quiz_id = ?',
          [userId, qItem.quiz_id]
        );

        if (bestAttempt && bestAttempt[0] && bestAttempt[0].max_score !== null) {
          completedQuizzesCount++;
          cumulativeBestScore += bestAttempt[0].max_score;
        }
      }

      // Calculate progress percentage
      const progressPercentage = totalQuizzesInLanguage > 0 
        ? parseFloat(((completedQuizzesCount / totalQuizzesInLanguage) * 100).toFixed(2))
        : 0.0;

      // Check if user has an existing score entry for this language
      const [existingScores] = await db.query(
        'SELECT * FROM Scores WHERE user_id = ? AND language_id = ?',
        [userId, languageId]
      );

      if (existingScores && existingScores.length > 0) {
        await db.query(
          'UPDATE Scores SET total_score = ?, progress_percentage = ? WHERE user_id = ? AND language_id = ?',
          [cumulativeBestScore, progressPercentage, userId, languageId]
        );
      } else {
        await db.query(
          'INSERT INTO Scores (user_id, language_id, total_score, progress_percentage) VALUES (?, ?, ?, ?)',
          [userId, languageId, cumulativeBestScore, progressPercentage]
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Quiz submitted and graded successfully!',
      score,
      total_questions: correctAnswers.length,
      report: diagnosticReport
    });

  } catch (err) {
    console.error('[Submit Quiz Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process quiz submission.'
    });
  }
};
