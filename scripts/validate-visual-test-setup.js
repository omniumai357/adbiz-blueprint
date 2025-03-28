
#!/usr/bin/env node

/**
 * Script to validate that the visual testing setup is correctly configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check for required files
const requiredFiles = [
  'jest.visual.config.js',
  'src/tests/visual/setup.ts',
  'src/tests/visual/visualRegressionSetup.ts',
  '.github/workflows/visual-regression.yml'
];

console.log('Validating visual testing setup...');

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.resolve(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing required file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found required file: ${file}`);
  }
}

if (!allFilesExist) {
  console.error('Setup is incomplete. Please check the missing files.');
  process.exit(1);
}

// Check if jest-image-snapshot is installed
try {
  require('jest-image-snapshot');
  console.log('✅ jest-image-snapshot package is installed');
} catch (error) {
  console.error('❌ jest-image-snapshot package is not installed');
  console.log('Installing jest-image-snapshot...');
  try {
    execSync('npm install --save-dev jest-image-snapshot @types/jest-image-snapshot', { stdio: 'inherit' });
    console.log('✅ Installed jest-image-snapshot');
  } catch (installError) {
    console.error('❌ Failed to install jest-image-snapshot');
    process.exit(1);
  }
}

// Check for npm scripts
const packageJson = require(path.resolve(__dirname, '../package.json'));
const hasVisualTestScript = 'test:visual' in packageJson.scripts;
const hasVisualUpdateScript = 'test:visual:update' in packageJson.scripts;

if (!hasVisualTestScript || !hasVisualUpdateScript) {
  console.log('Adding npm scripts to package.json...');
  try {
    execSync('node scripts/update-package-json.js', { stdio: 'inherit' });
    console.log('✅ Added npm scripts to package.json');
  } catch (error) {
    console.error('❌ Failed to add npm scripts to package.json');
    process.exit(1);
  }
} else {
  console.log('✅ npm scripts are already configured');
}

console.log('\n✅ Visual testing setup is valid and ready to use!');
console.log('\nYou can now run:');
console.log('  npm run test:visual         # Run all visual tests');
console.log('  npm run test:visual:update  # Update baseline images');
console.log('  npm run test:visual:component ComponentName  # Test specific component');
