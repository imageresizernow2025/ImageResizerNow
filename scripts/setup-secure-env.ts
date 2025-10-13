#!/usr/bin/env node

import { randomBytes } from 'crypto';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENV_FILE = '.env.local';
const ENV_EXAMPLE_FILE = 'env.example';

// Generate secure random strings
function generateSecureString(length: number = 64): string {
  return randomBytes(length).toString('hex');
}

// Generate JWT secret (128 characters for maximum security)
function generateJWTSecret(): string {
  return generateSecureString(64);
}

// Generate database password
function generateDBPassword(): string {
  return generateSecureString(32);
}

// Read existing .env.local or create from template
function readOrCreateEnvFile(): string {
  if (existsSync(ENV_FILE)) {
    return readFileSync(ENV_FILE, 'utf8');
  }
  
  if (existsSync(ENV_EXAMPLE_FILE)) {
    return readFileSync(ENV_EXAMPLE_FILE, 'utf8');
  }
  
  throw new Error('No environment template found');
}

// Update environment variables
function updateEnvFile(content: string): string {
  const lines = content.split('\n');
  const updatedLines = lines.map(line => {
    if (line.startsWith('JWT_SECRET=')) {
      return `JWT_SECRET=${generateJWTSecret()}`;
    }
    if (line.startsWith('DATABASE_URL=') && line.includes('password')) {
      const newPassword = generateDBPassword();
      return `DATABASE_URL=postgresql://postgres:${newPassword}@localhost:5432/imageresizernow_db`;
    }
    return line;
  });
  
  return updatedLines.join('\n');
}

// Main function
function main() {
  try {
    console.log('🔐 Setting up secure environment variables...\n');
    
    // Read existing environment file
    const envContent = readOrCreateEnvFile();
    
    // Update with secure values
    const updatedContent = updateEnvFile(envContent);
    
    // Write to .env.local
    writeFileSync(ENV_FILE, updatedContent);
    
    console.log('✅ Environment file created/updated: .env.local');
    console.log('🔑 Generated secure JWT secret (128 characters)');
    console.log('🗄️  Generated secure database password');
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   • Never commit .env.local to version control');
    console.log('   • Keep your JWT secret secure and private');
    console.log('   • Use different secrets for different environments');
    console.log('   • Rotate secrets regularly in production');
    
    // Show the generated JWT secret (first 16 chars for verification)
    const jwtSecret = updatedContent
      .split('\n')
      .find(line => line.startsWith('JWT_SECRET='))
      ?.split('=')[1];
    
    if (jwtSecret) {
      console.log(`\n🔍 JWT Secret (first 16 chars): ${jwtSecret.substring(0, 16)}...`);
    }
    
  } catch (error) {
    console.error('❌ Error setting up environment:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
