export interface TrackingFilterParameters {
  startDate: string;
  endDate: string;
  state: string;
  search: string;
}

export interface Actions {
  updateText(type: "startDate" | "endDate" | "search", val: string): void;
  reset: () => void;
}

// Interfaces for the sender (user)
export interface IUser {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  full_name: string;
  profile_img: string;
  role: string;
}

// Interface for the extra information
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
  dock_level: any; // could be string | number | null, etc.
  description: any;
  loading_file: any;
  trading_file: any;
  release_file: any;
  created_at: string;
  updated_at: string;
  dims: string;
  order: string;
  package_type: string;
  package_size: string;
}

// Interface for vehicle
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

// Interface for driver information
export interface IDriverInformation {
  id: string;
  driver_license: string;
  driver_license_img: string;
  nida_no: string;
  nida_img: string;
  created_at: string;
  updated_at: string;
}

// In the nested current_vehicle, the driver object is slightly different:
// Its "current_vehicle" property is a reference (string) rather than the object.
export interface ICurrentVehicleDriver {
  id: string;
  full_name: string;
  phone_number: string;
  profile_img: string;
  email: string | null;
  current_location: any; // adjust as needed
  is_active: boolean;
  ratings: number;
  created_at: string;
  updated_at: string;
  current_vehicle: string; // note: this is a string id here
  information: IDriverInformation;
}

// Interface for the current vehicle of a driver
export interface ICurrentVehicle {
  id: string;
  driver: ICurrentVehicleDriver;
  vehicle_img: string;
  plate_no: string;
  created_at: string;
  updated_at: string;
  vehicle: IVehicle;
  make: string;
  model: string;
  capacity: any; // could be number | null, adjust as needed
  body_type: string;
}

// Main driver interface
export interface IDriver {
  id: string;
  full_name: string;
  phone_number: string;
  profile_img: string;
  email: string | null;
  current_location: any; // adjust type if known
  is_active: boolean;
  ratings: number;
  created_at: string;
  updated_at: string;
  current_vehicle: ICurrentVehicle;
  information: IDriverInformation;
}

// Interface for order
export interface IOrder {
  id: string;
  sender_id: IUser;
  extra_information: IExtraInformation;
  driver: IDriver;
  bid_price: number;
  category: string;
  state: string;
  sender_location: string; // JSON string – parse it if needed
  receiver_location: string; // JSON string – parse it if needed
  distance: string; // consider converting to number if applicable
  duration: string; // consider converting to number if applicable
  tracking_id: string;
  price: number;
  delivery_time: any; // if delivery_time may be null, you can use string | null
  created_at: string;
  updated_at: string;
  vehicle: IVehicle;
  is_feedback: boolean;
}

// Interface for each tracking history item
export interface ITracking {
  id: string;
  state: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Finally, the response interface which contains order, tracking, and status
export interface ITrackingResponse {
  order: any;
  tracking: ITracking[];
  status: string;
}
