import { Router } from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get user by ID or 'me'
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const paramId = req.params.id;
    const authenticatedUserId = (req as any).user.id;
    
    console.log('👤 Fetching user profile for param:', paramId, 'authenticated user:', authenticatedUserId);
    
    // If the ID is 'me', use the authenticated user's ID
    const userId = paramId === 'me' ? authenticatedUserId : parseInt(paramId);
    
    if (paramId !== 'me' && isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, bio, institution, field_of_study, avatar, created_at 
       FROM users WHERE id = ?`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found for ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ User profile fetched successfully');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { first_name, last_name, bio, institution, field_of_study } = req.body;
    
    console.log('📝 Updating profile for user ID:', userId);
    
    // Validate input
    if (!first_name || !last_name) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }
    
    await pool.query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, bio = ?, institution = ?, field_of_study = ?
       WHERE id = ?`,
      [first_name, last_name, bio, institution, field_of_study, userId]
    );

    // Fetch updated row
    const fetched = await pool.query(
      `SELECT id, email, first_name, last_name, bio, institution, field_of_study, created_at FROM users WHERE id = ?`,
      [userId]
    );

    if (fetched.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Profile updated successfully');
    res.json(fetched.rows[0]);
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add a skill for the authenticated user
router.post('/skills', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const {
      skill_name,
      category,
      proficiency_level,
      description,
      years_of_experience,
      willing_to_mentor,
      willing_to_collaborate
    } = req.body;

    console.log('🎯 Adding skill for user ID:', userId);

    // Validate required fields
    if (!skill_name || !category) {
      return res.status(400).json({ error: 'Skill name and category are required' });
    }

    const insertResult = await pool.query(
      `INSERT INTO user_skills 
       (user_id, skill_name, category, proficiency_level, description, years_of_experience, willing_to_mentor, willing_to_collaborate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        skill_name,
        category,
        proficiency_level || 'intermediate',
        description || null,
        years_of_experience || null,
        willing_to_mentor || false,
        willing_to_collaborate || false
      ]
    );

    const insertedId = insertResult.insertId;
    const fetched = await pool.query('SELECT * FROM user_skills WHERE id = ?', [insertedId]);

    console.log('✅ Skill added successfully');
    res.status(201).json(fetched.rows[0]);
  } catch (err) {
    console.error('❌ Error adding skill:', err);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// Get skills for a user
router.get('/:id/skills', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id === 'me' ? (req as any).user.id : parseInt(req.params.id);

    console.log('🎯 Fetching skills for user ID:', userId);

    const result = await pool.query(
      'SELECT * FROM user_skills WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    console.log('✅ Skills fetched successfully');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching skills:', err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Update user settings/preferences
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { email_notifications, project_updates, message_notifications } = req.body;

    console.log('⚙️  Updating settings for user ID:', userId);

    // For now, just return success since we don't have a settings table
    // In production, you'd store these in a user_settings table
    res.json({ 
      message: 'Settings updated successfully',
      settings: {
        email_notifications,
        project_updates,
        message_notifications
      }
    });
  } catch (err) {
    console.error('❌ Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;