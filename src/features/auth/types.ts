import { Country, Currency, Timestamp } from "../dashboard/profile/types";

export interface UserCredentials {
  username: string;
  password: string;
}

export interface IPhoneLoginForm {
  phone: string;
  phoneCountry: string;
  token: string;
}

export interface ISignupUserForm {
  email: string;
  password: string;
}

export interface IUser {
  // Essential auth fields (always required)
  id: string;
  uid: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean | null;
  userType: string;
  
  // Optional fields (can be fetched separately when needed)
  avatarURL?: string | null;
  notifToken?: string;
  fcmTokens?: string[];
  deviceUniqueId?: string | null;
  country?: Country;
  currency?: Currency;
  dateAdded?: Timestamp;
  dateUpdated?: Timestamp;
  gender?: string | null;
  isProduction?: boolean;
  phoneNumber?: string | null;
  status?: string;
  updatedAt?: Timestamp;
}

// Minimal auth user for auth state
export interface IAuthUser {
  id: string;
  uid: string;
  email: string;
  fullName: string;
  avatarURL?: string | null;
  role: string;
  isVerified: boolean | null;
  userType: string;
}