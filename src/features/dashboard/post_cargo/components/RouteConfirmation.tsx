import {
  Button,
  Card,
  Group,
  Loader,
  Radio,
  Stack,
  Text,
  Image,
  Space,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePostCargoServices } from "../services";
import { parseLocationFromJson } from "../../home/types";
import { Icons } from "../../../../common/icons";
import { FiClock } from "react-icons/fi";
import { DataItem, VehicleApiResponse } from "../types";
import { Color } from "../../../../common/theme";

interface RouteConfirmationProps {
  origin: string;
  destination: string;
  no_of_packages: number;
  orderType: string;
  orderSize: string;
  isSubmitting?: boolean;
  onConfirm: (
    vehicleType: string,
    distance: string,
    duration: string,
    recommendations: any
  ) => void;
}

export default function RouteConfirmation({
  origin,
  destination,
  no_of_packages,
  orderType,
  orderSize,
  onConfirm,
  isSubmitting = false,
}: RouteConfirmationProps) {
  const { requestRecommendations } = usePostCargoServices();
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState<DataItem[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const mapRef = useRef<google.maps.Map | null>(null);
  const recommendationsRef = useRef(false);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const fetchDirections = useCallback(() => {
    if (!origin || !destination) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
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
  }, [origin, destination]);

  const fetchRecommendations = useCallback(async () => {
    if (!directions || recommendationsRef.current) return;

    const { routes } = directions;
    if (routes.length === 0) return;

    const distance = routes[0].legs[0].distance?.value ?? 0;
    const duration = routes[0].legs[0].duration?.value ?? 0;

    setLoadingRecommendations(true);

    setDistance(distance);
    setDuration(duration);

    recommendationsRef.current = true;

    requestRecommendations({
      current_location: origin,
      distance: distance,
      duration: duration,
      order_type: orderType,
      order_size: orderSize,
      is_fragile: false,
      pieces: no_of_packages,
    })
      .then((response) => {
        setLoadingRecommendations(false);
        const responseData = response.data as VehicleApiResponse;
        setAvailableVehicles(responseData.data);
      })
      .catch((_error) => {
        setLoadingRecommendations(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Failed to fetch recommendations",
        });
      });
  }, [
    directions,
    origin,
    distance,
    duration,
    orderType,
    orderSize,
    no_of_packages,
  ]);

  useEffect(() => {
    if (!directions) {
      fetchDirections();
    }
  }, [fetchDirections, directions]);

  useEffect(() => {
    if (directions) {
      fetchRecommendations();
    }
  }, [directions, fetchRecommendations]);

  const handleVehicleSelect = (value: string) => {
    setSelectedVehicle(value);
  };

  const handleConfirm = () => {
    if (selectedVehicle) {
      onConfirm(
        selectedVehicle,
        distance.toString(),
        duration.toString(),
        availableVehicles
      );
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <Text size="18px" fw={700} c={Color.TextTitle3}>
        Confirm Your Route
      </Text>
      <Space h="md" />
      {/* Map Section */}
      <div className="mb-6 h-[300px] w-full overflow-hidden rounded-lg">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={10}
          onLoad={onMapLoad}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      {/* Route Information */}
      <div className="mb-6 rounded-lg bg-[#e0e0e0] p-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="font-medium">
            {parseLocationFromJson(origin).senderLocation}
          </div>
          {Icons.arrow_right}
          <div className="font-medium">
            {parseLocationFromJson(destination).receiverLocation}
          </div>
        </div>
      </div>

      {/* Vehicle Selection Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Vehicle Type</h3>
        {loadingRecommendations ? (
          <div className="flex justify-center py-8">
            <Loader color="blue" />
          </div>
        ) : availableVehicles.length > 0 ? (
          <Radio.Group value={selectedVehicle} onChange={handleVehicleSelect}>
            <Stack gap="xs">
              {availableVehicles.map((vehicle, index) => (
                <Radio.Card
                  key={index}
                  radius="md"
                  value={vehicle.vehicle.id}
                  p={"md"}
                >
                  <Group wrap="nowrap" align="flex-start">
                    <Radio.Indicator />

                    <div
                      className={`
                      flex items-center px-4`}
                    >
                      <div className="flex flex-1 items-center gap-4">
                        <div className="relative h-16 w-16">
                          <Image
                            src={vehicle.vehicle.vehicle_img}
                            alt="Vehicle Type"
                            fit="fill"
                            className="rounded object-contain"
                          />
                        </div>

                        {/* Vehicle Info */}
                        <div className="flex-1">
                          <h4 className="text-base font-semibold">
                            {vehicle.vehicle.vehicle_type}
                          </h4>
                          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FiClock />
                              <span>{vehicle.time} mins</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>
                                {vehicle.price.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "TZS",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Group>
                </Radio.Card>
              ))}
            </Stack>
          </Radio.Group>
        ) : (
          <p className="py-4 text-center text-muted-foreground">
            No vehicles available at the moment.
          </p>
        )}
      </div>
      <Space h="md" />
      <Button
        onClick={handleConfirm}
        disabled={!selectedVehicle ||  isSubmitting}
        className="w-full"
        loading={ isSubmitting}
      >
        { isSubmitting
          ? "Confirming..."
          : "Confirm Booking"}
      </Button>
    </Card>
  );
}
