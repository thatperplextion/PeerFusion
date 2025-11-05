// Check which tables exist in Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkTables() {
  const tables = ['users', 'projects', 'notifications', 'messages', 'posts', 'connections', 'skills'];
  
  console.log('Checking Supabase tables...\n');
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table.padEnd(20)} - NOT FOUND (${error.message})`);
      } else {
        console.log(`✅ ${table.padEnd(20)} - EXISTS`);
      }
    } catch (err) {
      console.log(`❌ ${table.padEnd(20)} - ERROR`);
    }
  }
  
  console.log('\n📋 To create missing tables:');
  console.log('   1. Go to Supabase Dashboard → SQL Editor');
  console.log('   2. Run: server/src/database/supabase_schema.sql');
}

checkTables();
