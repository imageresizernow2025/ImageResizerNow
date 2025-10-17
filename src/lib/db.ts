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
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        // Always use SSL for Render PostgreSQL
        ssl: { rejectUnauthorized: false }
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
  // Connection pool settings optimized for Render PostgreSQL free tier
  max: 3, // Very low maximum connections for free tier
  min: 0, // No minimum connections
  idleTimeoutMillis: 10000, // Close idle clients after 10 seconds
  connectionTimeoutMillis: 3000, // Very short timeout for Render
  acquireTimeoutMillis: 3000, // Very short timeout for Render
  maxUses: 100, // Refresh connections frequently
  // Connection options optimized for Render
  keepAlive: false,
  // Additional Render-specific settings
  statement_timeout: 3000,
  query_timeout: 3000,
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

        // Create teams table first (needed for stored_images)
        await client.query(`
          CREATE TABLE IF NOT EXISTS teams (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            plan VARCHAR(50) DEFAULT 'BUSINESS',
            storage_quota_mb INTEGER DEFAULT 10000,
            storage_used_mb INTEGER DEFAULT 0,
            monthly_usage_limit INTEGER DEFAULT 10000,
            monthly_usage_count INTEGER DEFAULT 0,
            last_usage_reset_date DATE DEFAULT CURRENT_DATE,
            settings JSONB DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

    // Create team_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        permissions JSONB DEFAULT '{}',
        invited_by INTEGER REFERENCES users(id),
        invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        joined_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(team_id, user_id)
      )
    `);

    // Create team_invitations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_invitations (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'member',
        token VARCHAR(255) UNIQUE NOT NULL,
        invited_by INTEGER REFERENCES users(id),
        expires_at TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(team_id, email)
      )
    `);

    // Create team_activity_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_activity_logs (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        description TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create page_usage table for analytics
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_usage (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        page_path VARCHAR(500) NOT NULL,
        page_title VARCHAR(500),
        session_id VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        referrer VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
export async function query(text: string, params?: any[], retries: number = 2): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    let client;
    try {
      // Get connection with shorter timeout
      client = await pool.connect();
      
      // Execute query with shorter timeout
      const result = await client.query(text, params);
      
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Database query attempt ${attempt} failed:`, error);
      
      // If it's a connection error and we have retries left, wait and try again
      if (attempt < retries && (
        error instanceof Error && (
          error.message.includes('ECONNRESET') ||
          error.message.includes('Connection terminated') ||
          error.message.includes('connection') ||
          error.code === 'ECONNRESET'
        )
      )) {
        console.log(`Retrying database query in ${attempt * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
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

// Database health check function optimized for Render
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
  try {
    // Use a simple query that Render can handle
    const result = await query('SELECT NOW() as current_time', [], 1); // Only 1 retry for health check
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
