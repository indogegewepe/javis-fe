export interface LoginInput {
	identifier: string;
	password: string;
}

export interface AuthUser {
	id: number;
	email: string | null;
	username: string | null;
  created_at?: Date;
  updated_at?: Date;
}