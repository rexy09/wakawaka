export interface IPaymentForm {
  amount: number;
  confim: boolean;
}
export interface ICommissionForm {
  phone_number: string;
  phoneCountry: string;
  confim: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface InvoiceSummary {
  total_invoices: number;
  fully_paid_invoices: number;
  partially_paid_invoices: number;
  overdue_invoices: number;
  total_amount: number;
  total_paid_amount: number;
  total_pending_amount: number;
  sana_commission: number;
}


export interface IBilling {
  id: string;
  history: BillingHistory[];
  owner: Owner;
  sender: User;
  order: Order;
  invoice_id: string;
  category: string|"payment";
  amount: number;
  remaining_amount: number;
  status: string | "pending";
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface BillingHistory {
  description: string;
  created_at: string;
}

export interface Order {
  id: string;
  sender_id: User;
  extra_information: OrderExtraInformation;
  driver: Driver & { current_vehicle: DriverVehicle };
  bid_price: number | null;
  total_bids: number;
  category: "local";
  state: "accepted";
  sender_location: string; // JSON string
  receiver_location: string; // JSON string
  distance: string;
  duration: string;
  tracking_id: string;
  price: number;
  delivery_time: string | null;
  created_at: string;
  updated_at: string;
  vehicle: Vehicle;
  is_feedback: boolean;
}

export interface File {
  image: string;
  name: string;
}

export interface OrderExtraInformation {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_notes: string;
  consignor_name: string;
  consignor_phone: string;
  consignor_notes: string;
  files: File[];
  pieces: number;
  hazardous: boolean;
  stackable: boolean;
  fast_load: boolean;
  is_fragile: boolean;
  dock_level: string | null;
  description: string | null;
  loading_file: string | null;
  trading_file: string | null;
  release_file: string | null;
  created_at: string;
  updated_at: string;
  dims: string;
  order: string;
  package_type: string;
  package_size: string;
}

export interface Driver {
  id: string;
  full_name: string;
  phone_number: string;
  profile_img: string;
  email: string | null;
  current_location: string | null;
  is_active: boolean;
  ratings: number;
  created_at: string;
  updated_at: string;
  current_vehicle: string | null; // Reference to DriverVehicle ID
  information: DriverInformation;
}

export interface DriverVehicle {
  id: string;
  driver: Driver;
  vehicle_img: string;
  plate_no: string;
  created_at: string;
  updated_at: string;
  vehicle: Vehicle;
  make: string;
  model: string;
  capacity: string | null;
  body_type: string;
}

export interface DriverInformation {
  id: string;
  driver_license: string;
  driver_license_img: string;
  nida_no: string;
  nida_img: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  weight_capacity: number;
  vehicle_img: string;
  no_of_seats: number;
  vehicle_type: string;
  price_per_km: number;
  minimum_price: number;
  discount_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Owner {
  id: string;
  logo: string;
  company: string;
  role: "owner";
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
  user: User;
  years_of_experience: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  full_name: string;
  profile_img: string;
  role: "owner" | "sender";
}

export interface IBillingConfirmation {
  id: string;
  amount: string;
  description: string;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
  billing: string;
}
