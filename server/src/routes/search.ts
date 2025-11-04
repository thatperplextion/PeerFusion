import { Router } from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Search for users and projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const searchQuery = req.query.q as string || '';
    const searchType = req.query.type as string || 'all'; // 'users', 'projects', or 'all'

    console.log('🔍 Searching for:', searchQuery, 'Type:', searchType);

    const results: any = {
      users: [],
      projects: []
    };

    if (searchType === 'users' || searchType === 'all') {
      // Search users by name or email
      const userResults = await pool.query(
        `SELECT id, email, first_name, last_name, bio, institution, field_of_study 
         FROM users 
         WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR bio LIKE ?
         LIMIT 20`,
        [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
      );
      results.users = userResults.rows;
    }

    if (searchType === 'projects' || searchType === 'all') {
      // Search projects by title or description
      const projectResults = await pool.query(
        `SELECT p.*, u.first_name, u.last_name 
         FROM projects p
         JOIN users u ON p.user_id = u.id
         WHERE p.title LIKE ? OR p.description LIKE ?
         ORDER BY p.created_at DESC
         LIMIT 20`,
        [`%${searchQuery}%`, `%${searchQuery}%`]
      );
      results.projects = projectResults.rows;
    }

    console.log('✅ Search completed');
    res.json(results);
  } catch (err) {
    console.error('❌ Error searching:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
