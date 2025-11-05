import { Router } from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get user's connections
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar,
        u.institution,
        u.field_of_study,
        c.created_at as connected_at
      FROM connections c
      JOIN users u ON (
        CASE 
          WHEN c.requester_id = ? THEN c.addressee_id
          ELSE c.requester_id
        END = u.id
      )
      WHERE (c.requester_id = ? OR c.addressee_id = ?)
        AND c.status = 'accepted'
      ORDER BY c.created_at DESC
    `, [userId, userId, userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

// Get pending connection requests
router.get('/requests', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(`
      SELECT 
        c.id as connection_id,
        c.created_at,
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar,
        u.institution,
        u.field_of_study
      FROM connections c
      JOIN users u ON c.requester_id = u.id
      WHERE c.addressee_id = ? AND c.status = 'pending'
      ORDER BY c.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    res.status(500).json({ error: 'Failed to fetch connection requests' });
  }
});

// Send connection request
router.post('/request/:userId', authenticateToken, async (req: any, res) => {
  try {
    const requesterId = req.user.userId;
    const addresseeId = parseInt(req.params.userId);

    if (requesterId === addresseeId) {
      return res.status(400).json({ error: 'Cannot connect with yourself' });
    }

    // Check if connection already exists
    const existing = await pool.query(`
      SELECT * FROM connections 
      WHERE (requester_id = ? AND addressee_id = ?)
         OR (requester_id = ? AND addressee_id = ?)
    `, [requesterId, addresseeId, addresseeId, requesterId]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Connection already exists or pending' });
    }

    await pool.query(
      `INSERT INTO connections (requester_id, addressee_id, status) VALUES (?, ?, 'pending')`,
      [requesterId, addresseeId]
    );

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link) 
       VALUES (?, 'connection_request', 'New Connection Request', ?, ?)`,
      [
        addresseeId,
        `Someone wants to connect with you`,
        `/profile/${requesterId}`
      ]
    );

    res.status(201).json({ message: 'Connection request sent' });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
});

// Accept connection request
router.put('/accept/:connectionId', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const connectionId = parseInt(req.params.connectionId);

    // Verify this request is for the current user
    const connection: any = await pool.query(
      `SELECT * FROM connections WHERE id = ? AND addressee_id = ?`,
      [connectionId, userId]
    );

    if (connection.rows.length === 0) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    await pool.query(
      `UPDATE connections SET status = 'accepted' WHERE id = ?`,
      [connectionId]
    );

    // Create activity for both users
    const requesterId = connection.rows[0].requester_id;
    await pool.query(
      `INSERT INTO activities (user_id, activity_type, description, reference_id) 
       VALUES (?, 'connection', 'Connected with a new user', ?)`,
      [userId, requesterId]
    );
    await pool.query(
      `INSERT INTO activities (user_id, activity_type, description, reference_id) 
       VALUES (?, 'connection', 'Connected with a new user', ?)`,
      [requesterId, userId]
    );

    res.json({ message: 'Connection accepted' });
  } catch (error) {
    console.error('Error accepting connection:', error);
    res.status(500).json({ error: 'Failed to accept connection' });
  }
});

// Reject connection request
router.delete('/reject/:connectionId', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const connectionId = parseInt(req.params.connectionId);

    await pool.query(
      `DELETE FROM connections WHERE id = ? AND addressee_id = ?`,
      [connectionId, userId]
    );

    res.json({ message: 'Connection request rejected' });
  } catch (error) {
    console.error('Error rejecting connection:', error);
    res.status(500).json({ error: 'Failed to reject connection' });
  }
});

// Remove connection
router.delete('/:userId', authenticateToken, async (req: any, res) => {
  try {
    const currentUserId = req.user.userId;
    const userId = parseInt(req.params.userId);

    await pool.query(
      `DELETE FROM connections 
       WHERE (requester_id = ? AND addressee_id = ?)
          OR (requester_id = ? AND addressee_id = ?)`,
      [currentUserId, userId, userId, currentUserId]
    );

    res.json({ message: 'Connection removed' });
  } catch (error) {
    console.error('Error removing connection:', error);
    res.status(500).json({ error: 'Failed to remove connection' });
  }
});

// Check connection status with a user
router.get('/status/:userId', authenticateToken, async (req: any, res) => {
  try {
    const currentUserId = req.user.userId;
    const userId = parseInt(req.params.userId);

    const result: any = await pool.query(`
      SELECT status, requester_id, addressee_id 
      FROM connections 
      WHERE (requester_id = ? AND addressee_id = ?)
         OR (requester_id = ? AND addressee_id = ?)
    `, [currentUserId, userId, userId, currentUserId]);

    if (result.rows.length === 0) {
      return res.json({ status: 'none' });
    }

    const connection = result.rows[0];
    const isPending = connection.status === 'pending';
    const isRequester = connection.requester_id === currentUserId;

    res.json({
      status: connection.status,
      isRequester: isRequester,
      canAccept: isPending && !isRequester
    });
  } catch (error) {
    console.error('Error checking connection status:', error);
    res.status(500).json({ error: 'Failed to check connection status' });
  }
});

export default router;
