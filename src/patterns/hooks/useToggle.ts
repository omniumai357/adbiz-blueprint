
import { useState, useCallback } from 'react';

/**
 * Creates a simple boolean toggle hook
 * 
 * @param initialState The initial boolean state
 * @returns Tuple with state value and toggle function
 */
export function useToggle(initialState: boolean = false) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(s => !s), []);
  
  return [state, toggle] as const;
}
