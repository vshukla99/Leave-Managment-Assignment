export interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  role: "USER" | "ADMIN";
  createdAt?: string;
}
