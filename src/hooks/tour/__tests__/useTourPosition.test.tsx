
import { renderHook } from '@testing-library/react';
import { useTourPosition } from '../useTourPosition';

describe('useTourPosition', () => {
  it('should return default position when targetRect is null', () => {
    const { result } = renderHook(() => useTourPosition(null, 'bottom'));
    
    expect(result.current.position).toBe('bottom');
    expect(result.current.arrowPosition).toEqual({});
  });

  it('should calculate position based on target rectangle', () => {
    // Mock DOMRect
    const targetRect = {
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      top: 100,
      left: 100,
      right: 300,
      bottom: 150,
      toJSON: () => {}
    } as DOMRect;
    
    const { result } = renderHook(() => useTourPosition(targetRect, 'bottom'));
    
    expect(result.current.position).toBe('bottom');
    expect(result.current.arrowPosition).toBeDefined();
  });
});
