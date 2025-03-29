import { useCallback, useEffect, useRef, useState } from "react";

import { notifications } from "@mantine/notifications";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { IRouteData } from "../types";

interface MapProps {
  routeData: IRouteData;
}

export default function ChatMap({ routeData }: MapProps) {
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);

  const center = { lat: -5.5, lng: 33.5 };

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  const origin = {
    lat: parseFloat(routeData.starting_location.latitude),
    lng: parseFloat(routeData.starting_location.longitude),
  };

  const destination = {
    lat: parseFloat(routeData.ending_location.latitude),
    lng: parseFloat(routeData.ending_location.longitude),
  };
  const fetchDirections = useCallback(() => {
    setIsMapLoading(true);
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsMapLoading(false);
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          setDirections(null);
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
  }, [routeData]);
  useEffect(() => {
    fetchDirections();
  }, [routeData]);


  if (isMapLoading) {
    return (
      <div className="text-sm text-gray-500 font-semibold pe-3">
        Loading map...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className=" h-[400px] w-full overflow-hidden rounded-lg">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={7}
          center={center}
          onLoad={onMapLoad}
        >
          {directions? <DirectionsRenderer directions={directions} />:<>
            <Marker
              position={origin} 
              title="Start" 
            />
            <Marker
              position={destination} 
              title="Destination" 
            />
          </>}
        </GoogleMap>
      </div>
    </div>
  );
}
