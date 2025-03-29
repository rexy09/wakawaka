

export interface IUserForm {
  full_name: string;
  phone_number: string;
  email: string;
  profile_img: File | null;
}

export interface ICompanyForm {
  company: string;
  company_phone: string;
  office_location: string;
  website: string;
  years_of_experience: string;
  logo: File | null;
  registration_certificate: File | null;
}

export interface IYearOfExperience {
  id: string;
  name: string;
  created_at: string;
}