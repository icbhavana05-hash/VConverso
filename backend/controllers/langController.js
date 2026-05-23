const db = require('../config/db');

/**
 * Fetch all available languages
 * GET /api/languages
 */
exports.getLanguages = async (req, res) => {
  try {
    const [languages] = await db.query("SELECT * FROM Language WHERE LOWER(language_name) != 'english' ORDER BY language_id ASC");
    res.status(200).json({
      success: true,
      languages
    });
  } catch (err) {
    console.error('[Languages Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve languages.'
    });
  }
};

/**
 * Enroll user in a language
 * POST /api/languages/enroll
 */
exports.enrollLanguage = async (req, res) => {
  const userId = req.user.user_id;
  const { language_id } = req.body;

  if (!language_id) {
    return res.status(400).json({
      success: false,
      message: 'Please provide language_id.'
    });
  }

  try {
    // Check if language exists
    const [langExists] = await db.query('SELECT * FROM Language WHERE language_id = ?', [language_id]);
    if (!langExists || langExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Selected language not found.'
      });
    }

    // Check if user is already enrolled
    const [existing] = await db.query(
      'SELECT * FROM Scores WHERE user_id = ? AND language_id = ?',
      [userId, language_id]
    );

    if (existing && existing.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this language.'
      });
    }

    // Insert new Scores entry for this language
    await db.query(
      'INSERT INTO Scores (user_id, language_id, total_score, progress_percentage) VALUES (?, ?, 0, 0.0)',
      [userId, language_id]
    );

    res.status(201).json({
      success: true,
      message: 'Enrolled in language successfully!'
    });
  } catch (err) {
    console.error('[Enroll Language Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in language.'
    });
  }
};

/**
 * Unenroll user from a language (Deletes progress data)
 * POST /api/languages/unenroll
 */
exports.unenrollLanguage = async (req, res) => {
  const userId = req.user.user_id;
  const { language_id } = req.body;

  if (!language_id) {
    return res.status(400).json({
      success: false,
      message: 'Please provide language_id.'
    });
  }

  try {
    // 1. Clean up Attempts for quizzes inside this language
    await db.query(
      `DELETE FROM Attempts 
       WHERE user_id = ? 
         AND quiz_id IN (
           SELECT q.quiz_id 
           FROM Quizzes q
           JOIN Topics t ON q.topic_id = t.topic_id
           WHERE t.language_id = ?
         )`,
      [userId, language_id]
    ).catch(err => console.error('[Unenroll Attempts Clean Warning]:', err.message));

    // 2. Clean up Answers for questions inside this language
    await db.query(
      `DELETE FROM Answers 
       WHERE user_id = ? 
         AND question_id IN (
           SELECT question_id 
           FROM Qs 
           WHERE quiz_id IN (
             SELECT q.quiz_id 
             FROM Quizzes q
             JOIN Topics t ON q.topic_id = t.topic_id
             WHERE t.language_id = ?
           )
         )`,
      [userId, language_id]
    ).catch(err => console.error('[Unenroll Answers Clean Warning]:', err.message));

    // 3. Delete from Scores
    const [result] = await db.query(
      'DELETE FROM Scores WHERE user_id = ? AND language_id = ?',
      [userId, language_id]
    );

    res.status(200).json({
      success: true,
      message: 'Unenrolled from language and progress reset successfully!'
    });
  } catch (err) {
    console.error('[Unenroll Language Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to unenroll from language.'
    });
  }
};
