
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Ensure the output directory exists
 */
export function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

/**
 * Get absolute path to the output directory
 */
export function getOutputPath(relativePath: string = ''): string {
  const OUTPUT_DIR = 'docs/visual-reference-library';
  const basePath = path.resolve(process.cwd(), OUTPUT_DIR);
  
  if (!relativePath) {
    return basePath;
  }
  
  return path.join(basePath, relativePath);
}

/**
 * Log a message with color
 */
export const logger = {
  info: (message: string) => console.log(chalk.blue(message)),
  success: (message: string) => console.log(chalk.green(`  ✓ ${message}`)),
  error: (message: string, error?: unknown) => {
    console.error(chalk.red(`  ✗ ${message}`));
    if (error) {
      console.error(error);
    }
  },
  header: (message: string) => {
    console.log(chalk.yellow(message));
    console.log(chalk.yellow('='.repeat(message.length)));
  }
};
