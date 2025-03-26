
import { useState, useCallback } from 'react';

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
