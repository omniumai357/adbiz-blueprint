
/**
 * Generate a unique identifier with optional prefix
 * @param prefix Optional string prefix for the ID
 * @returns A unique string ID
 */
export const generateUniqueId = (prefix: string = ''): string => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  
  return prefix 
    ? `${prefix}-${timestamp}-${randomPart}`
    : `${timestamp}-${randomPart}`;
};
