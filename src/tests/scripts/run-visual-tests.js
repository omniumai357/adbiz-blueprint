
#!/usr/bin/env node

/**
 * Script to run visual tests for specific components
 * Usage: npm run test:visual:component ComponentName
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get component name from arguments
const componentName = process.argv[2];

if (!componentName) {
  console.error('Please specify a component name');
  console.log('Usage: npm run test:visual:component ComponentName');
  process.exit(1);
}

console.log(`Running visual tests for component: ${componentName}`);

// Search for test files matching the component name
const testDir = path.resolve(__dirname, '../visual');
const files = fs.readdirSync(testDir)
  .filter(file => 
    file.includes(componentName.toLowerCase()) && 
    file.endsWith('.visual.test.tsx')
  );

if (files.length === 0) {
  console.error(`No visual test files found for component: ${componentName}`);
  console.log('Checking for partial matches...');
  
  const allFiles = fs.readdirSync(testDir)
    .filter(file => file.endsWith('.visual.test.tsx'));
  
  const possibleMatches = allFiles.filter(file => 
    file.toLowerCase().includes(componentName.toLowerCase())
  );
  
  if (possibleMatches.length > 0) {
    console.log('Found possible matches:');
    possibleMatches.forEach(file => console.log(`- ${file.replace('.visual.test.tsx', '')}`));
  } else {
    console.log('No matching test files found.');
  }
  
  process.exit(1);
}

// Run the tests using Jest
try {
  files.forEach(file => {
    const testPath = path.join(testDir, file);
    console.log(`Running test: ${file}`);
    execSync(`npx jest --config jest.visual.config.js ${testPath}`, { stdio: 'inherit' });
  });
  console.log('Visual tests completed successfully');
} catch (error) {
  console.error('Error running visual tests', error.message);
  process.exit(1);
}
