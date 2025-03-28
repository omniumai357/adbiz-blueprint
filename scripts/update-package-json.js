
#!/usr/bin/env node

/**
 * This script adds the visual regression test scripts to package.json
 * Run with: node scripts/update-package-json.js
 */

const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

// Add the scripts if they don't exist
if (!packageJson.scripts['test:visual']) {
  packageJson.scripts['test:visual'] = 'jest --config jest.visual.config.js';
}

if (!packageJson.scripts['test:visual:update']) {
  packageJson.scripts['test:visual:update'] = 'jest --config jest.visual.config.js -u';
}

if (!packageJson.scripts['test:visual:component']) {
  packageJson.scripts['test:visual:component'] = 'node src/tests/scripts/run-visual-tests.js';
}

// Write the updated package.json file
fs.writeFileSync(
  packageJsonPath, 
  JSON.stringify(packageJson, null, 2) + '\n'
);

console.log('Updated package.json with visual testing scripts');
