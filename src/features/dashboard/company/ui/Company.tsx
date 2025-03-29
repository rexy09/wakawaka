import { Group, SimpleGrid, Space, Tabs, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import CompanyStatisticsCard from "../components/CompanyStatisticsCard";
import DriverFormModal from "../components/DriverFormModal";
import { CompanyStatisticsCardSkeleton } from "../components/Loaders";
import VehicleFormModal from "../components/VehicleFormModal ";
import { useCompanyServices } from "../services";
import { useCompanyParameters } from "../stores";
import {
  ICompanyStats,
  IDriver,
  IDriverVehicle,
  IVehicle,
  IVehicleBodyType,
  IVehicleMake,
  IVehicleModel,
  PaginatedResponse,
} from "../types";
import DriverTable from "./DriverTable";
import TruckTable from "./TruckTable";
import { useSearchParams } from "react-router-dom";

export default function Company() {
  const parameters = useCompanyParameters();
  const [activeTab, setActiveTab] = useState<string | null>("first");
  const {
    getInfoStatistics,
    getDrivers,
    getVehicles,
    getDriverVehicles,
    getVehicleTypes,
    getVehicleMake,
    getVehicleModel,
    getVehicleBodyTypes,
  } = useCompanyServices();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [companyStatistics, setcompanyStatistics] = useState<ICompanyStats>();
  const [drivers, setDrivers] = useState<PaginatedResponse<IDriver>>();
  const [trucks, setTrucks] = useState<PaginatedResponse<IDriverVehicle>>();
  const [driverVehicles, setDriverVehicles] =
    useState<PaginatedResponse<IDriverVehicle>>();
  const [vehicles, setVehicles] = useState<PaginatedResponse<IVehicle>>();
  const [vehicleMake, setVehicleMake] =
    useState<PaginatedResponse<IVehicleMake>>();
  const [vehicleModels, setVehicleModels] =
    useState<PaginatedResponse<IVehicleModel>>();
  const [vehicleBodyTypes, setVehicleBodyTypes] =
    useState<PaginatedResponse<IVehicleBodyType>>();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = () => {
    setIsLoading(true);
    getInfoStatistics()
      .then((response) => {
        setIsLoading(false);
        setcompanyStatistics(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    fetchOptionData();
  };

  const fetchDrivers = (page: number) => {
    setLoadingTable(true);
    const params = useCompanyParameters.getState();

    getDrivers(params, page)
      .then((response) => {
        setLoadingTable(false);
        setDrivers(response.data);
      })
      .catch((_error) => {
        setLoadingTable(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  const fetchVehicles = (page: number) => {
    setLoadingTable(true);
    const params = useCompanyParameters.getState();

    getVehicles(params, page)
      .then((response) => {
        setLoadingTable(false);
        setTrucks(response.data);
      })
      .catch((_error) => {
        setLoadingTable(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  const fetchOptionData = () => {
    setIsLoading(true);
    getDriverVehicles()
      .then((response) => {
        setIsLoading(false);
        setDriverVehicles(response.data);
      })
      .catch((_error) => {
        console.log(_error);

        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });

    getVehicleTypes()
      .then((response) => {
        setIsLoading(false);
        setVehicles(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getVehicleMake()
      .then((response) => {
        setIsLoading(false);
        setVehicleMake(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getVehicleModel()
      .then((response) => {
        setIsLoading(false);
        setVehicleModels(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getVehicleBodyTypes()
      .then((response) => {
        setIsLoading(false);
        setVehicleBodyTypes(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  useEffect(() => {
    if (searchParams.get("tab") == "second") {
      setActiveTab("second");
    }
    fetchData();
  }, []);

  const skeletons = Array.from({ length: 4 }, (_, index) => (
    <CompanyStatisticsCardSkeleton key={index} />
  ));

  return (
    <div>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Company
        </Text>

        <Group>
          <DriverFormModal
            fetchData={fetchData}
            fetchDrivers={fetchDrivers}
            switchTab={() => {
              setActiveTab("first");
              searchParams.delete("tab");
              setSearchParams(searchParams);
            }}
            vehicles={driverVehicles?.results ?? []}
          />
          <VehicleFormModal
            fetchData={fetchVehicles}
            switchTab={() => {
              setActiveTab("second");
              searchParams.set("tab", "second");
              setSearchParams(searchParams);
            }}
            vehicles={vehicles?.results ?? []}
            vehicleMake={vehicleMake?.results ?? []}
            vehicleBodyTypes={vehicleBodyTypes?.results ?? []}
            vehicleModels={vehicleModels?.results ?? []}
          />
        </Group>
      </Group>
      <Space h="md" />

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing={{ base: 10 }}>
        {companyStatistics && !isLoading ? (
          <>
            <CompanyStatisticsCard
              title="Total Trucks"
              data={companyStatistics?.total_trucks!}
            />
            <CompanyStatisticsCard
              title="Total Drivers"
              data={companyStatistics?.total_drivers!}
            />
            <CompanyStatisticsCard
              title="Available Trucks"
              data={companyStatistics?.available_trucks!}
            />
            <CompanyStatisticsCard
              title="Available Drivers"
              data={companyStatistics?.available_drivers!}
            />
          </>
        ) : (
          skeletons
        )}
      </SimpleGrid>

      <Space h="md" />
      <Tabs
        keepMounted={false}
        value={activeTab}
        onChange={setActiveTab}
        variant="pills"
      >
        <div
          style={{ backgroundColor: "#EDF0F6", borderRadius: "7px" }}
          className="w-[220px] p-[3px]"
        >
          <Tabs.List>
            <Tabs.Tab
              value="first"
              onClick={() => {
                searchParams.delete("tab");
                setSearchParams(searchParams);
              }}
            >
              My Drivers
            </Tabs.Tab>
            <Tabs.Tab
              value="second"
              onClick={() => {
                searchParams.set("tab", "second");
                setSearchParams(searchParams);
              }}
            >
              My Trucks
            </Tabs.Tab>
          </Tabs.List>
        </div>

        <Space h="md" />
        <Tabs.Panel value="first">
          <DriverTable
            drivers={drivers}
            loadingOrders={loadingTable}
            fetchData={fetchData}
            fetchDrivers={fetchDrivers}
            vehicles={driverVehicles?.results ?? []}
          />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <TruckTable
            parameters={parameters}
            trucks={trucks}
            loadingOrders={loadingTable}
            fetchVehicles={fetchVehicles}
            vehicles={vehicles?.results ?? []}
            vehicleMake={vehicleMake?.results ?? []}
            vehicleBodyTypes={vehicleBodyTypes?.results ?? []}
            vehicleModels={vehicleModels?.results ?? []}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
