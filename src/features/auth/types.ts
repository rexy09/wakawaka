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
  full_name: string;
  username: string;
  password: string;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  full_name: string;
  profile_img: string | null;
  role: string;
}

export interface IUserResponse {
  user_type: string | "owner" | "sender" ;
  role: string | "owner" | "dalali" | "clearing_agent" | "user";
  user?: IUser;
  owner?: IOwner;
}

// Interface for the owner object
export interface IOwner {
  id: string;
  logo: string;
  company: string;
  office_location: string;
  website: string;
  company_email: string | null;
  company_phone: string;
  areas_of_operation: string | null;
  tin_number: string | null;
  registration_certificate: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user: IUser;
  years_of_experience: string;
}


export interface ITransporterForm {
  full_name: string;
  phone_number: string;
  role: string;
  identification: string;

  company: string;
  company_phone: string;
  years_of_experience: string;
  logo: File | null;
  registration_certificate: File | null;
}
export interface ISenderForm {
  full_name: string;
  phone_number: string;
  role: string;
  identification: string;

  profile_img: File | null;
}