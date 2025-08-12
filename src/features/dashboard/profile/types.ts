export interface Timestamp {
    seconds: number;
    nanoseconds: number;
}

export interface Country {
    name: string;
    code: string;
}

export interface Currency {
    code: string;
    symbol: string;
    name: string;
}

export interface IUserData {
    id: string;
    notifToken: string;
    fcmTokens: string[];
    deviceUniqueId: string | null;
    email: string;
    ageGroup: string | null;
    authType: string;
    avatarURL: string | null;
    bio: string | null;
    birthDate: string | null;
    country: Country;
    currency: Currency;
    dateAdded: Timestamp;
    dateUpdated: Timestamp;
    fullName: string;
    gender: string | null;
    isDeleted: boolean;
    isOnline: boolean;
    isProduction: boolean;
    isVerified: boolean | null;
    lastSeen: Timestamp;
    numberOfPostedJobs: number | null;
    phoneNumber: string | null;
    role: string;
    searchTerms: string[];
    status: string;
    uid: string;
    updatedAt: Timestamp;
    userDevices: string[];
    userType: string;
}

export interface ProfileForm {
  fullName: string;
  gender: string;
  userType: string;
  ageGroup: string;
  phoneCountryCode: string;
  phoneNumber: string;
  country?: Country | null;
  bio: string;
  avatarURL?: File | string | null;
    currency: Currency | null;
}