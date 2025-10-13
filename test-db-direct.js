const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('=== DIRECT DATABASE TEST ===');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }
  
  // Parse the URL
  const url = new URL(process.env.DATABASE_URL);
  console.log('Parsed URL:');
  console.log('- Host:', url.hostname);
  console.log('- Port:', url.port);
  console.log('- Database:', url.pathname.slice(1));
  console.log('- Username:', url.username);
  
  const pool = new Pool({
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false },
    max: 1,
    min: 0,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });
  
  try {
    console.log('Attempting connection...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT current_user, current_database(), version()');
    console.log('✅ Query executed successfully!');
    console.log('User:', result.rows[0].current_user);
    console.log('Database:', result.rows[0].current_database);
    console.log('Version:', result.rows[0].version);
    
    client.release();
    await pool.end();
    console.log('✅ Connection closed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    process.exit(1);
  }
}

testConnection();
