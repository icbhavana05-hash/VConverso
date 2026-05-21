const db = require('../config/db');

/**
 * Fetch all topics for a selected language
 * GET /api/topics/:language_id
 */
exports.getTopicsByLanguage = async (req, res) => {
  const { language_id } = req.params;

  try {
    // 1. Fetch language details first to confirm it exists
    const [langInfo] = await db.query(
      'SELECT * FROM Language WHERE language_id = ?',
      [language_id]
    );

    if (!langInfo || langInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Selected language not found.'
      });
    }

    // 2. Fetch topics under this language
    const [topics] = await db.query(
      'SELECT * FROM Topics WHERE language_id = ? ORDER BY topic_id ASC',
      [language_id]
    );

    res.status(200).json({
      success: true,
      language: langInfo[0],
      topics
    });
  } catch (err) {
    console.error('[Topics Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve topics for this language.'
    });
  }
};
