import { Router } from 'express';
import { supabase } from '../supabase';
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
      // Search users by name or email using ilike for case-insensitive search
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, bio, institution, field_of_study, avatar')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
        .limit(20);
      
      if (!error) {
        results.users = users || [];
      }
    }

    if (searchType === 'projects' || searchType === 'all') {
      // Search projects by title or description
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          *,
          users!projects_creator_id_fkey (
            first_name,
            last_name
          )
        `)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (!error) {
        results.projects = projects || [];
      }
    }

    console.log('✅ Search completed');
    res.json(results);
  } catch (err) {
    console.error('❌ Error searching:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
