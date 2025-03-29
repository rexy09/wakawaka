import { Avatar, Group, Table, Text, TextInput } from "@mantine/core";
import { useEffect } from "react";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import VehicleDeleteModal from "../components/VehicleDeleteModal";
import VehicleFormModal from "../components/VehicleFormModal ";
import {
  IDriverVehicle,
  IVehicle,
  IVehicleBodyType,
  IVehicleMake,
  IVehicleModel,
  PaginatedResponse,
} from "../types";
import { Icons } from "../../../../common/icons";
import { Actions, CompanyFilterParameters } from "../stores";
import { useSearchParams } from "react-router-dom";

interface Props {
  trucks?: PaginatedResponse<IDriverVehicle>;
  loadingOrders: boolean;
  fetchVehicles: (page: number) => void;
  vehicles: IVehicle[];
  vehicleMake: IVehicleMake[];
  vehicleModels: IVehicleModel[];
  vehicleBodyTypes: IVehicleBodyType[];
  parameters: CompanyFilterParameters & Actions;
}

export default function TruckTable({
  trucks,
  loadingOrders,
  fetchVehicles,
  vehicles,
  vehicleMake,
  vehicleModels,
  vehicleBodyTypes,
  parameters,
}: Props) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      fetchVehicles(Number(page));
    } else {
      fetchVehicles(1);
    }
  }, []);

  const rows = trucks?.results.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Group justify="space-between">
          <Avatar src={row.vehicle_img} />
        </Group>
      </Table.Td>
      <Table.Td>{row.plate_no}</Table.Td>
      <Table.Td>{row.make}</Table.Td>
      <Table.Td>{row.model}</Table.Td>

      <Table.Td>{row.body_type}</Table.Td>
      <Table.Td>
        <Text fz={"14px"} fw={500} c={row.driver ? "green" : "red"}>
          {row.driver ? "Yes" : "No"}
        </Text>
      </Table.Td>

      <Table.Td>
        <Group>
          <VehicleFormModal
            update={true}
            fetchData={fetchVehicles}
            truck={row}
            vehicles={vehicles}
            vehicleMake={vehicleMake}
            vehicleBodyTypes={vehicleBodyTypes}
            vehicleModels={vehicleModels}
          />

          <VehicleDeleteModal
            vehicleId={row.id}
            fetchData={fetchVehicles}
            truck={row}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <CustomTable
      title="Trucks"
      summary={
        <>
          <TextInput
            leftSection={Icons.search}
            placeholder="Search plate number"
            radius={"md"}
            value={parameters.plate_no}
            onChange={(value) => {
              parameters.updateText("plate_no", value.target.value);
              if (value.target.value.length >= 8) {
                fetchVehicles(1);
              } else if (value.target.value.length == 0) {
                fetchVehicles(1);
              }
            }}
          />
        </>
      }
      rows={rows ?? []}
      colSpan={8}
      isLoading={loadingOrders}
      fetchData={fetchVehicles}
      totalData={trucks != undefined ? trucks.count : 0}
      downloading={false}
      exporData={true}
      showPagination
      columns={
        <Table.Tr style={{ border: "none" }}>
          <Table.Th
            style={{
              borderRadius: "10px 0px 0px 10px",
            }}
          >
            Profile
          </Table.Th>
          <Table.Th>Plate Number</Table.Th>
          <Table.Th>Make</Table.Th>
          <Table.Th>Model</Table.Th>
          <Table.Th>Body Type</Table.Th>
          <Table.Th>Is Taken</Table.Th>
          <Table.Th
            style={{
              borderRadius: "0px 10px 10px 0px",
            }}
          >
            Action
          </Table.Th>
        </Table.Tr>
      }
    />
  );
}
