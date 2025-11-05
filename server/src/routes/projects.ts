import { Router } from 'express';
import { supabase } from '../supabase';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Create project
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  const userId = (req as any).user.id;
  
  // Validate required fields
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  // Map frontend status to backend status
  // Frontend: 'seeking', 'active', 'completed'
  // Backend: 'planning', 'active', 'completed', 'on_hold'
  let projectStatus = 'planning'; // default
  if (status === 'seeking' || status === 'Seeking Collaborators') {
    projectStatus = 'planning';
  } else if (status === 'active' || status === 'Active') {
    projectStatus = 'active';
  } else if (status === 'completed' || status === 'Completed') {
    projectStatus = 'completed';
  }
  
  try {
    console.log('Creating project with data:', { creator_id: userId, title, description, status: projectStatus });
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        creator_id: userId,
        title,
        description,
        status: projectStatus
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Project created successfully:', data);
    res.status(201).json(data);
  } catch (err: any) {
    console.error('Error creating project:', err);
    console.error('Error details:', JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Failed to add project', details: err.message, code: err.code });
  }
});

// Get projects for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        users:creator_id (
          first_name,
          last_name
        )
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format response to match expected structure
    const formatted = data.map((p: any) => ({
      ...p,
      first_name: p.users?.first_name,
      last_name: p.users?.last_name,
      user_name: `${p.users?.first_name || ''} ${p.users?.last_name || ''}`.trim()
    }));
    
    res.json(formatted);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// Get all projects (for browsing)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        users:creator_id (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format response
    const formatted = data.map((p: any) => ({
      ...p,
      first_name: p.users?.first_name,
      last_name: p.users?.last_name,
      user_name: `${p.users?.first_name || ''} ${p.users?.last_name || ''}`.trim()
    }));
    
    res.json(formatted);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// Get projects by user ID (for viewing other users' profiles)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        users:creator_id (
          first_name,
          last_name
        )
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format response
    const formatted = data.map((p: any) => ({
      ...p,
      first_name: p.users?.first_name,
      last_name: p.users?.last_name,
      user_name: `${p.users?.first_name || ''} ${p.users?.last_name || ''}`.trim()
    }));
    
    console.log(`✅ Fetched ${formatted.length} projects for user ${userId}`);
    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching user projects:', err);
    res.status(500).json({ error: 'Failed to fetch user projects', details: err.message });
  }
});

// Get single project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const projectId = req.params.id;
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        users:creator_id (
          id,
          first_name,
          last_name
        )
      `)
      .eq('id', projectId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Project not found' });
      }
      throw error;
    }
    
    // Format response
    const formatted = {
      ...data,
      author_id: data.users?.id,
      first_name: data.users?.first_name,
      last_name: data.users?.last_name,
      user_name: `${data.users?.first_name || ''} ${data.users?.last_name || ''}`.trim()
    };
    
    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project', details: err.message });
  }
});

export default router;
