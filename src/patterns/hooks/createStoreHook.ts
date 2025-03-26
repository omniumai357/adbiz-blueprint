
import { useReducer } from 'react';

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
