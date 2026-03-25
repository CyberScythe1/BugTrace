const db = require('../config/db');

async function getStats(req, res) {
  try {
    const users = await db.query('SELECT COUNT(*) as count FROM users');
    const reviews = await db.query('SELECT COUNT(*) as count FROM reviews');
    const avgScore = await db.query('SELECT COALESCE(AVG(average_score), 0) as avg FROM reviews');
    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalReviews: parseInt(reviews.rows[0].count),
      averageScore: parseFloat(parseFloat(avgScore.rows[0].avg).toFixed(1))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const result = await db.query(`
      SELECT u.id, u.email, u.name, u.avatar_url, u.role, u.created_at,
        (SELECT COUNT(*) FROM reviews r WHERE r.user_id = u.id) as review_count
      FROM users u ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllReviews(req, res) {
  try {
    const result = await db.query(`
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM reviews r LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getStats, getAllUsers, getAllReviews };
