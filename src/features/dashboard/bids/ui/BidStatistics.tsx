import {
  Button,
  Center,
  Group,
  Menu,
  SimpleGrid,
  Space,
  Tabs,
  Text
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import {
  useUtilities
} from "../../../hooks/utils";
import { IOrder } from "../../home/types";
import BidStatisticsCard from "../components/BidStatisticsCard";
import { OrderStatisticCardSkeleton } from "../components/Loaders";
import {
  useBidServices
} from "../services";
import { useDashboardParameters } from "../stores";
import {
  IBidResult,
  IBidStatsResponse,
  PaginatedResponse
} from "../types";
import BidTable from "./BidTable";
import OngoingBidsTable from "./OngoingBidsTable";

export default function BidStatistics() {
  const [activeTab, setActiveTab] = useState<string | null>("first");
  const [searchParams, setSearchParams] = useSearchParams();

  const parameters = useDashboardParameters();
  const { getFormattedDate } = useUtilities();
  const { getBidStatistics, getOperationBidding, getBiddedOrders } =
    useBidServices();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [bidStatistics, setBidStatistics] = useState<IBidStatsResponse>();
  const [bids, setBids] = useState<PaginatedResponse<IBidResult>>();
  const [orders, setOrders] = useState<PaginatedResponse<IOrder>>();

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
    getBidStatistics(params)
      .then((response) => {
        setIsLoading(false);
        setBidStatistics(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });


    fetchOrders(1);
    fetchBiddingOrders(1);
  };
  const fetchOrders = (page: number) => {
    setLoadingOrders(true);
    const params = useDashboardParameters.getState();

    getOperationBidding(params, page)
      .then((response) => {
        setLoadingOrders(false);
        setBids(response.data);
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
  const fetchBiddingOrders = (page: number) => {
    setLoadingOrders(true);
    const params = useDashboardParameters.getState();

    getBiddedOrders(params, page)
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
    if (searchParams.get("tab") == "second") {
      setActiveTab("second");
    }
    parameters.updateText("startDate", getFormattedDate(startDate));
    parameters.updateText("endDate", getFormattedDate(endDate));
    fetchData();
  }, []);


  const skeletons = Array.from({ length: 4 }, (_, index) => (
    <OrderStatisticCardSkeleton key={index} />
  ));

  return (
    <div>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Bids
        </Text>

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
                  allowDeselect
                  value={startDate}
                  onChange={(value) => {
                    parameters.updateText(
                      "startDate",
                      getFormattedDate(value) == ""
                        ? ""
                        : getFormattedDate(value)
                    );
                    setStartDate(value);
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
                  allowDeselect
                  value={endDate}
                  onChange={(value) => {
                    parameters.updateText(
                      "endDate",
                      getFormattedDate(value) == ""
                        ? ""
                        : getFormattedDate(value)
                    );
                    setEndDate(value);
                    fetchData();
                  }}
                />
              </Center>
            </Menu.Dropdown>
          </Menu>
        </Button.Group>
      </Group>
      <Space h="md" />

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing={{ base: 10 }}>
        {bidStatistics && !isLoading ? (
          <>
            <BidStatisticsCard
              title="Total Bids"
              data={bidStatistics?.total_bids!}
              duration="This Month"
            />
            <BidStatisticsCard
              title="Pending Bids"
              data={bidStatistics?.pending_bids!}
              duration="This Month"
            />
            <BidStatisticsCard
              title="Accepted Bids "
              data={bidStatistics?.accepted_bids!}
              duration="This Month"
            />
            <BidStatisticsCard
              title="Rejected Bids"
              data={bidStatistics?.rejected_bids!}
              duration="This Month"
            />
            {/* <BidStatisticsCard
              title="Cancelled Bids"
              data={bidStatistics?.cancelled_bids!}
              duration="This Month"
            /> */}
          </>
        ) : (
          skeletons
        )}
      </SimpleGrid>

      <Space h="md" />
      <Tabs keepMounted={false} value={activeTab} onChange={setActiveTab} variant="pills">
        <div style={{ backgroundColor: "#EDF0F6", borderRadius: "7px" }} className="w-[240px] p-[3px]">
          <Tabs.List>
            <Tabs.Tab value="first"
              onClick={() => {
                searchParams.delete('tab');
                setSearchParams(searchParams);
                fetchBiddingOrders(1);
              }}>Ongoing Bids</Tabs.Tab>
            <Tabs.Tab value="second" onClick={() => {
              searchParams.set('tab', 'second');
              setSearchParams(searchParams);
              fetchOrders(1);
            }}
            >Bid History</Tabs.Tab>
          </Tabs.List>
        </div>

        <Space h="md" />
        <Tabs.Panel value="first">
          <OngoingBidsTable orders={orders} loadingOrders={loadingOrders} parameters={parameters} fetchOrders={fetchBiddingOrders} />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <BidTable bids={bids} loadingOrders={loadingOrders} parameters={parameters}  fetchOrders={fetchOrders} />
        </Tabs.Panel>
      </Tabs>


    </div>
  );
}
