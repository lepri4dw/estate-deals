export interface IUser {
  email: string;
  displayName: string
  password: string;
  token: string;
  phoneNumber: string;
  role: string;
  avatar: string;
  googleId?: string;
}