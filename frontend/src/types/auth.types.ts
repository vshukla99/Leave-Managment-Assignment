export type Role = "USER" | "ADMIN";

export interface AuthUser {
  id: number;                
  fullName: string;    
  email: string;
  role: Role;
  token: string; // JWT
}

/**
 * Backend login response shape
 */
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: Role;
  };
}