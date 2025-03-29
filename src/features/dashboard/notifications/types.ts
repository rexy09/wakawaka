

export interface IUser {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  full_name: string;
  profile_img: string;
  role: string;
}

export interface INotification {
  id: number;
  user: IUser;
  title: string;
  message: string;
  error: null | string;
  is_success: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}