
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single className string
 * using clsx and tailwind-merge for proper handling of Tailwind classes
 * 
 * This utility helps resolve conflicts between Tailwind classes and
 * ensures proper precedence when combining conditional classes.
 * 
 * @param {...ClassValue[]} inputs - Class values to combine
 * @returns {string} Merged className string
 * 
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500')
 * 
 * @example
 * // With conditionals
 * cn('text-lg', isActive && 'font-bold', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
