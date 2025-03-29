import useApiClient from "../../services/ApiClient";
import { CompanyFilterParameters } from "./stores";
import { IDriverForm, IVehicleForm } from "./types";

export const useCompanyServices = () => {
  const { sendRequest } = useApiClient();

  const getInfoStatistics = async () => {
    return sendRequest({
      method: "get",
      url: "/stats/info",
      params: {},
    });
  };

  const getDrivers = async (_p: CompanyFilterParameters, page: number) => {
    const url = "/owner/driver";
    return sendRequest({
      method: "get",
      url: url,
      params: {
        limit: 10,
        page: page,
      },
    });
  };
  const getVehicles = async (p: CompanyFilterParameters, page: number) => {
    const url = "/owner/vehicle";
    return sendRequest({
      method: "get",
      url: url,
      params: {
        limit: 10,
        page: page,
        plate_no: p.plate_no,
        search: "",
      },
    });
  };
  const postVehicle = async (d: IVehicleForm) => {
    const url = "/owner/vehicle/";

    const formData = new FormData();
    formData.append("vehicle", d.vehicle);
    formData.append("make", d.make);
    formData.append("model", d.model);
    formData.append("body_type", d.body_type);
    formData.append("plate_no", d.plate_no);
    formData.append("vehicle_img", d.vehicle_img ?? "");

    return sendRequest({
      method: "post",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  const updateVehicle = async (d: IVehicleForm, vehicleId: string) => {
    const url = "/owner/vehicle/" + vehicleId;

    const formData = new FormData();
    formData.append("vehicle", d.vehicle);
    formData.append("make", d.make);
    formData.append("model", d.model);
    formData.append("body_type", d.body_type);
    formData.append("plate_no", d.plate_no);
    if (d.vehicle_img) {
      formData.append("vehicle_img", d.vehicle_img ?? "");
    }

    return sendRequest({
      method: "patch",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const deleteVehicle = async (vehicleId: string) => {
    const url = "/owner/vehicle/" + vehicleId;

    return sendRequest({
      method: "delete",
      url: url,
    });
  };

  const getVehicleMake = async () => {
    const url = "/extra/vehicle_make/";
    return sendRequest({
      method: "get",
      url: url,
    });
  };
  const getVehicleModel = async () => {
    const url = "/extra/vehicle_model/";
    return sendRequest({
      method: "get",
      url: url,
    });
  };
  const getVehicleBodyTypes = async () => {
    const url = "/extra/vehicle_body_type/";
    return sendRequest({
      method: "get",
      url: url,
    });
  };
  const getVehicleTypes = async () => {
    const url = "/extra/vehicle";
    return sendRequest({
      method: "get",
      url: url,
    });
  };
  const getDriverVehicles = async () => {
    const url = "/owner/vehicle/";
    return sendRequest({
      method: "get",
      url: url,
      params: {
        unassigned: true,
      },
    });
  };
  const postDriver = async (d: IDriverForm) => {
    const url = "/owner/driver";

    const formData = new FormData();
    formData.append("full_name", d.full_name);
    formData.append("phone_number", d.phone_number);
    formData.append("nida_no", d.nida_no);
    formData.append("driver_license", d.driver_license);
    // formData.append("truck_id", d.truck_id);
    formData.append("owner_id", d.owner_id);

    formData.append("driver_license_img", d.driver_license_img ?? "");
    formData.append("nida_img", d.nida_img ?? "");
    formData.append("profile_img", d.profile_img ?? "");

    return sendRequest({
      method: "post",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  const updateDriver = async (d: IDriverForm, driverId: string) => {
    const url = "/owner/driver/" + driverId;

    const formData = new FormData();
    formData.append("full_name", d.full_name);
    formData.append("phone_number", d.phone_number);
    formData.append("nida_no", d.nida_no);
    formData.append("driver_license", d.driver_license);
    formData.append("current_vehicle", d.truck_id);
    formData.append("is_active", d.is_active.toString());
    formData.append("owner_id", d.owner_id);
    if (d.driver_license_img) {
      formData.append("driver_license_img", d.driver_license_img ?? "");
    }
    if (d.nida_img) {
      formData.append("nida_img", d.nida_img ?? "");
    }
    if (d.profile_img) {
      formData.append("profile_img", d.profile_img ?? "");
    }

    return sendRequest({
      method: "patch",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  const deleteDriver = async (driverId: string) => {
    const url = "/owner/driver/" + driverId;

    return sendRequest({
      method: "delete",
      url: url,
    });
  };
  return {
    getInfoStatistics,
    getDrivers,
    getVehicles,
    postVehicle,
    getVehicleMake,
    getVehicleModel,
    getVehicleBodyTypes,
    getVehicleTypes,
    deleteVehicle,
    postDriver,
    updateVehicle,
    updateDriver,
    getDriverVehicles,
    deleteDriver,
  };
};
