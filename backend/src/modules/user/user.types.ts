export interface UpdateMyProfileInput {
  fullName?: string;
  mobile?: string;
}

export interface AdminUpdateUserInput {
  fullName?: string;
  mobile?: string;
  email?: string;
  role?: "USER" | "ADMIN";
}
