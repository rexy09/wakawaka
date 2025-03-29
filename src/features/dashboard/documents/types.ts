

export interface BidFilterParameters {
  startDate: string;
  endDate: string;
}

export interface Actions {
  updateText(type: "startDate" | "endDate", val: string): void;
  reset: () => void;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Interface for each cargo order item
export interface ICargoOrder {
  id: string;
  loading_file: string | null;
  release_file: string | null;
  trading_file: string | null;
  order: IOrder;
  created_at: string;
}

// Interface for the order details
export interface IOrder {
  id: string;
  sender_id: ISender;
  extra_information: IExtraInformation;
  driver: IDriver | null;
  bid_price: number | null;
  category: string;
  state: string;
  sender_location: string;
  receiver_location: string;
  distance: string;
  duration: string;
  tracking_id: string;
  price: number;
  delivery_time: string | null;
  created_at: string;
  updated_at: string;
  vehicle: IVehicle;
  is_feedback: boolean;
}

// Interface for the sender (user) information
export interface ISender {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  full_name: string;
  profile_img: string;
  role: string;
}

// Interface for the extra information of the order
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

// Interface for the driver information (if available)
export interface IDriver {
  id: string;
  full_name: string;
  phone_number: string;
  profile_img: string;
  email: string | null;
  current_location: string | null; // Adjust type if needed (e.g., object with lat/lng)
  is_active: boolean;
  ratings: number;
  created_at: string;
  updated_at: string;
  current_vehicle: IDriverVehicle;
  information: IDriverInformation;
}

// Interface for the driver's current vehicle
export interface IDriverVehicle {
  id: string;
  driver: IDriver; // Note: This creates a circular reference. In practice, you might simplify or omit nested driver info.
  vehicle_img: string;
  plate_no: string;
  created_at: string;
  updated_at: string;
  vehicle: IVehicle;
  make: string;
  model: string;
  capacity: string | null;
  body_type: string;
}

// Interface for additional driver information
export interface IDriverInformation {
  id: string;
  driver_license: string;
  driver_license_img: string;
  nida_no: string;
  nida_img: string;
  created_at: string;
  updated_at: string;
}

// Interface for the vehicle used in the order
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
