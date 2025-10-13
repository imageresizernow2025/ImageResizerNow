import { Pool } from 'pg';

// Parse DATABASE_URL for connection
const getDbConfig = () => {
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  if (process.env.DATABASE_URL) {
    try {
      // Parse the DATABASE_URL
      const url = new URL(process.env.DATABASE_URL);
      console.log('Parsed DATABASE_URL successfully');
      return {
        user: url.username,
        password: url.password,
        host: url.hostname,
        port: parseInt(url.port),
        database: url.pathname.slice(1),
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
    } catch (error) {
      console.error('Error parsing DATABASE_URL:', error);
      console.log('Falling back to individual environment variables');
    }
  }
  
  // Fallback to individual environment variables
  console.log('Using individual environment variables');
  return {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'imageresizernow_db',
    password: process.env.DB_PASSWORD || 'DAUDselemani01#',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
};

const dbConfig = getDbConfig();
console.log('Database config:', {
  user: dbConfig.user,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  ssl: dbConfig.ssl
});

const pool = new Pool({
  ...dbConfig,
  // Connection pool settings for better reliability
  max: 10, // Maximum number of clients in the pool
  min: 2,  // Minimum number of clients in the pool
  idleTimeoutMillis: 60000, // Close idle clients after 60 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  acquireTimeoutMillis: 10000, // Return an error after 10 seconds if a connection could not be acquired
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
  // Additional connection options
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Add error handling for pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

export default pool;

// Database initialization function
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        plan VARCHAR(50) DEFAULT 'FREE',
        subscription_id VARCHAR(255),
        subscription_status VARCHAR(50) DEFAULT 'active',
        subscription_start_date TIMESTAMP,
        subscription_end_date TIMESTAMP,
        daily_usage_count INTEGER DEFAULT 0,
        last_usage_reset_date DATE DEFAULT CURRENT_DATE,
        storage_used_mb INTEGER DEFAULT 0,
        storage_quota_mb INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create usage_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        file_count INTEGER DEFAULT 1,
        file_size_bytes BIGINT,
        processing_time_ms INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create image_sessions table for temporary storage
    await client.query(`
      CREATE TABLE IF NOT EXISTS image_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        original_filename VARCHAR(255),
        file_size_bytes BIGINT,
        processing_options JSONB,
        status VARCHAR(50) DEFAULT 'processing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
      )
    `);

        // Create stored_images table for cloud storage
        await client.query(`
          CREATE TABLE IF NOT EXISTS stored_images (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
            spaces_key VARCHAR(500) NOT NULL,
            spaces_url VARCHAR(500) NOT NULL,
            cdn_url VARCHAR(500) NOT NULL,
            original_filename VARCHAR(255) NOT NULL,
            file_size_mb DECIMAL(10,2) NOT NULL,
            content_type VARCHAR(100) NOT NULL,
            width INTEGER,
            height INTEGER,
            is_shared BOOLEAN DEFAULT false,
            shared_with_team BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);





    // Create subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_name VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        stripe_subscription_id VARCHAR(255),
        stripe_customer_id VARCHAR(255),
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create indexes for better performance
        await client.query(`
          CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
          CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
          CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
          CREATE INDEX IF NOT EXISTS idx_image_sessions_user_id ON image_sessions(user_id);
          CREATE INDEX IF NOT EXISTS idx_image_sessions_expires_at ON image_sessions(expires_at);
          CREATE INDEX IF NOT EXISTS idx_stored_images_user_id ON stored_images(user_id);
          CREATE INDEX IF NOT EXISTS idx_stored_images_team_id ON stored_images(team_id);
          CREATE INDEX IF NOT EXISTS idx_stored_images_created_at ON stored_images(created_at);
          CREATE INDEX IF NOT EXISTS idx_stored_images_shared ON stored_images(is_shared);
          CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
          CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
          CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
          CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
          CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
          CREATE INDEX IF NOT EXISTS idx_team_invitations_team_id ON team_invitations(team_id);
          CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
          CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
          CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON team_invitations(status);
          CREATE INDEX IF NOT EXISTS idx_team_activity_logs_team_id ON team_activity_logs(team_id);
          CREATE INDEX IF NOT EXISTS idx_team_activity_logs_user_id ON team_activity_logs(user_id);
          CREATE INDEX IF NOT EXISTS idx_team_activity_logs_created_at ON team_activity_logs(created_at);
        `);

    client.release();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Helper function to execute queries with retry logic
export async function query(text: string, params?: any[], retries: number = 3): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    let client;
    try {
      // Get connection with timeout
      client = await Promise.race([
        pool.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        )
      ]) as any;
      
      // Execute query with timeout
      const result = await Promise.race([
        client.query(text, params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 15000)
        )
      ]);
      
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Database query attempt ${attempt} failed:`, error);
      
      // If it's a connection error and we have retries left, wait and try again
      if (attempt < retries && (
        error instanceof Error && (
          error.message.includes('timeout') ||
          error.message.includes('Connection terminated') ||
          error.message.includes('connection') ||
          error.message.includes('ECONNRESET')
        )
      )) {
        console.log(`Retrying database query in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      // If it's not a connection error or we're out of retries, throw immediately
      throw error;
    } finally {
      if (client) {
        try {
          client.release();
        } catch (releaseError) {
          console.error('Error releasing database connection:', releaseError);
        }
      }
    }
  }
  
  throw lastError || new Error('Database query failed after all retries');
}

// Database health check function
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
  try {
    const result = await query('SELECT 1 as health_check');
    return { healthy: true };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { 
      healthy: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// Graceful shutdown function
export async function closeDatabasePool(): Promise<void> {
  try {
    await pool.end();
    console.log('Database pool closed gracefully');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
}
