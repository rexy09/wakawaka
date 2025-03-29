import { Avatar, Group, Table, Text } from "@mantine/core";
import { useEffect } from "react";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import DriverDeleteModal from "../components/DriverDeleteModal";
import DriverFormModal from "../components/DriverFormModal";
import { IDriver, IDriverVehicle, PaginatedResponse } from "../types";
import { useSearchParams } from "react-router-dom";

interface Props {
  drivers?: PaginatedResponse<IDriver>;
  loadingOrders: boolean;
  fetchDrivers: (offset: number) => void;
  fetchData: () => void;
  vehicles: IDriverVehicle[];

}

function DriverTable({ drivers, loadingOrders, fetchDrivers, fetchData, vehicles }: Props) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      fetchDrivers(Number(page));
    } else {
      fetchDrivers(1);
    }
  }, []);

  const rows = drivers?.results.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Group justify="space-between">
          <Avatar src={row.profile_img} />
        </Group>
      </Table.Td>
      <Table.Td>
        <Text tt="capitalize" fz={"14px"} fw={500}>
          {row.full_name}
        </Text>
      </Table.Td>
      <Table.Td>{row.phone_number}</Table.Td>

      <Table.Td>
        <Text fz={"14px"} fw={500} c={!row.is_active ? "green" : "red"}>
          {!row.is_active ? "Yes" : "No"}
        </Text>
      </Table.Td>
      <Table.Td>
        {row.current_vehicle ? row.current_vehicle.plate_no : "N/A"}
      </Table.Td>
      <Table.Td>{row.information.driver_license}</Table.Td>

      <Table.Td>
        <Group>

          <DriverFormModal update={true} fetchDrivers={fetchDrivers} fetchData={fetchData} driver={row} vehicles={vehicles} />
          <DriverDeleteModal driverId={row.id} fetchData={fetchDrivers} driver={row} />
        </Group>

      </Table.Td>
    </Table.Tr>
  ));
  return (
    <CustomTable
      title="Drivers"
      rows={rows ?? []}
      colSpan={8}
      isLoading={loadingOrders}
      fetchData={fetchDrivers}
      totalData={drivers != undefined ? drivers.count : 0}
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
          <Table.Th>Driver Name</Table.Th>
          <Table.Th>Phone Number</Table.Th>
          <Table.Th>Is Available</Table.Th>
          <Table.Th>Assigned Vehicle</Table.Th>
          <Table.Th>License Number</Table.Th>
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

export default DriverTable;
