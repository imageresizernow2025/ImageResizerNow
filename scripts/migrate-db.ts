import { query } from '../src/lib/db';

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    
    // Add team_id column to stored_images table
    await query(`
      ALTER TABLE stored_images 
      ADD COLUMN IF NOT EXISTS team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE
    `);
    
    // Add sharing columns to stored_images table
    await query(`
      ALTER TABLE stored_images 
      ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false
    `);
    
    await query(`
      ALTER TABLE stored_images 
      ADD COLUMN IF NOT EXISTS shared_with_team BOOLEAN DEFAULT false
    `);
    
    // Create teams table if it doesn't exist
    await query(`
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
    
    // Create team_members table if it doesn't exist
    await query(`
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
    
    // Create team_invitations table if it doesn't exist
    await query(`
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
    
    // Create team_activity_logs table if it doesn't exist
    await query(`
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
    
    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_stored_images_team_id ON stored_images(team_id);
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
    
    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
