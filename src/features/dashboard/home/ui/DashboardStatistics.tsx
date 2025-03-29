import {
  Button,
  Center,
  Group,
  Menu,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUtilities } from "../../../hooks/utils";
import { OrderStatisticCardSkeleton } from "../components/Loaders";
import OrderStatisticCard from "../components/OrderStatisticsCard";
import { useDashboardServices } from "../services";
import { useDashboardParameters } from "../stores";
import { IOrder, IOrdersStatistics, PaginatedResponse } from "../types";
import OngoingDeliver from "./OngoingDeliver";
import RecentActivity from "./RecentActivity";
import { IUserResponse } from "../../../auth/types";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
export function DashboardStatistics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const authUser = useAuthUser<IUserResponse>();


  const parameters = useDashboardParameters();
  const { getFormattedDate } = useUtilities();
  const { getOrdersStatistics, getOrders, getOngoingOrders } =
    useDashboardServices();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [ordersStatistics, setOrdersStatistics] = useState<IOrdersStatistics>();
  const [orders, setOrders] = useState<PaginatedResponse<IOrder>>();
  const [ongoingOrders, setOngoingOrders] =
    useState<PaginatedResponse<IOrder>>();
  const getFirstDayOfCurrentMonth = (): Date => {
    const today = new Date();
    const value = new Date(today.getFullYear(), today.getMonth(), 1);

    return value;
  };

  const getLastDayOfCurrentMonth = (): Date => {
    const today = new Date();
    const value = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return value;
  };

  const [startDate, setStartDate] = useState<Date | null>(() =>
    getFirstDayOfCurrentMonth()
  );
  const [endDate, setEndDate] = useState<Date | null>(() =>
    getLastDayOfCurrentMonth()
  );

  const fetchData = () => {
    setIsLoading(true);
    const params = useDashboardParameters.getState();
    getOrdersStatistics(params)
      .then((response) => {
        setIsLoading(false);
        setOrdersStatistics(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });

    getOngoingOrders(params)
      .then((response) => {
        setIsLoading(false);
        setOngoingOrders(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });

    const page = searchParams.get("page") || "1";
    fetchOrders(Number(page));
  };
  const fetchOrders = (page: number) => {
    setLoadingOrders(true);
    const params = useDashboardParameters.getState();

    getOrders(params, page)
      .then((response) => {
        setLoadingOrders(false);
        setOrders(response.data);
      })
      .catch((_error) => {
        setLoadingOrders(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };
  useEffect(() => {
    const searchStartDate = searchParams.get("startDate");
    const searchEndDate = searchParams.get("endDate");
    searchParams.set(
      "startDate",
      searchStartDate ?? getFormattedDate(startDate)
    );
    searchParams.set("endDate", searchEndDate ?? getFormattedDate(endDate));
    setStartDate(searchStartDate ? new Date(searchStartDate) : startDate);
    setEndDate(searchEndDate ? new Date(searchEndDate) : endDate);
    parameters.updateText(
      "startDate",
      searchStartDate ?? getFormattedDate(startDate)
    );
    parameters.updateText(
      "endDate",
      searchEndDate ?? getFormattedDate(endDate)
    );

    fetchData();
  }, []);

  const skeletons = Array.from({ length: 4 }, (_, index) => (
    <OrderStatisticCardSkeleton key={index} />
  ));

  return (
    <div>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Overview
        </Text>
        <Group>

          <Button.Group>
            {/* Date PopOver */}
            <Menu
              shadow="md"
              width={300}
              position="bottom-end"
              opened={openStartDate}
              onChange={setOpenStartDate}
            >
              <Menu.Target>
                <Button
                  leftSection={<FaRegCalendarAlt color="#3A4656" />}
                  variant="default"
                  radius="md"
                >
                  {startDate == null
                    ? "Start Date"
                    : moment(startDate).format("MMM Do YYYY")}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Center>
                  <DatePicker
                    // allowDeselect
                    value={startDate}
                    onChange={(value) => {
                      parameters.updateText(
                        "startDate",
                        getFormattedDate(value) == ""
                          ? ""
                          : getFormattedDate(value)
                      );
                      setStartDate(value);
                      searchParams.set("startDate", getFormattedDate(value));
                      setSearchParams(searchParams);
                      fetchData();
                    }}
                  />
                </Center>
              </Menu.Dropdown>
            </Menu>
            <Menu
              shadow="md"
              width={300}
              position="bottom-end"
              opened={openEndDate}
              onChange={setOpenEndDate}
            >
              <Menu.Target>
                <Button
                  leftSection={<FaRegCalendarAlt color="#3A4656" />}
                  variant="default"
                  radius="md"
                >
                  {endDate == null
                    ? "End Date"
                    : moment(endDate).format("MMM Do YYYY")}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Center>
                  <DatePicker
                    // allowDeselect
                    value={endDate}
                    onChange={(value) => {
                      parameters.updateText(
                        "endDate",
                        getFormattedDate(value) == ""
                          ? ""
                          : getFormattedDate(value)
                      );
                      setEndDate(value);

                      searchParams.set("endDate", getFormattedDate(value));
                      setSearchParams(searchParams);
                      fetchData();
                    }}
                  />
                </Center>
              </Menu.Dropdown>
            </Menu>
          </Button.Group>
          {
            authUser?.user_type === 'sender'  ?
              <Button leftSection={<IoMdAdd size={20} />} variant="filled" radius="md" onClick={() => {
                navigate('/post_cargo')
              }}>New Cargo</Button> : null
          }
        </Group>
      </Group>
      <Space h="md" />

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing={{ base: 30 }}>
        {ordersStatistics && !isLoading ? (
          <>
            <OrderStatisticCard
              title="Total Cargo"
              data={ordersStatistics?.total_orders!}
              duration="This Month"
            />
            <OrderStatisticCard
              title="Pending Bids"
              data={ordersStatistics?.pending_orders!}
              duration="This Month"
            />
            <OrderStatisticCard
              title="Active Cargo"
              data={ordersStatistics?.active_orders!}
              duration="This Month"
            />
            <OrderStatisticCard
              title="Completed "
              data={ordersStatistics?.delivered_orders!}
              duration="This Month"
            />
          </>
        ) : (
          skeletons
        )}
      </SimpleGrid>

      <Space h="md" />
      <OngoingDeliver
        data={ongoingOrders?.results ?? []}
        isLoading={isLoading}
      />
      <Space h="md" />
      <RecentActivity
        orders={orders}
        loadingOrders={loadingOrders}
        fetchOrders={fetchOrders}
        fetchData={fetchData}
        parameters={parameters}
      />
    </div>
  );
}
