export interface CreateUserInput {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
