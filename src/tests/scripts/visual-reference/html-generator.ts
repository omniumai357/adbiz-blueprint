
import fs from 'fs';
import path from 'path';
import { Breakpoint } from '@/hooks/useResponsive';
import { getViewportByBreakpoint } from '../../visual/visualRegressionSetup';
import { COMPONENTS_TO_CAPTURE, BREAKPOINTS_TO_CAPTURE } from './config';
import { getOutputPath, logger } from './utils';

/**
 * Generate HTML index for the visual reference library
 */
export function generateHtmlIndex() {
  logger.info('\nGenerating HTML index...');
  
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
      const componentDir = getOutputPath(component);
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
  
  fs.writeFileSync(getOutputPath('index.html'), html);
  logger.success('HTML index generated');
}
