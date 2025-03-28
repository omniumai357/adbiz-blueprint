
#!/usr/bin/env node

/**
 * This script runs visual regression tests for components
 * and generates a report of the results.
 * 
 * Usage:
 *   node run-visual-tests.js [component]
 * 
 * Example:
 *   node run-visual-tests.js RewardCard
 *   node run-visual-tests.js --all
 *   node run-visual-tests.js --update (to update snapshots)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define test directories
const TEST_DIR = path.resolve(__dirname, '..');
const VISUAL_TEST_DIR = path.join(TEST_DIR, 'visual');
const REPORT_DIR = path.join(TEST_DIR, 'reports');
const SNAPSHOT_DIR = path.join(TEST_DIR, '__image_snapshots__');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Ensure snapshot directory exists
if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

// Get command line args
const args = process.argv.slice(2);
const runAll = args.includes('--all');
const updateSnapshots = args.includes('--update');
const componentName = runAll || updateSnapshots ? null : args[0];

// Validate component name if provided and not running all tests
if (!runAll && !updateSnapshots && !componentName) {
  console.error('Error: Please specify a component name or use --all flag.');
  console.log('Usage: node run-visual-tests.js [component]');
  console.log('Example: node run-visual-tests.js RewardCard');
  console.log('For updating snapshots: node run-visual-tests.js --update');
  process.exit(1);
}

// Find test files based on pattern
function findTestFiles(pattern) {
  const allFiles = fs.readdirSync(VISUAL_TEST_DIR)
    .filter(f => f.endsWith('.visual.test.tsx') || f.endsWith('.visual.test.ts'))
    .map(f => path.join(VISUAL_TEST_DIR, f));
  
  if (pattern) {
    return allFiles.filter(f => f.includes(pattern));
  }
  
  return allFiles;
}

// Run tests and generate report
function runTests() {
  const testFiles = findTestFiles(componentName);
  
  if (testFiles.length === 0) {
    console.log(`No visual test files found for ${componentName || 'any component'}.`);
    return;
  }
  
  console.log(`Found ${testFiles.length} visual test files to run.`);
  console.log(testFiles.map(f => `- ${path.basename(f)}`).join('\n'));
  
  // Run tests
  console.log('\nRunning visual tests...');
  try {
    const updateFlag = updateSnapshots ? ' -- -u' : '';
    
    testFiles.forEach(file => {
      console.log(`\nRunning ${path.basename(file)}...`);
      execSync(`npx jest ${file}${updateFlag} --colors`, { stdio: 'inherit' });
    });
    
    console.log('\nAll visual tests completed successfully!');
    
    // Generate report timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const reportFile = path.join(REPORT_DIR, `visual-test-report-${timestamp}.txt`);
    
    // Save report
    fs.writeFileSync(reportFile, `Visual tests completed at ${new Date().toLocaleString()}\n\n`);
    fs.appendFileSync(reportFile, `Tests run: ${testFiles.length}\n`);
    fs.appendFileSync(reportFile, `Files tested:\n${testFiles.map(f => `- ${path.basename(f)}`).join('\n')}\n`);
    
    console.log(`\nReport saved to: ${reportFile}`);
  } catch (error) {
    console.error('\nSome visual tests failed. Check the output above for details.');
    process.exit(1);
  }
}

// Main execution
console.log('=== Visual Regression Testing Script ===');
if (updateSnapshots) {
  console.log('Running in snapshot update mode - will update all baselines');
} else {
  console.log(`Running tests for ${componentName || 'all components'}...\n`);
}
runTests();
