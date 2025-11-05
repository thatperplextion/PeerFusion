import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get feed posts
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    // Get user's connections
    const { data: connections } = await supabase
      .from('connections')
      .select('requester_id, addressee_id')
      .eq('status', 'accepted')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

    const connectionIds = new Set([userId]);
    connections?.forEach(conn => {
      connectionIds.add(conn.requester_id === userId ? conn.addressee_id : conn.requester_id);
    });

    // Get posts from connections
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_user_id_fkey (
          first_name,
          last_name,
          avatar
        )
      `)
      .in('user_id', Array.from(connectionIds))
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    // Get like counts, comment counts, and user likes for each post
    const enrichedPosts = await Promise.all((posts || []).map(async (post) => {
      const { count: likeCount } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      const { count: commentCount } = await supabase
        .from('post_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      const { data: userLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', userId)
        .single();

      return {
        ...post,
        like_count: likeCount || 0,
        comment_count: commentCount || 0,
        user_liked: !!userLike
      };
    }));

    res.json(enrichedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { content, image_url, post_type } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert([{
        user_id: userId,
        content,
        image_url: image_url || null,
        post_type: post_type || 'update'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Failed to create post' });
    }

    // Create activity
    await supabase
      .from('activities')
      .insert([{
        user_id: userId,
        activity_type: 'post',
        description: `Posted: ${content.substring(0, 100)}...`,
        reference_id: post.id,
        reference_type: 'post'
      }]);

    res.status(201).json({ 
      message: 'Post created successfully',
      postId: post.id
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like a post
router.post('/:postId/like', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { postId } = req.params;

    const { error } = await supabase
      .from('post_likes')
      .insert([{ post_id: parseInt(postId), user_id: userId }]);

    if (error && !error.message.includes('duplicate')) {
      console.error('Error liking post:', error);
      return res.status(500).json({ error: 'Failed to like post' });
    }

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike a post
router.delete('/:postId/like', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { postId } = req.params;

    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', parseInt(postId))
      .eq('user_id', userId);

    if (error) {
      console.error('Error unliking post:', error);
      return res.status(500).json({ error: 'Failed to unlike post' });
    }

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// Get comments for a post
router.get('/:postId/comments', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const { data: comments, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        users!post_comments_user_id_fkey (
          first_name,
          last_name,
          avatar
        )
      `)
      .eq('post_id', parseInt(postId))
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }

    res.json(comments || []);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a comment
router.post('/:postId/comments', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const { data: comment, error } = await supabase
      .from('post_comments')
      .insert([{
        post_id: parseInt(postId),
        user_id: userId,
        content
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ error: 'Failed to add comment' });
    }

    res.status(201).json({ 
      message: 'Comment added successfully',
      commentId: comment.id
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete a post
router.delete('/:postId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { postId } = req.params;

    // Check if user owns the post
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', parseInt(postId))
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', parseInt(postId));

    if (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Failed to delete post' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
