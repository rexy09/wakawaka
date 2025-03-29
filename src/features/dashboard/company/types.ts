



export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface ICompanyStats {
  total_trucks: number;
  total_drivers: number;
  available_drivers: number;
  busy_drivers: number;
  unasigned_trucks: number;
  available_trucks: number;
}

export interface IDriverInformation {
  id: string;
  driver_license: string;
  driver_license_img: string;
  nida_no: string;
  nida_img: string;
  created_at: string;
  updated_at: string;
}

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

/**
 * This interface represents a summarized version of a driver.
 * It is used for nested driver objects (for example, inside a vehicle)
 * where the `current_vehicle` property is a string reference.
 */
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
  current_vehicle: string;
  information: IDriverInformation;
}

/**
 * This interface represents the current vehicle assigned to a driver.
 * Note that its `driver` property uses the summarized version.
 */
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
  capacity: string | null;
  body_type: string;
}

/**
 * This interface represents a driver in the results.
 * Here, the `current_vehicle` property is an object (of type ICurrentVehicle)
 * rather than just a string.
 */
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



export interface IDriverInformation {
  id: string;
  driver_license: string;
  driver_license_img: string;
  nida_no: string;
  nida_img: string;
  created_at: string;
  updated_at: string;
}

// Represents the driver data.
export interface IVehicleDriver {
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
  current_vehicle: string; // This is a reference (ID) to the current vehicle.
  information: IDriverInformation;
}

// Represents the details of a vehicle.
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

// Represents a driver vehicle (vehicle assignment) object.
export interface IDriverVehicle {
  id: string;
  driver: IVehicleDriver;
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


export interface IVehicleForm {
  vehicle: string;
  make: string;
  model: string;
  body_type: string;
  plate_no: string;
  vehicle_img: File | null;
}

export interface IVehicleMake {
  id: string;
  name: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface IVehicleModel {
  id: string;
  name: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  make: string; // ID of the associated vehicle make
}

export interface IVehicleBodyType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IDriverForm {
  full_name: string;
  phone_number: string;
  nida_no: string;
  driver_license: string;
  truck_id: string;
  owner_id: string;
  driver_license_img: File | null;
  nida_img: File | null;
  profile_img: File | null;
  is_active: boolean;
}