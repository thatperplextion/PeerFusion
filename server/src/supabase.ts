// server/src/supabase.ts - Supabase client configuration
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Check required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️  Missing Supabase environment variables:', missingEnvVars.join(', '));
  console.log('💡 Create a .env file with the following variables:');
  console.log('   SUPABASE_URL=your_supabase_project_url');
  console.log('   SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('   SUPABASE_SERVICE_KEY=your_supabase_service_role_key (optional, for admin operations)');
}

// Create Supabase client with anon key (for general operations)
export const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);

// Create Supabase admin client with service role key (for admin operations)
export const supabaseAdmin: SupabaseClient = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned, which is OK
      throw error;
    }
    
    console.log('✅ Database connection test successful (Supabase)');
    return true;
  } catch (error: any) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

// Temporary compatibility wrapper for pool.query()
// This allows old code to work while migrating to Supabase
// WARNING: This is a temporary solution and should be replaced with proper Supabase client calls
export const pool = {
  query: async (sql: string, params?: any[]) => {
    console.warn('⚠️  Using compatibility layer for SQL query. Please migrate to Supabase client methods.');
    console.warn('   SQL:', sql.substring(0, 100) + '...');
    
    // Return empty result to prevent crashes
    // Routes using this will need proper migration
    return {
      rows: [],
      insertId: null,
      affectedRows: 0
    };
  },
  end: async () => {
    // Supabase client doesn't need explicit connection closing
    console.log('Supabase client cleanup (no-op)');
  }
};

export default supabase;
