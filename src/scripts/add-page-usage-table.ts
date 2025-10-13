import { query } from '../lib/db';

async function addPageUsageTable() {
  try {
    console.log('Creating page_usage table...');
    
    // Create page_usage table
    await query(`
      CREATE TABLE IF NOT EXISTS page_usage (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        page_path VARCHAR(255) NOT NULL,
        page_title VARCHAR(255),
        session_id VARCHAR(255),
        referrer VARCHAR(500),
        user_agent TEXT,
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_page_usage_user_id ON page_usage(user_id);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_page_usage_page_path ON page_usage(page_path);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_page_usage_created_at ON page_usage(created_at);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_page_usage_session_id ON page_usage(session_id);
    `);
    
    console.log('Page usage table created successfully!');
    
    // Insert some sample data for testing
    await query(`
      INSERT INTO page_usage (user_id, page_path, page_title, session_id, referrer)
      VALUES 
        (4, '/', 'ImageResizerNow - Free Online Image Resizer', 'session_1', 'https://google.com'),
        (4, '/image-resizer', 'Image Resizer', 'session_1', '/'),
        (4, '/image-compressor', 'Image Compressor', 'session_1', '/image-resizer'),
        (4, '/bulk-resize', 'Bulk Resize', 'session_1', '/image-resizer'),
        (4, '/admin', 'Admin Dashboard', 'session_2', '/'),
        (4, '/admin/users', 'Users Management', 'session_2', '/admin'),
        (4, '/login', 'Login', 'session_3', '/'),
        (4, '/signup', 'Sign Up', 'session_3', '/login')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('Sample page usage data inserted!');
    
  } catch (error) {
    console.error('Error creating page usage table:', error);
    throw error;
  }
}

// Run the script
addPageUsageTable()
  .then(() => {
    console.log('Page usage setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Page usage setup failed:', error);
    process.exit(1);
  });
