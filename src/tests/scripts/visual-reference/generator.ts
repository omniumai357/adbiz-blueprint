
import * as puppeteer from 'puppeteer';
import { COMPONENTS_TO_CAPTURE, BREAKPOINTS_TO_CAPTURE } from './config';
import { captureComponentScreenshots } from './capture';
import { generateHtmlIndex } from './html-generator';
import { ensureDirectoryExists, getOutputPath, logger } from './utils';

/**
 * Main function to generate the visual reference library
 */
export async function generateVisualReferenceLibrary() {
  logger.header('Generating Visual Reference Library');
  
  // Ensure output directory exists
  ensureDirectoryExists(getOutputPath());
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    // Capture screenshots for each component
    for (const component of COMPONENTS_TO_CAPTURE) {
      await captureComponentScreenshots(browser, component, BREAKPOINTS_TO_CAPTURE);
    }
    
    // Generate HTML index
    generateHtmlIndex();
    
    logger.success('\nVisual Reference Library generated successfully!');
    console.log(`Output directory: ${getOutputPath()}`);
  } finally {
    await browser.close();
  }
}
