const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testApiDirect() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('=== TESTING API DIRECTLY ===');
    
    // Test the exact query from track-page API
    console.log('Testing page_usage insert...');
    const result = await pool.query(`
      INSERT INTO page_usage (
        user_id, 
        guest_id,
        page_path, 
        page_title, 
        session_id, 
        referrer, 
        user_agent, 
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      null, // user_id
      'test_guest_123', // guest_id
      '/test', // page_path
      'Test Page', // page_title
      'session_123', // session_id
      'https://example.com', // referrer
      'Mozilla/5.0...', // user_agent
      new Date().toISOString() // created_at
    ]);
    
    console.log('✅ Page usage insert successful!');
    
    // Test the exact query from usage tracking API
    console.log('Testing usage_logs insert...');
    const result2 = await pool.query(`
      INSERT INTO usage_logs (
        user_id,
        action,
        file_count,
        file_size_bytes,
        processing_time_ms,
        guest_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      null, // user_id
      'resize', // action
      1, // file_count
      1024, // file_size_bytes
      1000, // processing_time_ms
      'test_guest_123', // guest_id
      new Date().toISOString() // created_at
    ]);
    
    console.log('✅ Usage logs insert successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
  } finally {
    await pool.end();
  }
}

testApiDirect();
