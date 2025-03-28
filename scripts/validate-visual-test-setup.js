
#!/usr/bin/env node

/**
 * Script to validate that the visual testing setup is correctly configured
 * and to initialize any missing components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk') || { green: (t) => t, red: (t) => t, yellow: (t) => t, blue: (t) => t };

// Check for required files
const requiredFiles = [
  'jest.visual.config.js',
  'src/tests/visual/setup.ts',
  'src/tests/visual/visualRegressionSetup.ts',
  'src/tests/visual/components/ResponsiveVisualTest.tsx',
  '.github/workflows/visual-regression.yml',
  'src/tests/scripts/run-visual-tests.js'
];

console.log(chalk.blue('=================================='));
console.log(chalk.blue('Validating visual testing setup...'));
console.log(chalk.blue('=================================='));

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.resolve(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`❌ Missing required file: ${file}`));
    allFilesExist = false;
  } else {
    console.log(chalk.green(`✅ Found required file: ${file}`));
  }
}

if (!allFilesExist) {
  console.error(chalk.red('Setup is incomplete. Some required files are missing.'));
  process.exit(1);
}

// Check if jest-image-snapshot is installed
try {
  require('jest-image-snapshot');
  console.log(chalk.green('✅ jest-image-snapshot package is installed'));
} catch (error) {
  console.error(chalk.red('❌ jest-image-snapshot package is not installed'));
  console.log(chalk.yellow('Installing jest-image-snapshot...'));
  try {
    execSync('npm install --save-dev jest-image-snapshot @types/jest-image-snapshot', { stdio: 'inherit' });
    console.log(chalk.green('✅ Installed jest-image-snapshot'));
  } catch (installError) {
    console.error(chalk.red('❌ Failed to install jest-image-snapshot'));
    process.exit(1);
  }
}

// Check for npm scripts
const packageJson = require(path.resolve(__dirname, '../package.json'));
const hasVisualTestScript = packageJson.scripts && 'test:visual' in packageJson.scripts;
const hasVisualUpdateScript = packageJson.scripts && 'test:visual:update' in packageJson.scripts;
const hasVisualComponentScript = packageJson.scripts && 'test:visual:component' in packageJson.scripts;

if (!hasVisualTestScript || !hasVisualUpdateScript || !hasVisualComponentScript) {
  console.log(chalk.yellow('Adding npm scripts to package.json...'));
  try {
    execSync('node scripts/update-package-json.js', { stdio: 'inherit' });
    console.log(chalk.green('✅ Added npm scripts to package.json'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to add npm scripts to package.json'));
    console.log(chalk.yellow('Please add the following scripts to your package.json manually:'));
    console.log(chalk.yellow(`  "test:visual": "jest --config jest.visual.config.js",`));
    console.log(chalk.yellow(`  "test:visual:update": "jest --config jest.visual.config.js -u",`));
    console.log(chalk.yellow(`  "test:visual:component": "node src/tests/scripts/run-visual-tests.js"`));
    process.exit(1);
  }
} else {
  console.log(chalk.green('✅ npm scripts are already configured'));
}

// Make the scripts executable
console.log(chalk.yellow('Making scripts executable...'));
try {
  if (process.platform !== 'win32') {
    execSync('chmod +x scripts/*.js', { stdio: 'inherit' });
    execSync('chmod +x src/tests/scripts/*.js', { stdio: 'inherit' });
    console.log(chalk.green('✅ Made scripts executable'));
  } else {
    console.log(chalk.green('✅ Running on Windows - no need to set executable permissions'));
  }
} catch (error) {
  console.warn(chalk.yellow('⚠️ Failed to make scripts executable, you may need to do this manually'));
}

// Check for visual test examples
const visualTestDir = path.resolve(__dirname, '../src/tests/visual');
if (!fs.existsSync(visualTestDir)) {
  console.log(chalk.yellow('⚠️ No visual tests directory found. Creating it...'));
  try {
    fs.mkdirSync(visualTestDir, { recursive: true });
    console.log(chalk.green('✅ Created visual tests directory'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create visual tests directory'));
  }
} else {
  const testFiles = fs.readdirSync(visualTestDir)
    .filter(f => f.endsWith('.visual.test.tsx') || f.endsWith('.visual.test.ts'));
  
  if (testFiles.length === 0) {
    console.log(chalk.yellow('⚠️ No visual test files found. Create some test files to start testing components.'));
  } else {
    console.log(chalk.green(`✅ Found ${testFiles.length} visual test files`));
  }
}

// Verify snapshot directory
const snapshotDir = path.resolve(__dirname, '../src/tests/__image_snapshots__');
if (!fs.existsSync(snapshotDir)) {
  console.log(chalk.yellow('⚠️ No snapshot directory found. It will be created when you run tests for the first time.'));
  try {
    fs.mkdirSync(snapshotDir, { recursive: true });
    console.log(chalk.green('✅ Created snapshot directory'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create snapshot directory'));
  }
}

console.log(chalk.blue('\n============================================'));
console.log(chalk.green('✅ Visual testing setup validation complete!'));
console.log(chalk.blue('============================================'));
console.log(chalk.blue('\nYou can now run:'));
console.log(chalk.yellow('  npm run test:visual         # Run all visual tests'));
console.log(chalk.yellow('  npm run test:visual:update  # Update baseline images'));
console.log(chalk.yellow('  npm run test:visual:component ComponentName  # Test specific component'));

// Check if chalk was manually implemented (not installed)
if (!require.resolve('chalk')) {
  console.log(chalk.yellow('\nTip: Install chalk for better console output:'));
  console.log(chalk.yellow('  npm install --save-dev chalk'));
}
