import { Router } from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Create project
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, link, status } = req.body;
  const userId = (req as any).user.id;
  
  // Validate required fields
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  // Validate status if provided
  const validStatuses = ['seeking', 'active', 'completed'];
  const projectStatus = status && validStatuses.includes(status) ? status : 'seeking';
  
  try {
    const insertResult = await pool.query(
      'INSERT INTO projects (user_id, title, description, link, status) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description, link || null, projectStatus]
    );
    const insertedId = insertResult.insertId;
    const fetched = await pool.query('SELECT * FROM projects WHERE id = ?', [insertedId]);
    res.status(201).json(fetched.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Get projects for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  try {
    const result = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, 
       CONCAT(u.first_name, ' ', u.last_name) as user_name 
       FROM projects p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get all projects (for browsing)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, 
       CONCAT(u.first_name, ' ', u.last_name) as user_name 
       FROM projects p 
       JOIN users u ON p.user_id = u.id 
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

export default router;
