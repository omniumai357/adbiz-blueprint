
/**
 * Visual Reference Library Generator
 * 
 * This script automates the process of capturing screenshots of all components
 * at different breakpoints to create a comprehensive visual reference library.
 */

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import chalk from 'chalk';
import { BREAKPOINTS, Breakpoint } from '../../hooks/useResponsive';
import { getViewportByBreakpoint } from '../visual/visualRegressionSetup';

// Components to capture
const COMPONENTS_TO_CAPTURE = [
  'MilestoneCard',
  'MilestoneProgressCard',
  'RewardCard',
  'MilestonesDashboard',
  // Add more components as needed
];

// States to capture for interactive components
const INTERACTIVE_STATES = ['default', 'hover', 'active', 'disabled'];

// Breakpoints to capture
const BREAKPOINTS_TO_CAPTURE: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

// Output directory for the visual reference library
const OUTPUT_DIR = path.resolve(__dirname, '../../docs/visual-reference-library');

/**
 * Ensure the output directory exists
 */
function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

/**
 * Generate a component preview URL
 */
function getComponentPreviewUrl(component: string, breakpoint: Breakpoint, state: string = 'default') {
  // This URL should point to your component preview page
  // Adjust as needed based on your development environment
  return `http://localhost:5173/component-preview?component=${component}&breakpoint=${breakpoint}&state=${state}`;
}

/**
 * Capture screenshots for a component
 */
async function captureComponentScreenshots(browser: puppeteer.Browser, component: string) {
  console.log(chalk.blue(`\nCapturing ${component}...`));
  
  // Create component directory
  const componentDir = path.join(OUTPUT_DIR, component);
  ensureDirectoryExists(componentDir);
  
  // Capture each breakpoint
  for (const breakpoint of BREAKPOINTS_TO_CAPTURE) {
    const viewport = getViewportByBreakpoint(breakpoint);
    
    // For interactive components, capture all states
    const states = component.includes('Button') || component.includes('Card') 
      ? INTERACTIVE_STATES 
      : ['default'];
    
    for (const state of states) {
      const page = await browser.newPage();
      await page.setViewport({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      const url = getComponentPreviewUrl(component, breakpoint, state);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for component to be rendered
        await page.waitForSelector(`[data-testid="${component}-preview"]`, { timeout: 5000 });
        
        // Take screenshot
        const screenshotPath = path.join(componentDir, `${component}-${breakpoint}-${state}.png`);
        await page.screenshot({ path: screenshotPath });
        
        console.log(chalk.green(`  ✓ ${breakpoint} - ${state}`));
      } catch (error) {
        console.error(chalk.red(`  ✗ Failed to capture ${component} at ${breakpoint} - ${state}`));
        console.error(error);
      } finally {
        await page.close();
      }
    }
  }
}

/**
 * Generate HTML index for the visual reference library
 */
function generateHtmlIndex() {
  console.log(chalk.blue('\nGenerating HTML index...'));
  
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Reference Library</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; }
    h1, h2, h3 { margin-top: 2em; }
    .component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .component-card { border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
    .component-card img { max-width: 100%; display: block; }
    .component-card .info { padding: 10px; background: #f8f9fa; }
    .breakpoint-tabs { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 15px; }
    .breakpoint-tab { padding: 8px 16px; cursor: pointer; }
    .breakpoint-tab.active { border-bottom: 2px solid #0066cc; }
    .breakpoint-content { display: none; }
    .breakpoint-content.active { display: block; }
  </style>
</head>
<body>
  <h1>Visual Reference Library</h1>
  <p>This library provides reference screenshots for all components at different breakpoints.</p>
  
  <div class="breakpoint-tabs">
    ${BREAKPOINTS_TO_CAPTURE.map(bp => `<div class="breakpoint-tab" data-breakpoint="${bp}">${bp}</div>`).join('')}
  </div>
`;

  // Generate content for each component
  for (const component of COMPONENTS_TO_CAPTURE) {
    html += `
  <h2>${component}</h2>
`;
    
    // Generate tabs content for each breakpoint
    for (const breakpoint of BREAKPOINTS_TO_CAPTURE) {
      html += `
  <div class="breakpoint-content" data-breakpoint="${breakpoint}">
    <h3>${breakpoint} (${getViewportByBreakpoint(breakpoint).width}px)</h3>
    <div class="component-grid">
`;
      
      // Check which states exist for this component at this breakpoint
      const componentDir = path.join(OUTPUT_DIR, component);
      if (fs.existsSync(componentDir)) {
        const files = fs.readdirSync(componentDir);
        const stateFiles = files.filter(file => 
          file.startsWith(`${component}-${breakpoint}`) && file.endsWith('.png')
        );
        
        for (const file of stateFiles) {
          const state = file.replace(`${component}-${breakpoint}-`, '').replace('.png', '');
          html += `
      <div class="component-card">
        <img src="./${component}/${file}" alt="${component} ${breakpoint} ${state}" />
        <div class="info">${state}</div>
      </div>
`;
        }
      }
      
      html += `
    </div>
  </div>
`;
    }
  }
  
  html += `
  <script>
    // Simple tabs functionality
    const tabs = document.querySelectorAll('.breakpoint-tab');
    const contents = document.querySelectorAll('.breakpoint-content');
    
    // Set default active tab
    document.querySelector('.breakpoint-tab[data-breakpoint="md"]').classList.add('active');
    document.querySelector('.breakpoint-content[data-breakpoint="md"]').classList.add('active');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const breakpoint = tab.getAttribute('data-breakpoint');
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        contents.forEach(content => {
          if (content.getAttribute('data-breakpoint') === breakpoint) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log(chalk.green('  ✓ HTML index generated'));
}

/**
 * Main function to generate the visual reference library
 */
async function generateVisualReferenceLibrary() {
  console.log(chalk.yellow('Generating Visual Reference Library'));
  console.log(chalk.yellow('====================================='));
  
  // Ensure output directory exists
  ensureDirectoryExists(OUTPUT_DIR);
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    // Capture screenshots for each component
    for (const component of COMPONENTS_TO_CAPTURE) {
      await captureComponentScreenshots(browser, component);
    }
    
    // Generate HTML index
    generateHtmlIndex();
    
    console.log(chalk.green('\nVisual Reference Library generated successfully!'));
    console.log(chalk.white(`Output directory: ${OUTPUT_DIR}`));
  } finally {
    await browser.close();
  }
}

// Run the generator
generateVisualReferenceLibrary()
  .catch(error => {
    console.error(chalk.red('Failed to generate Visual Reference Library'));
    console.error(error);
    process.exit(1);
  });
