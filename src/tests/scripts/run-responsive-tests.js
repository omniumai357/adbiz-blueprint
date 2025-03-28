
#!/usr/bin/env node

/**
 * This script runs responsive tests for all components
 * and generates a visual report of the results.
 * 
 * Usage:
 *   node run-responsive-tests.js [component]
 * 
 * Example:
 *   node run-responsive-tests.js MilestoneCard
 *   node run-responsive-tests.js --all
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define test directories
const TEST_DIR = path.resolve(__dirname, '..');
const RESPONSIVE_TEST_DIR = path.join(TEST_DIR, 'responsive');
const VISUAL_TEST_DIR = path.join(TEST_DIR, 'visual');
const REPORT_DIR = path.join(TEST_DIR, 'reports');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Get component name from command line args
const args = process.argv.slice(2);
const runAll = args.includes('--all');
const componentName = runAll ? null : args[0];

// Validate component name if provided
if (!runAll && !componentName) {
  console.error('Error: Please specify a component name or use --all flag.');
  console.log('Usage: node run-responsive-tests.js [component]');
  console.log('Example: node run-responsive-tests.js MilestoneCard');
  process.exit(1);
}

// Find test files based on pattern
function findTestFiles(pattern) {
  const allFiles = [
    ...fs.readdirSync(RESPONSIVE_TEST_DIR).map(f => path.join(RESPONSIVE_TEST_DIR, f)),
    ...fs.readdirSync(VISUAL_TEST_DIR).map(f => path.join(VISUAL_TEST_DIR, f)),
    ...fs.readdirSync(path.join(TEST_DIR, 'rewards')).map(f => path.join(TEST_DIR, 'rewards', f))
  ].filter(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
  
  if (pattern) {
    return allFiles.filter(f => f.includes(pattern));
  }
  
  return allFiles;
}

// Run tests and generate report
function runTests() {
  const testFiles = findTestFiles(componentName);
  
  if (testFiles.length === 0) {
    console.log(`No test files found for ${componentName || 'any component'}.`);
    return;
  }
  
  console.log(`Found ${testFiles.length} test files to run.`);
  console.log(testFiles.map(f => `- ${path.basename(f)}`).join('\n'));
  
  // Run tests
  console.log('\nRunning tests...');
  try {
    testFiles.forEach(file => {
      console.log(`\nRunning ${path.basename(file)}...`);
      execSync(`npx jest ${file} --colors`, { stdio: 'inherit' });
    });
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('\nSome tests failed. Check the output above for details.');
    process.exit(1);
  }
}

// Main execution
console.log('=== Responsive Testing Script ===');
console.log(`Running tests for ${componentName || 'all components'}...\n`);
runTests();
