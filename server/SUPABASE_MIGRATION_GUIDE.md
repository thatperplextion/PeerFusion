# Supabase Migration Guide

This guide helps you migrate existing code from MySQL/PostgreSQL to Supabase.

## Quick Reference

### Database Operations

#### Before (MySQL/PostgreSQL with pool)
```typescript
import { pool } from './db';

// SELECT
const result = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
const user = result.rows[0];

// INSERT
const result = await pool.query(
  'INSERT INTO users (email, first_name, last_name) VALUES (?, ?, ?)',
  [email, firstName, lastName]
);
const newUserId = result.insertId;

// UPDATE
await pool.query(
  'UPDATE users SET bio = ? WHERE id = ?',
  [bio, userId]
);

// DELETE
await pool.query('DELETE FROM users WHERE id = ?', [userId]);
```

#### After (Supabase)
```typescript
import { supabase } from './supabase';

// SELECT
const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

// INSERT
const { data, error } = await supabase
  .from('users')
  .insert([{ email, first_name: firstName, last_name: lastName }])
  .select()
  .single();
const newUserId = data?.id;

// UPDATE
const { error } = await supabase
  .from('users')
  .update({ bio })
  .eq('id', userId);

// DELETE
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

## Common Query Patterns

### Filtering

```typescript
// WHERE clause
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email);

// Multiple conditions (AND)
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId)
  .eq('post_type', 'article');

// OR conditions
const { data } = await supabase
  .from('posts')
  .select('*')
  .or('post_type.eq.article,post_type.eq.research');

// IN clause
const { data } = await supabase
  .from('users')
  .select('*')
  .in('id', [1, 2, 3, 4]);

// LIKE (pattern matching)
const { data } = await supabase
  .from('users')
  .select('*')
  .ilike('email', '%@example.com');

// Greater than / Less than
const { data } = await supabase
  .from('posts')
  .select('*')
  .gte('created_at', '2024-01-01')
  .lte('created_at', '2024-12-31');
```

### Joins

```typescript
// Inner join
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users (
      id,
      first_name,
      last_name,
      avatar
    )
  `)
  .eq('user_id', userId);

// Multiple joins
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users!posts_user_id_fkey (
      id,
      first_name,
      last_name
    ),
    post_likes (
      id,
      user_id
    ),
    post_comments (
      id,
      content,
      users (
        first_name,
        last_name
      )
    )
  `);
```

### Ordering and Pagination

```typescript
// ORDER BY
const { data } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });

// LIMIT and OFFSET
const { data } = await supabase
  .from('posts')
  .select('*')
  .range(0, 9); // First 10 items (0-9)

// Pagination
const page = 2;
const pageSize = 10;
const { data } = await supabase
  .from('posts')
  .select('*')
  .range((page - 1) * pageSize, page * pageSize - 1);
```

### Aggregations

```typescript
// COUNT
const { count } = await supabase
  .from('users')
  .select('*', { count: 'exact', head: true });

// COUNT with filter
const { count } = await supabase
  .from('posts')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId);
```

### Transactions

Supabase doesn't support traditional transactions in the client library. For complex operations:

1. Use PostgreSQL functions (stored procedures)
2. Use the Supabase REST API with `Prefer: return=representation`
3. Handle rollback logic in your application code

Example using a PostgreSQL function:
```sql
-- In Supabase SQL Editor
CREATE OR REPLACE FUNCTION create_post_with_activity(
  p_user_id BIGINT,
  p_content TEXT,
  p_post_type VARCHAR
)
RETURNS BIGINT AS $$
DECLARE
  v_post_id BIGINT;
BEGIN
  -- Insert post
  INSERT INTO posts (user_id, content, post_type)
  VALUES (p_user_id, p_content, p_post_type)
  RETURNING id INTO v_post_id;
  
  -- Insert activity
  INSERT INTO activities (user_id, activity_type, description, reference_id, reference_type)
  VALUES (p_user_id, 'post', 'Created a new post', v_post_id, 'post');
  
  RETURN v_post_id;
END;
$$ LANGUAGE plpgsql;
```

```typescript
// Call from TypeScript
const { data, error } = await supabase.rpc('create_post_with_activity', {
  p_user_id: userId,
  p_content: content,
  p_post_type: postType
});
```

## File Storage Migration

### Before (Multer + Local/S3)
```typescript
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  // Save file path to database
  await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [file.path, userId]);
});
```

### After (Supabase Storage)
```typescript
import { uploadAvatar } from './utils/storage';

router.post('/upload', async (req, res) => {
  // Assuming you're using a file upload middleware that provides req.file
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;
  
  try {
    const avatarUrl = await uploadAvatar(fileBuffer, fileName, userId);
    
    // Update user record
    const { error } = await supabase
      .from('users')
      .update({ avatar: avatarUrl })
      .eq('id', userId);
    
    if (error) throw error;
    
    res.json({ url: avatarUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Error Handling

### Supabase Error Handling
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

if (error) {
  console.error('Database error:', error);
  
  // Common error codes
  if (error.code === 'PGRST116') {
    // No rows returned
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (error.code === '23505') {
    // Unique constraint violation
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  if (error.code === '23503') {
    // Foreign key violation
    return res.status(400).json({ error: 'Invalid reference' });
  }
  
  return res.status(500).json({ error: 'Database error' });
}

// Use the data
res.json(data);
```

## Real-time Subscriptions

One of Supabase's best features is real-time data:

```typescript
// Subscribe to changes
const subscription = supabase
  .channel('posts')
  .on(
    'postgres_changes',
    {
      event: '*', // 'INSERT', 'UPDATE', 'DELETE', or '*' for all
      schema: 'public',
      table: 'posts'
    },
    (payload) => {
      console.log('Change received!', payload);
      // Handle the change (e.g., update UI)
    }
  )
  .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

## Authentication Integration

Supabase provides built-in authentication:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

## Best Practices

1. **Always check for errors**: Supabase operations return `{ data, error }` - always check `error` first
2. **Use `.single()` for single row queries**: Returns the object directly instead of an array
3. **Use `.select()` after inserts/updates**: To get the inserted/updated data back
4. **Enable RLS**: Always use Row Level Security policies in production
5. **Use the service role key carefully**: Only use it server-side for admin operations
6. **Batch operations**: Use `.insert([...])` with arrays for multiple inserts
7. **Index your queries**: Add database indexes for frequently queried columns
8. **Use TypeScript types**: Generate types from your schema for better type safety

## Generating TypeScript Types

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Generate types
supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

Then use them:
```typescript
import { Database } from './types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type NewUser = Database['public']['Tables']['users']['Insert'];
```

## Migration Checklist

- [ ] Set up Supabase project
- [ ] Run schema migration SQL
- [ ] Create storage buckets
- [ ] Update environment variables
- [ ] Replace `pool.query()` calls with Supabase client methods
- [ ] Update file upload logic to use Supabase Storage
- [ ] Test all database operations
- [ ] Set up RLS policies
- [ ] Configure authentication (if using Supabase Auth)
- [ ] Update error handling
- [ ] Test in production environment

## Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase SQL Reference](https://supabase.com/docs/guides/database/overview)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
