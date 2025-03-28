
import * as puppeteer from 'puppeteer';
import path from 'path';
import { Breakpoint } from '@/hooks/useResponsive';
import { getViewportByBreakpoint } from '../../visual/visualRegressionSetup';
import { getComponentPreviewUrl, INTERACTIVE_STATES } from './config';
import { ensureDirectoryExists, getOutputPath, logger } from './utils';

/**
 * Capture screenshots for a component
 */
export async function captureComponentScreenshots(
  browser: puppeteer.Browser, 
  component: string,
  breakpoints: Breakpoint[]
) {
  logger.info(`\nCapturing ${component}...`);
  
  // Create component directory
  const componentDir = getOutputPath(component);
  ensureDirectoryExists(componentDir);
  
  // Capture each breakpoint
  for (const breakpoint of breakpoints) {
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
        
        logger.success(`${breakpoint} - ${state}`);
      } catch (error) {
        logger.error(`Failed to capture ${component} at ${breakpoint} - ${state}`, error);
      } finally {
        await page.close();
      }
    }
  }
}
