const db = require('../config/db');

/**
 * Fetch progress analytics for a specific user
 * GET /api/progress/:user_id
 */
exports.getUserProgress = async (req, res) => {
  const { user_id } = req.params;

  try {
    // 1. Double check that user exists
    const [userInfo] = await db.query(
      'SELECT user_id, name, email FROM User WHERE user_id = ?',
      [user_id]
    );

    if (!userInfo || userInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // 2. Total quizzes attempted (unique quizzes) & Total attempts count (excluding English)
    const [attemptStats] = await db.query(
      `SELECT COUNT(a.attempt_id) as total_attempts, COUNT(DISTINCT a.quiz_id) as unique_quizzes 
       FROM Attempts a 
       JOIN Quizzes q ON a.quiz_id = q.quiz_id
       JOIN Topics t ON q.topic_id = t.topic_id
       JOIN Language l ON t.language_id = l.language_id
       WHERE a.user_id = ? AND LOWER(l.language_name) != 'english'`,
      [user_id]
    );

    const totalAttempts = attemptStats[0].total_attempts || 0;
    const uniqueQuizzesAttempted = attemptStats[0].unique_quizzes || 0;

    // 3. Average score across all attempts (excluding English)
    const [avgStats] = await db.query(
      `SELECT AVG(a.score) as avg_score 
       FROM Attempts a 
       JOIN Quizzes q ON a.quiz_id = q.quiz_id
       JOIN Topics t ON q.topic_id = t.topic_id
       JOIN Language l ON t.language_id = l.language_id
       WHERE a.user_id = ? AND LOWER(l.language_name) != 'english'`,
      [user_id]
    );
    const averageScore = avgStats[0].avg_score ? parseFloat(parseFloat(avgStats[0].avg_score).toFixed(2)) : 0.0;

    // 4. Overall Progress percentage (excluding English)
    const [progressStats] = await db.query(
      `SELECT AVG(s.progress_percentage) as avg_progress 
       FROM Scores s 
       JOIN Language l ON s.language_id = l.language_id
       WHERE s.user_id = ? AND LOWER(l.language_name) != 'english'`,
      [user_id]
    );
    const overallProgress = progressStats[0].avg_progress ? parseFloat(parseFloat(progressStats[0].avg_progress).toFixed(2)) : 0.0;

    // 5. Language-wise performance details (excluding English)
    const [languagePerformance] = await db.query(
      `SELECT 
        l.language_id, 
        l.language_name, 
        l.language_image,
        COALESCE(s.total_score, 0) as total_score, 
        COALESCE(s.progress_percentage, 0.0) as progress_percentage,
        (CASE WHEN s.user_id IS NOT NULL THEN 1 ELSE 0 END) as enrolled
      FROM Language l 
      LEFT JOIN Scores s ON l.language_id = s.language_id AND s.user_id = ?
      WHERE LOWER(l.language_name) != 'english'
      ORDER BY l.language_id ASC`,
      [user_id]
    );

    // 6. Recent quiz attempts (excluding English)
    const [recentAttempts] = await db.query(
      `SELECT 
        a.attempt_id, 
        a.attempt_date, 
        a.score, 
        q.quiz_title, 
        t.topic_name, 
        l.language_name 
      FROM Attempts a 
      JOIN Quizzes q ON a.quiz_id = q.quiz_id 
      JOIN Topics t ON q.topic_id = t.topic_id 
      JOIN Language l ON t.language_id = l.language_id 
      WHERE a.user_id = ? AND LOWER(l.language_name) != 'english'
      ORDER BY a.attempt_date DESC 
      LIMIT 5`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      user: userInfo[0],
      analytics: {
        total_attempts: totalAttempts,
        unique_quizzes_attempted: uniqueQuizzesAttempted,
        average_score: averageScore,
        overall_progress_percentage: overallProgress,
        languages: languagePerformance,
        recent_activity: recentAttempts
      }
    });

  } catch (err) {
    console.error('[Progress Dashboard Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve progress data.'
    });
  }
};
