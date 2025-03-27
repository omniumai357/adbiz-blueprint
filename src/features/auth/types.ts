
export type AuthResult = 
  | { success: true; data?: any; message?: string; }
  | { success: false; error: { message: string; code?: string }; };
