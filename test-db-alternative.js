const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('=== ALTERNATIVE DATABASE TEST ===');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }
  
  console.log('Original DATABASE_URL:', process.env.DATABASE_URL);
  
  // Try different connection approaches
  const approaches = [
    {
      name: 'Direct URL',
      config: {
        connectionString: process.env.DATABASE_URL
      }
    },
    {
      name: 'Parsed URL',
      config: (() => {
        const url = new URL(process.env.DATABASE_URL);
        return {
          user: url.username,
          password: url.password,
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          database: url.pathname.slice(1),
          ssl: { rejectUnauthorized: false }
        };
      })()
    },
    {
      name: 'Parsed URL without SSL',
      config: (() => {
        const url = new URL(process.env.DATABASE_URL);
        return {
          user: url.username,
          password: url.password,
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          database: url.pathname.slice(1),
          ssl: false
        };
      })()
    }
  ];
  
  for (const approach of approaches) {
    console.log(`\n--- Testing ${approach.name} ---`);
    
    const pool = new Pool({
      ...approach.config,
      max: 1,
      min: 0,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 3000,
    });
    
    try {
      console.log('Attempting connection...');
      const client = await pool.connect();
      console.log('✅ Connected successfully!');
      
      const result = await client.query('SELECT current_user, current_database()');
      console.log('✅ Query executed successfully!');
      console.log('User:', result.rows[0].current_user);
      console.log('Database:', result.rows[0].current_database);
      
      client.release();
      await pool.end();
      console.log('✅ Connection closed successfully!');
      
      // If we get here, this approach worked!
      console.log(`\n🎉 SUCCESS with ${approach.name}!`);
      process.exit(0);
      
    } catch (error) {
      console.error(`❌ ${approach.name} failed:`, error.message);
      console.error('Error code:', error.code);
      
      try {
        await pool.end();
      } catch (closeError) {
        // Ignore close errors
      }
    }
  }
  
  console.log('\n❌ All approaches failed');
  process.exit(1);
}

testConnection();
