import { query } from '../src/lib/db';

async function addStorageColumns() {
  try {
    console.log('Adding storage columns to users table...');
    
    // Add storage_quota_mb column
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS storage_quota_mb INTEGER DEFAULT 500
    `);
    console.log('✓ Added storage_quota_mb column');
    
    // Add storage_used_mb column
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS storage_used_mb INTEGER DEFAULT 0
    `);
    console.log('✓ Added storage_used_mb column');
    
    // Update existing users with default values
    await query(`
      UPDATE users 
      SET storage_quota_mb = 500, storage_used_mb = 0 
      WHERE storage_quota_mb IS NULL OR storage_used_mb IS NULL
    `);
    console.log('✓ Updated existing users with default storage values');
    
    // Verify the columns were added
    const result = await query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('storage_quota_mb', 'storage_used_mb')
      ORDER BY column_name
    `);
    
    console.log('\nStorage columns verification:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
    });
    
    console.log('\n✅ Storage columns added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding storage columns:', error);
    throw error;
  }
}

addStorageColumns()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
