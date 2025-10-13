import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Checking database tables...');
    
    // Check all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    const tablesResult = await query(tablesQuery);
    console.log('All tables:', tablesResult.rows);
    
    // Check if stored_images table exists and has data
    let storedImagesCount = 0;
    let storedImagesData = [];
    
    try {
      const storedImagesQuery = 'SELECT COUNT(*) as count FROM stored_images';
      const storedImagesResult = await query(storedImagesQuery);
      storedImagesCount = parseInt(storedImagesResult.rows[0].count);
      
      if (storedImagesCount > 0) {
        const sampleImagesQuery = 'SELECT * FROM stored_images LIMIT 5';
        const sampleImagesResult = await query(sampleImagesQuery);
        storedImagesData = sampleImagesResult.rows;
      }
    } catch (error) {
      console.log('stored_images table does not exist or has issues:', error);
    }
    
    // Check if usage_logs table exists and has data
    let usageLogsCount = 0;
    let usageLogsData = [];
    
    try {
      const usageLogsQuery = 'SELECT COUNT(*) as count FROM usage_logs';
      const usageLogsResult = await query(usageLogsQuery);
      usageLogsCount = parseInt(usageLogsResult.rows[0].count);
      
      if (usageLogsCount > 0) {
        const sampleLogsQuery = 'SELECT * FROM usage_logs LIMIT 5';
        const sampleLogsResult = await query(sampleLogsQuery);
        usageLogsData = sampleLogsResult.rows;
      }
    } catch (error) {
      console.log('usage_logs table does not exist or has issues:', error);
    }
    
    return NextResponse.json({
      success: true,
      allTables: tablesResult.rows.map(row => row.table_name),
      storedImages: {
        exists: storedImagesCount >= 0,
        count: storedImagesCount,
        sampleData: storedImagesData
      },
      usageLogs: {
        exists: usageLogsCount >= 0,
        count: usageLogsCount,
        sampleData: usageLogsData
      }
    });
    
  } catch (error) {
    console.error('Error checking tables:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
