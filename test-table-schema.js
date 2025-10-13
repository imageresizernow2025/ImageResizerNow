const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testTableSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('=== TESTING TABLE SCHEMAS ===');
    
    // Check usage_logs table schema
    console.log('\n--- usage_logs table schema ---');
    const usageLogsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'usage_logs' 
      ORDER BY ordinal_position
    `);
    console.table(usageLogsResult.rows);
    
    // Check page_usage table schema
    console.log('\n--- page_usage table schema ---');
    const pageUsageResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'page_usage' 
      ORDER BY ordinal_position
    `);
    console.table(pageUsageResult.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

testTableSchema();
