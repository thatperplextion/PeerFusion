// server/src/db.ts - Supabase database connection
// This file now exports Supabase client instead of MySQL pool
// For backward compatibility, we export the same interface

export { supabase, supabaseAdmin, pool, testDatabaseConnection } from './supabase';