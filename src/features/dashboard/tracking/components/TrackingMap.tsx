import { useCallback, useEffect, useRef, useState } from "react";

import { Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import {
  convertMetersToKilometers,
  convertSecondsToReadableTime,
  formatDateTime,
} from "../../../hooks/utils";
import { MapSkeleton } from "./Loaders";
import { IOrder } from "../../home/types";



interface Props {
  shipment: IOrder;
}

export default function TrackingMap({ shipment }: Props) {
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [zoom] = useState(2);
  const [isMapLoading, setIsMapLoading] = useState(false);

  const center = { lat: -5.5, lng: 33.5 };

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  const fetchDirections = useCallback(() => {
    setIsMapLoading(true);
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: shipment.sender_location,
        destination: shipment.receiver_location,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsMapLoading(false);
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          notifications.show({
            color: "red",
            title: "Error",
            message:
              "Unable to retrieve map directions for the selected route. Please try selecting a different route.",
          });

          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [shipment]);
  useEffect(() => {
    fetchDirections();
  }, [shipment]);

  if (isMapLoading) {
    return <MapSkeleton/>;
  }

  return (
    <div className="space-y-4">
      <Group justify="space-between">
        <Text c="#23293D" size="18px" fw={500}>
          Map
        </Text>
        <Text c="#7D7D91" size="14px" fw={500}>
          {formatDateTime(shipment.extra_information?.updated_at ?? "")}
        </Text>
      </Group>
      <div className=" h-[400px] w-full overflow-hidden rounded-lg">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={zoom}
          center={center}
          onLoad={onMapLoad}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      <div className="overflow-hidden rounded-lg bg-white  ">
        <table className="w-full border-collapse">
          <thead>
            <tr className=" ">
              <th className="border-r border-[#EBECEF] px-4 py-2 text-left text-[12px] font-medium text-[#7D7D91] bg-white">
                Category
              </th>
              <th className="border-r border-[#EBECEF] px-4 py-2 text-left text-[12px] font-medium text-[#7D7D91] bg-white">
                Distance
              </th>
              <th className="border-r border-[#EBECEF] px-4 py-2 text-left text-[12px] font-medium text-[#7D7D91] bg-white">
                Estimation
              </th>
              <th className="border-r border-[#EBECEF] px-4 py-2 text-left text-[12px] font-medium text-[#7D7D91] bg-white">
                Weight
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#7D7D91] bg-white">
                Fee
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="">
              <td className="border-r border-[#EBECEF] px-4 py-2 text-md font-[500] text-gray-900 dark:text-[#23293D]">
                {shipment?.category}
              </td>
              <td className="border-r border-[#EBECEF] px-4 py-2 text-md font-[500] text-gray-900 dark:text-[#23293D]">
                {convertMetersToKilometers(parseInt(shipment?.distance ?? "0"))}
              </td>
              <td className="border-r border-[#EBECEF] px-4 py-2 text-md font-[500] text-gray-900 dark:text-[#23293D]">
                {convertSecondsToReadableTime(shipment?.duration ?? "")}
              </td>
              <td className="border-r border-[#EBECEF] px-4 py-2 text-md font-[500] text-gray-900 dark:text-[#23293D]">
                {shipment?.extra_information?.package_size}
              </td>
              <td className="px-4 py-2 text-md font-[500] text-gray-900 dark:text-[#23293D]">
                {shipment?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "Tsh",
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
