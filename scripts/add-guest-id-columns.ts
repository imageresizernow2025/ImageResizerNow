import { query } from '../src/lib/db';

async function addGuestIdColumns() {
  try {
    console.log('=== ADDING GUEST_ID COLUMNS ===');
    
    // Add guest_id column to usage_logs table
    console.log('Adding guest_id column to usage_logs table...');
    await query(`
      ALTER TABLE usage_logs 
      ADD COLUMN IF NOT EXISTS guest_id VARCHAR(255)
    `);
    console.log('✅ Added guest_id to usage_logs');
    
    // Add guest_id column to page_usage table
    console.log('Adding guest_id column to page_usage table...');
    await query(`
      ALTER TABLE page_usage 
      ADD COLUMN IF NOT EXISTS guest_id VARCHAR(255)
    `);
    console.log('✅ Added guest_id to page_usage');
    
    // Create indexes for guest_id columns
    console.log('Creating indexes for guest_id columns...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_usage_logs_guest_id ON usage_logs(guest_id)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_page_usage_guest_id ON page_usage(guest_id)
    `);
    console.log('✅ Created indexes for guest_id columns');
    
    console.log('\n🎉 Successfully added guest_id columns to all tables!');
    
  } catch (error) {
    console.error('❌ Failed to add guest_id columns:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  addGuestIdColumns()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { addGuestIdColumns };
