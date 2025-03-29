import useApiClient from "../../services/ApiClient";
import { IPostCargoForm } from "./types";

export const usePostCargoServices = () => {
  const { sendRequest } = useApiClient();

  const getPackageTypes = async () => {
    return sendRequest({
      method: "get",
      url: "/extra/package_type/",
    });
  };
  const getPackageSize = async () => {
    return sendRequest({
      method: "get",
      url: "/extra/package_size/",
    });
  };
  const getCargoDimensions = async () => {
    return sendRequest({
      method: "get",
      url: "/extra/cargo_dimension/",
    });
  };
  const requestRecommendations = async ({
    current_location,
    distance,
    duration,
    order_type,
    order_size,
    is_fragile,
    pieces,
  }: {
    current_location: string;
    distance: number;
    duration: number;
    order_type: string;
    order_size: string;
    is_fragile: boolean;
    pieces: number;
  }) => {
    return sendRequest({
      method: "post",
      url: "/order/extra/recommendation",
      data: {
        current_location: current_location,
        distance: distance.toString(),
        duration: duration.toString(),
        order_type: order_type,
        order_size: order_size,
        is_fragile: is_fragile,
        pieces: pieces.toString(),
      },
    });
  };
  const postCargo = async ({
    d,
    files,
  }: {
    d: IPostCargoForm;
    files: File[];
  }) => {
    const formData = new FormData();
    formData.append("category", d.category);
    formData.append("name", `Order-${Date.now()}`);
    formData.append("distance", d.distance.toString());
    formData.append("duration", d.duration.toString());
    formData.append("bidding_duration", "0");
    formData.append("pieces", d.numberOfPackages.toString());
    formData.append("dims", d.packageDimensions);
    formData.append("hazardous", d.isHazardous.toString());
    formData.append("stackable", d.isStackable.toString());
    formData.append("fast_load", d.isFastLoad.toString());
    formData.append("type_id", d.packageType);
    formData.append("size_id", d.packageSize);
    formData.append("notes", d.senderPickupDescription);

    formData.append("sender_location", d.senderPickupLocationData);
    formData.append("receiver_location", d.receiverDeliveryLocationData);

    formData.append("receiver_phone", d.receiverPhoneCountry + d.receiverPhone);
    formData.append("receiver_name", d.receiverName);
    formData.append("receiver_notes", d.receiverDeliveryDescription);

    formData.append("consignor_name", d.senderName);
    formData.append("consignor_phone", d.senderPhoneCountry + d.senderPhone);
    formData.append("consignor_notes", d.senderPickupDescription);

    formData.append("recipient_name", d.receiverName);
    formData.append(
      "recipient_phone",
      d.receiverPhoneCountry + d.receiverPhone
    );

    formData.append("dropoff_date", d.deliveryDate);
    formData.append("pickup_date", d.deliveryDate);

    formData.append("vehicle", d.selectedVehicle);

    files.forEach((file) => {
      formData.append("files", file);
    });

    return sendRequest({
      method: "post",
      url: "/order/",
      data: formData,

      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return {
    getPackageTypes,
    getPackageSize,
    getCargoDimensions,
    requestRecommendations,
    postCargo,
  };
};
