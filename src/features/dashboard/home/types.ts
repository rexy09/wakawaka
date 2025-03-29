export interface IOrderStatistic {
  count: number;
  percentage_difference: number;
}

export interface IOrdersStatistics {
  total_orders: IOrderStatistic;
  active_orders: IOrderStatistic;
  delivered_orders: IOrderStatistic;
  pending_orders: IOrderStatistic;
  cancelled_orders: IOrderStatistic;
  average_delivery_time: IOrderStatistic;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IOrder {
  id: string;
  sender_id: IUser;
  extra_information: IExtraInformation;
  driver: IDriver | null;
  bid_price: number | null;
  total_bids: number;
  category: string;
  state: string;
  sender_location: string; // JSON string, to be parsed into Location
  receiver_location: string; // JSON string, to be parsed into Location
  distance: string;
  duration: string;
  tracking_id: string;
  price: number;
  delivery_time: number | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  vehicle: IVehicle;
  is_feedback: boolean;
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
export interface IFile {
  image: string;
  name: string;
}
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
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  dims: string;
  order: string;
  package_type: string;
  package_size: string;
  files: IFile[];
}

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
  current_vehicle: IDriverVehicle | null;
  information: IDriverInformation;
}
export interface IDriverInformation {
  id: string;
  driver_license: string;
  driver_license_img: string;
  nida_no: string;
  nida_img: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
export interface IDriverVehicle {
  id: string;
  driver: IDriver;
  vehicle_img: string;
  plate_no: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  vehicle: IVehicle;
  make: string;
  model: string;
  capacity: string | null;
  body_type: string;
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
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface ILocation {
  latitude: string;
  longitude: string;
  geocode: string;
  latitudeDelta: string;
  longitudeDelta: string;
  senderLocation: string | null;
  receiverLocation: string | null;
}

export class ILocationFromJson {
  latitude: string;
  longitude: string;
  geocode: string;
  latitudeDelta: string;
  longitudeDelta: string;
  senderLocation?: string;
  receiverLocation?: string;

  constructor(data: ILocation) {
    this.latitude = data.latitude.toString();
    this.longitude = data.longitude.toString();
    this.geocode = data.geocode.toString();
    this.latitudeDelta = data.latitudeDelta.toString();
    this.longitudeDelta = data.longitudeDelta.toString();
    this.senderLocation =
      data.senderLocation != null ? data.senderLocation.toString() : "";
    this.receiverLocation =
      data.receiverLocation != null
        ? data.receiverLocation?.toString() ?? ""
        : "";
  }

  static fromJson(json: any): ILocationFromJson {
    return new ILocationFromJson({
      latitude: json["latitude"],
      longitude: json["longitude"],
      geocode: json["geocode"],
      latitudeDelta: json["latitudeDelta"],
      longitudeDelta: json["longitudeDelta"],
      senderLocation: json["senderLocation"],
      receiverLocation: json["receiverLocation"],
    });
  }
}

export function parseLocationFromJson(jsonString: string): ILocationFromJson {
  try {
    const jsonData = JSON.parse(jsonString);
    return ILocationFromJson.fromJson(jsonData);
  } catch (e) {
    return new ILocationFromJson({
      latitude: "0",
      longitude: "0",
      geocode: "0",
      latitudeDelta: "0",
      longitudeDelta: "0",
      senderLocation: "",
      receiverLocation: "",
    });
  }
}

export interface ICancelReason {
  id: string;
  reason: string;
  created_at: string;
  updated_at: string;
}
