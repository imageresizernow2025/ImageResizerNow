import { performance } from 'perf_hooks';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface PerformanceTest {
  name: string;
  test: () => Promise<any>;
  expectedMaxTime?: number;
}

class PerformanceTester {
  private tests: PerformanceTest[] = [];
  private results: Array<{
    name: string;
    duration: number;
    passed: boolean;
    error?: string;
  }> = [];

  addTest(test: PerformanceTest) {
    this.tests.push(test);
  }

  async runAll() {
    console.log('🚀 Starting Performance Tests...\n');
    
    for (const test of this.tests) {
      await this.runTest(test);
    }
    
    this.printResults();
  }

  private async runTest(test: PerformanceTest) {
    const start = performance.now();
    
    try {
      await test.test();
      const duration = performance.now() - start;
      const passed = !test.expectedMaxTime || duration <= test.expectedMaxTime;
      
      this.results.push({
        name: test.name,
        duration,
        passed,
      });
      
      const status = passed ? '✅' : '❌';
      const timeStr = `${duration.toFixed(2)}ms`;
      const expectedStr = test.expectedMaxTime ? ` (expected: ≤${test.expectedMaxTime}ms)` : '';
      
      console.log(`${status} ${test.name}: ${timeStr}${expectedStr}`);
      
    } catch (error) {
      const duration = performance.now() - start;
      this.results.push({
        name: test.name,
        duration,
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      console.log(`❌ ${test.name}: FAILED (${duration.toFixed(2)}ms) - ${error}`);
    }
  }

  private printResults() {
    console.log('\n📊 Performance Test Results:');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const avgTime = this.results.reduce((sum, r) => sum + r.duration, 0) / total;
    
    console.log(`Tests Passed: ${passed}/${total}`);
    console.log(`Average Time: ${avgTime.toFixed(2)}ms`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    const slowTests = this.results.filter(r => r.duration > 1000);
    if (slowTests.length > 0) {
      console.log('\n⚠️  Slow Tests (>1000ms):');
      slowTests.forEach(test => {
        console.log(`  - ${test.name}: ${test.duration.toFixed(2)}ms`);
      });
    }
    
    const failedTests = this.results.filter(r => !r.passed && !r.error);
    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      failedTests.forEach(test => {
        console.log(`  - ${test.name}: ${test.duration.toFixed(2)}ms`);
      });
    }
  }
}

// Database performance tests
async function testDatabaseConnection() {
  const { query } = await import('../src/lib/db');
  await query('SELECT 1');
}

async function testDatabaseQuery() {
  const { query } = await import('../src/lib/db');
  await query('SELECT COUNT(*) FROM users');
}

async function testDatabaseInsert() {
  const { query } = await import('../src/lib/db');
  await query('INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT DO NOTHING', 
    ['test@example.com', 'test_hash']);
}

// Spaces performance tests
async function testSpacesConnection() {
  const { listUserFiles } = await import('../src/lib/spaces');
  await listUserFiles(1, 1);
}

async function testSpacesCache() {
  const { getCacheStats } = await import('../src/lib/spaces');
  getCacheStats();
}

// Image processing tests
async function testImageProcessing() {
  // Simulate image processing with regular canvas
  const { createCanvas } = await import('canvas');
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  ctx.fillRect(0, 0, 100, 100);
  return canvas.toBuffer();
}

// Memory usage test
async function testMemoryUsage() {
  const largeArray = new Array(100000).fill(0).map((_, i) => i);
  largeArray.sort();
  return largeArray.length;
}

// Main function
async function main() {
  const tester = new PerformanceTester();
  
  // Add tests
  tester.addTest({
    name: 'Database Connection',
    test: testDatabaseConnection,
    expectedMaxTime: 100
  });
  
  tester.addTest({
    name: 'Database Query',
    test: testDatabaseQuery,
    expectedMaxTime: 200
  });
  
  tester.addTest({
    name: 'Database Insert',
    test: testDatabaseInsert,
    expectedMaxTime: 300
  });
  
  tester.addTest({
    name: 'Spaces Connection',
    test: testSpacesConnection,
    expectedMaxTime: 1000
  });
  
  tester.addTest({
    name: 'Spaces Cache',
    test: testSpacesCache,
    expectedMaxTime: 10
  });
  
  tester.addTest({
    name: 'Image Processing',
    test: testImageProcessing,
    expectedMaxTime: 500
  });
  
  tester.addTest({
    name: 'Memory Usage',
    test: testMemoryUsage,
    expectedMaxTime: 100
  });
  
  await tester.runAll();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
