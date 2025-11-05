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
    const { 
      email_notifications, 
      project_updates, 
      message_notifications,
      location,
      linkedin_url,
      github_url,
      scholar_url,
      orcid,
      website_url,
      phone,
      is_profile_public
    } = req.body;

    console.log('⚙️  Updating settings for user ID:', userId);

    // Update user profile fields if provided
    if (location || linkedin_url || github_url || scholar_url || orcid || website_url || phone || is_profile_public !== undefined) {
      await pool.query(
        `UPDATE users 
         SET location = COALESCE(?, location),
             linkedin_url = COALESCE(?, linkedin_url),
             github_url = COALESCE(?, github_url),
             scholar_url = COALESCE(?, scholar_url),
             orcid = COALESCE(?, orcid),
             website_url = COALESCE(?, website_url),
             phone = COALESCE(?, phone),
             is_profile_public = COALESCE(?, is_profile_public)
         WHERE id = ?`,
        [location, linkedin_url, github_url, scholar_url, orcid, website_url, phone, is_profile_public, userId]
      );
    }

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

// Get user publications
router.get('/:id/publications', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id === 'me' ? (req as any).user.id : parseInt(req.params.id);

    const result = await pool.query(
      'SELECT * FROM publications WHERE user_id = ? ORDER BY year DESC, created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching publications:', err);
    res.status(500).json({ error: 'Failed to fetch publications' });
  }
});

// Add publication
router.post('/publications', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { title, authors, journal, year, doi, url, citation_count } = req.body;

    if (!title || !year) {
      return res.status(400).json({ error: 'Title and year are required' });
    }

    const insertResult = await pool.query(
      `INSERT INTO publications (user_id, title, authors, journal, year, doi, url, citation_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, authors, journal, year, doi || null, url || null, citation_count || 0]
    );

    const insertedId = insertResult.insertId;
    const fetched = await pool.query('SELECT * FROM publications WHERE id = ?', [insertedId]);

    res.status(201).json(fetched.rows[0]);
  } catch (err) {
    console.error('Error adding publication:', err);
    res.status(500).json({ error: 'Failed to add publication' });
  }
});

// Endorse a skill
router.post('/skills/:skillId/endorse', authenticateToken, async (req, res) => {
  try {
    const endorserId = (req as any).user.id;
    const userSkillId = parseInt(req.params.skillId);

    // Check if skill exists and get the user_id
    const skillCheck = await pool.query('SELECT user_id FROM user_skills WHERE id = ?', [userSkillId]);
    
    if (skillCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const skillOwnerId = (skillCheck.rows[0] as any).user_id;

    // Can't endorse your own skill
    if (skillOwnerId === endorserId) {
      return res.status(400).json({ error: 'Cannot endorse your own skill' });
    }

    // Check if already endorsed
    const existingEndorsement = await pool.query(
      'SELECT * FROM skill_endorsements WHERE user_skill_id = ? AND endorser_id = ?',
      [userSkillId, endorserId]
    );

    if (existingEndorsement.rows.length > 0) {
      return res.status(400).json({ error: 'Already endorsed this skill' });
    }

    // Create endorsement
    await pool.query(
      'INSERT INTO skill_endorsements (user_skill_id, endorser_id) VALUES (?, ?)',
      [userSkillId, endorserId]
    );

    // Create notification
    const endorserInfo = await pool.query('SELECT first_name, last_name FROM users WHERE id = ?', [endorserId]);
    const endorserName = `${(endorserInfo.rows[0] as any).first_name} ${(endorserInfo.rows[0] as any).last_name}`;
    
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES (?, 'skill_endorsement', 'Skill Endorsement', ?, ?)`,
      [skillOwnerId, `${endorserName} endorsed your skill`, `/profile/${skillOwnerId}`]
    );

    res.json({ message: 'Skill endorsed successfully' });
  } catch (err) {
    console.error('Error endorsing skill:', err);
    res.status(500).json({ error: 'Failed to endorse skill' });
  }
});

// Get skill endorsements
router.get('/skills/:skillId/endorsements', authenticateToken, async (req, res) => {
  try {
    const userSkillId = parseInt(req.params.skillId);

    const result = await pool.query(
      `SELECT se.*, u.first_name, u.last_name, u.avatar 
       FROM skill_endorsements se
       JOIN users u ON se.endorser_id = u.id
       WHERE se.user_skill_id = ?
       ORDER BY se.created_at DESC`,
      [userSkillId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching endorsements:', err);
    res.status(500).json({ error: 'Failed to fetch endorsements' });
  }
});

// Get user statistics
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id === 'me' ? (req as any).user.id : parseInt(req.params.id);

    // Get project count
    const projectCount = await pool.query('SELECT COUNT(*) as count FROM projects WHERE user_id = ?', [userId]);
    
    // Get skill count
    const skillCount = await pool.query('SELECT COUNT(*) as count FROM user_skills WHERE user_id = ?', [userId]);
    
    // Get total endorsements received
    const endorsementCount = await pool.query(
      `SELECT COUNT(*) as count FROM skill_endorsements se
       JOIN user_skills us ON se.user_skill_id = us.id
       WHERE us.user_id = ?`,
      [userId]
    );
    
    // Get publication count
    const publicationCount = await pool.query('SELECT COUNT(*) as count FROM publications WHERE user_id = ?', [userId]);
    
    // Get profile views
    const viewsCount = await pool.query(
      'SELECT profile_views FROM users WHERE id = ?',
      [userId]
    );

    // Track profile view if viewing another user's profile
    const viewerId = (req as any).user.id;
    if (viewerId !== userId) {
      // Increment view count
      await pool.query('UPDATE users SET profile_views = profile_views + 1 WHERE id = ?', [userId]);
      
      // Record view
      await pool.query(
        'INSERT INTO profile_views (profile_user_id, viewer_user_id) VALUES (?, ?)',
        [userId, viewerId]
      );
    }

    res.json({
      projects: (projectCount.rows[0] as any).count,
      skills: (skillCount.rows[0] as any).count,
      endorsements: (endorsementCount.rows[0] as any).count,
      publications: (publicationCount.rows[0] as any).count,
      profileViews: (viewsCount.rows[0] as any).profile_views || 0
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

export default router;