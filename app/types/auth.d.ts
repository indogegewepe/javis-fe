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

export interface BackendLoginResponse = {
  access_token?: string;
  token?: string;
  message?: string;
  attemptsRemaining?: number;
  resetTime?: string | number;
};

export interface BackendMeResponse {
  id?: number,
  username?: string,
  email?: string,
  iat?: number,
  exp?: number
}