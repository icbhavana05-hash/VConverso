const db = require('../config/db');

/**
 * Fetch all notes/learning content for a selected topic
 * GET /api/notes/:topic_id
 */
exports.getNotesByTopic = async (req, res) => {
  const { topic_id } = req.params;

  try {
    // 1. Check if the topic exists
    const [topicInfo] = await db.query(
      'SELECT t.*, l.language_name FROM Topics t JOIN Language l ON t.language_id = l.language_id WHERE t.topic_id = ?',
      [topic_id]
    );

    if (!topicInfo || topicInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Selected learning topic not found.'
      });
    }

    // 2. Retrieve all notes associated with this topic
    const [notes] = await db.query(
      'SELECT * FROM Notes WHERE topic_id = ? ORDER BY note_id ASC',
      [topic_id]
    );

    res.status(200).json({
      success: true,
      topic: topicInfo[0],
      notes
    });
  } catch (err) {
    console.error('[Notes Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notes for this topic.'
    });
  }
};
