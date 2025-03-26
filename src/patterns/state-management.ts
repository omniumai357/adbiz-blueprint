
/**
 * State Management Patterns
 * 
 * This file provides reusable patterns for managing state
 * across different features in a consistent way.
 */

import { useState, useCallback, useReducer } from 'react';

/**
 * Creates a reducer-based state management hook with typed actions
 * 
 * @param reducer The reducer function
 * @param initialState The initial state
 * @param actionCreators Object of action creator functions
 * @returns Tuple with state and action dispatchers
 */
export function createStoreHook<State, Actions extends Record<string, (...args: any[]) => any>>(
  reducer: (state: State, action: any) => State,
  initialState: State,
  actionCreators: Actions
) {
  return () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    // Create bound action dispatchers
    const boundActions = Object.entries(actionCreators).reduce(
      (acc, [key, actionCreator]) => {
        acc[key as keyof Actions] = (...args: any[]) => 
          dispatch(actionCreator(...args));
        return acc;
      }, 
      {} as { [K in keyof Actions]: (...args: Parameters<Actions[K]>) => void }
    );
    
    return [state, boundActions] as const;
  };
}

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

/**
 * Creates a hook for managing a collection of items
 * 
 * @param initialItems Initial collection of items
 * @returns Object with items array and functions to add, remove, update items
 */
export function useCollection<T extends { id: string }>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);
  
  const addItem = useCallback((item: T) => {
    setItems(current => [...current, item]);
  }, []);
  
  const removeItem = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);
  
  const updateItem = useCallback((id: string, updates: Partial<Omit<T, 'id'>>) => {
    setItems(current => 
      current.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);
  
  return { 
    items, 
    addItem, 
    removeItem, 
    updateItem,
    hasItem: useCallback((id: string) => items.some(item => item.id === id), [items]),
    clear: useCallback(() => setItems([]), [])
  };
}
