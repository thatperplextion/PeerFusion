// server/src/routes/auth.ts - Authentication routes using Supabase
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabase';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Helper to create JWT
function createToken(userId: number) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
}

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists with this email' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([{
        first_name,
        last_name,
        email,
        password_hash: hashedPassword
      }])
      .select('id, email, first_name, last_name, created_at')
      .single();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return res.status(500).json({ 
        error: 'Failed to create user' 
      });
    }

    const token = createToken(user.id);

    console.log(`✅ User registered successfully: ${email}`);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });

  } catch (error: any) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(`🔄 Login attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user by email
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, password_hash')
      .eq('email', email)
      .single();

    if (queryError || !user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log(`❌ Invalid password for user: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Create token
    const token = createToken(user.id);

    console.log(`✅ User logged in successfully: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });

  } catch (error: any) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, bio, institution, field_of_study, avatar, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;