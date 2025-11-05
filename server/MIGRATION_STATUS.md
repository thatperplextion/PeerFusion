# Supabase Migration Status

## ✅ Completed
- [x] Supabase client configuration (`src/supabase.ts`)
- [x] Database schema for Supabase (`src/database/supabase_schema.sql`)
- [x] File storage utilities (`src/utils/storage.ts`)
- [x] Environment configuration (`.env.example`)
- [x] Authentication routes (`src/routes/auth.ts`)

## 🔄 In Progress / To Do

The following route files still use the old `pool.query()` syntax and need to be migrated to Supabase:

### High Priority (Core Features)
- [ ] `src/routes/user.ts` (23 occurrences) - User profile, skills management
- [ ] `src/routes/connections.ts` (12 occurrences) - Connection requests
- [ ] `src/routes/messages.ts` (10 occurrences) - Messaging system
- [ ] `src/routes/posts.ts` (9 occurrences) - Posts/feed system

### Medium Priority
- [ ] `src/routes/notifications.ts` (7 occurrences) - Notifications
- [ ] `src/routes/projects.ts` (6 occurrences) - Project management
- [ ] `src/routes/search.ts` (2 occurrences) - Search functionality

## Migration Strategy

### Option 1: Gradual Migration (Recommended)
Migrate one route file at a time, testing after each migration:

1. Pick a route file
2. Replace `pool.query()` calls with Supabase client methods
3. Test the endpoints
4. Move to the next file

### Option 2: Use Compatibility Layer (Temporary)
Create a compatibility wrapper that translates `pool.query()` calls to Supabase (not recommended for production).

## Quick Migration Pattern

### Before (MySQL/pool.query)
```typescript
const result = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
const user = result.rows[0];
```

### After (Supabase)
```typescript
const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

if (error) {
  // Handle error
}
```

## Common Patterns

### SELECT with WHERE
```typescript
// Before
const result = await pool.query('SELECT * FROM posts WHERE user_id = ?', [userId]);
const posts = result.rows;

// After
const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId);
```

### INSERT
```typescript
// Before
const result = await pool.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [userId, content]);
const postId = result.insertId;

// After
const { data: post, error } = await supabase
  .from('posts')
  .insert([{ user_id: userId, content }])
  .select()
  .single();
const postId = post?.id;
```

### UPDATE
```typescript
// Before
await pool.query('UPDATE users SET bio = ? WHERE id = ?', [bio, userId]);

// After
const { error } = await supabase
  .from('users')
  .update({ bio })
  .eq('id', userId);
```

### DELETE
```typescript
// Before
await pool.query('DELETE FROM posts WHERE id = ?', [postId]);

// After
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
```

### COUNT
```typescript
// Before
const result = await pool.query('SELECT COUNT(*) as count FROM posts WHERE user_id = ?', [userId]);
const count = result.rows[0].count;

// After
const { count, error } = await supabase
  .from('posts')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId);
```

### JOIN
```typescript
// Before
const result = await pool.query(`
  SELECT p.*, u.first_name, u.last_name 
  FROM posts p 
  JOIN users u ON p.user_id = u.id 
  WHERE p.id = ?
`, [postId]);

// After
const { data, error } = await supabase
  .from('posts')
  .select(`
    *,
    users (
      first_name,
      last_name
    )
  `)
  .eq('id', postId)
  .single();
```

## Testing Checklist

After migrating each route:
- [ ] Test all endpoints in that route
- [ ] Verify error handling works correctly
- [ ] Check that responses match expected format
- [ ] Test edge cases (not found, validation errors, etc.)

## Resources

- [Supabase Migration Guide](./SUPABASE_MIGRATION_GUIDE.md)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
