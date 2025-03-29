import { ILocationFromJson } from "../home/types";

export interface ICargoPackageType {
  id: string;
  price_modifier: number;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface ICargoPackageSize {
  id: string;
  price_modifier: number;
  min_weight: number;
  max_weight: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ICargoDimension {
  id: string;
  name: string;
  created_at: string;
}

export interface IPostCargoForm {
  category: string;
  senderName: string;
  senderPhoneCountry: string;
  senderPhone: string;
  senderPickupLocation: string;
  senderPickupLocationData: string;
  senderPickupDescription: string;

  receiverName: string;
  receiverPhoneCountry: string;
  receiverPhone: string;
  deliveryDate: string;
  deliveryDateValue: Date | null;
  receiverDeliveryLocation: string;
  receiverDeliveryLocationData: string;
  receiverDeliveryDescription: string;

  numberOfPackages: number;
  packageSize: string;
  packageDimensions: string;
  packageType: string;
  isHazardous: boolean;
  isStackable: boolean;
  isFastLoad: boolean;

  selectedVehicle: string;
  distance: number;
  duration: number;
}

export interface Position {
  latitude: number;
  longitude: number;
  heading?: number;
  altitude?: number;
}

export function formatPositionToJson(
  position: Position,
  startingName?: string,
  endingName?: string
): string {
  const positionMap: ILocationFromJson = {
    latitude: position.latitude.toString(),
    longitude: position.longitude.toString(),
    geocode: position.heading !== undefined ? position.heading.toString() : "",
    latitudeDelta:
      position.altitude !== undefined ? position.altitude.toString() : "",
    longitudeDelta:
      position.altitude !== undefined ? position.altitude.toString() : "",
    senderLocation: startingName || "",
    receiverLocation: endingName || "",
  };

  return JSON.stringify(positionMap);
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

export interface DataItem {
  vehicle: Vehicle;
  drivers: any[]; 
  time: string | null;
  price: number;
}

export interface VehicleApiResponse {
  data: DataItem[];
  status: string;
}
