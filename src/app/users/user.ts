export interface User {
  id: string;
  firstname: string;
  lastname: string;
  document: string;
  email: string;
  phone: string;
}

export interface UserResolved {
  user: User;
  error?: string;
}

export interface UsersResolved {
  users: User[];
  error?: string;
}
