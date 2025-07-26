export interface Profile {
  id?: string
  name: string
  email: string 
}

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};