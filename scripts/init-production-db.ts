import { initializeDatabase } from '../src/lib/db';

async function main() {
  try {
    console.log('=== INITIALIZING PRODUCTION DATABASE ===');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not set. Please set it to your production database URL.');
      process.exit(1);
    }
    
    console.log('Initializing production database...');
    await initializeDatabase();
    console.log('✅ Production database initialization completed successfully!');
    
    console.log('\n🎉 All tables created successfully!');
    console.log('You can now test your production app at: https://imageresizernow.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Production database initialization failed:', error);
    process.exit(1);
  }
}

main();
