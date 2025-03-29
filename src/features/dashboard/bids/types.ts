export interface IBidStatsResponse {
  total_bids: IBidStats;
  pending_bids: IBidStats;
  accepted_bids: IBidStats;
  rejected_bids: IBidStats;
  cancelled_bids: IBidStats;
}

export interface IBidStats {
  count: number;
  percentage_difference: number;
}

export interface BidFilterParameters {
  startDate: string;
  endDate: string;
  search: string;
  state: string;
}

export interface Actions {
  updateText(
    type: "startDate" | "endDate" | "search" | "state",
    val: string
  ): void;
  reset: () => void;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Represents each item in the results array
export interface IBidResult {
  id: string;
  owner: IOwner;
  order: IOrderDetail;
  price: number;
  state: string;
  created_at: string;
  user_state: string;
  is_bid_won: boolean;
}

// Owner and its nested user
export interface IOwner {
  id: string;
  logo: string;
  company: string;
  office_location: string;
  website: string;
  company_email: string | null;
  company_phone: string;
  areas_of_operation: string | null; // adjust type if necessary
  tin_number: string | null;
  registration_certificate: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user: IUser;
  years_of_experience: string;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  full_name: string;
  profile_img: string;
  role: string;
}

// Order details with nested objects
export interface IOrderDetail {
  id: string;
  sender_id: IUser;
  extra_information: IExtraInformation;
  driver: IDriver;
  bid_price: number;
  category: string;
  state: string;
  sender_location: string; // contains a JSON string
  receiver_location: string; // contains a JSON string
  distance: string;
  duration: string;
  tracking_id: string;
  price: number;
  delivery_time: number;
  created_at: string;
  updated_at: string;
  vehicle: IVehicle;
  is_feedback: boolean;
}

// Extra information about the order
export interface IExtraInformation {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_notes: string;
  consignor_name: string;
  consignor_phone: string;
  consignor_notes: string;
  pieces: number;
  hazardous: boolean;
  stackable: boolean;
  fast_load: boolean;
  is_fragile: boolean;
  dock_level: number | null;
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

// Driver information
export interface IDriver {
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
  current_vehicle: ICurrentVehicle;
  information: IDriverInformation;
}

// For driver objects nested inside current_vehicle,
// we can use a summary interface to avoid circular references.
export interface IDriverSummary {
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
  current_vehicle: string; // usually the ID of the vehicle
  information: IDriverInformation;
}

// Driver information details
export interface IDriverInformation {
  id: string;
  driver_license: string;
  driver_license_img: string;
  nida_no: string;
  nida_img: string;
  created_at: string;
  updated_at: string;
}

// The current vehicle assigned to a driver
export interface ICurrentVehicle {
  id: string;
  driver: IDriverSummary;
  vehicle_img: string;
  plate_no: string;
  created_at: string;
  updated_at: string;
  vehicle: IVehicle;
  make: string;
  model: string;
  capacity: number | null;
  body_type: string;
}

// Vehicle information used in both the order and current_vehicle
export interface IVehicle {
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




// The vehicle information attached to a driver
export interface IDriverVehicle {
  id: string;
  // Notice that the nested "driver" here is slightly different – its current_vehicle is a string (an id) rather than a full object.
  driver: IDriverInVehicle;
  vehicle_img: string;
  plate_no: string;
  created_at: string;
  updated_at: string;
  vehicle: IVehicle;
  make: string;
  model: string;
  capacity: number | null;
  body_type: string;
}

// A simplified version of Driver used inside IDriverVehicle
export interface IDriverInVehicle {
  id: string;
  full_name: string;
  phone_number: string;
  profile_img: string;
  email: string | null;
  current_location: any;
  is_active: boolean;
  ratings: number;
  created_at: string;
  updated_at: string;
  // Here, current_vehicle is just a string (an id reference) rather than a full object.
  current_vehicle: string;
  information: IDriverInformation;
}

// Extra information about a driver
export interface IDriverInformation {
  id: string;
  driver_license: string;
  driver_license_img: string;
  nida_no: string;
  nida_img: string;
  created_at: string;
  updated_at: string;
}

// The vehicle details inside a driver’s vehicle record
export interface IVehicle {
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