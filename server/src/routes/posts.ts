import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Get feed posts
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get posts from user's connections and own posts
    const result = await pool.query(`
      SELECT 
        p.*,
        u.first_name,
        u.last_name,
        u.avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) as user_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? 
        OR p.user_id IN (
          SELECT addressee_id FROM connections 
          WHERE requester_id = ? AND status = 'accepted'
          UNION
          SELECT requester_id FROM connections 
          WHERE addressee_id = ? AND status = 'accepted'
        )
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [userId, userId, userId, userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { content, image_url, post_type } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await pool.query(
      `INSERT INTO posts (user_id, content, image_url, post_type) 
       VALUES (?, ?, ?, ?)`,
      [userId, content, image_url || null, post_type || 'update']
    );

    // Create activity
    await pool.query(
      `INSERT INTO activities (user_id, activity_type, description, reference_id, reference_type) 
       VALUES (?, 'post', ?, ?, 'post')`,
      [userId, `Posted: ${content.substring(0, 100)}...`, result.insertId]
    );

    res.status(201).json({ 
      message: 'Post created successfully',
      postId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like a post
router.post('/:postId/like', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { postId } = req.params;

    await pool.query(
      `INSERT IGNORE INTO post_likes (post_id, user_id) VALUES (?, ?)`,
      [postId, userId]
    );

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike a post
router.delete('/:postId/like', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { postId } = req.params;

    await pool.query(
      `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// Get comments for a post
router.get('/:postId/comments', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const result = await pool.query(`
      SELECT 
        c.*,
        u.first_name,
        u.last_name,
        u.avatar
      FROM post_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a comment
router.post('/:postId/comments', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const result = await pool.query(
      `INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?)`,
      [postId, userId, content]
    );

    res.status(201).json({ 
      message: 'Comment added successfully',
      commentId: result.insertId 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete a post
router.delete('/:postId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { postId } = req.params;

    // Check if user owns the post
    const checkResult = await pool.query(
      `SELECT user_id FROM posts WHERE id = ?`,
      [postId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if ((checkResult.rows[0] as any).user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await pool.query(`DELETE FROM posts WHERE id = ?`, [postId]);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
