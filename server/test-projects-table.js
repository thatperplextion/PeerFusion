// Quick test to check if projects table exists in Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testProjectsTable() {
  console.log('Testing projects table...');
  
  try {
    // Try to select from projects table
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing projects table:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.log('\n📋 You need to create the projects table in Supabase!');
      console.log('   Go to your Supabase SQL Editor and run:');
      console.log('   server/src/database/supabase_schema.sql');
    } else {
      console.log('✅ Projects table exists!');
      console.log('   Found', data.length, 'projects');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testProjectsTable();
