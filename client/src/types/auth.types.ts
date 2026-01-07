export interface User {
  id: string;
  email: string;
}

export interface RegisterBody {
  email: string;
  password: string;
}

export type LoginBody = RegisterBody;