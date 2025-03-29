import {
  ActionIcon,
  Box,
  Button,
  Center,
  Grid,
  Group,
  Menu,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  Space,
  Text
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Color } from "../../../../common/theme";
import { useUtilities } from "../../../hooks/utils";
import OrderStatisticCard from "../../home/components/OrderStatisticsCard";
import { IOrdersStatistics } from "../../home/types";
import { OrderStatisticCardSkeleton } from "../components/Loaders";
import { useReportServices } from "../services";
import { useReportParameters } from "../stores";
import ReportTable from "./ReportTable";
export default function Reports() {
  const parameters = useReportParameters();
  const { getFormattedDate } = useUtilities();
  const { getOrdersStatistics } = useReportServices();
  const [isLoading, setIsLoading] = useState(false);
  // const [loadingOrders, setLoadingOrders] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [ordersStatistics, setOrderStatistics] = useState<IOrdersStatistics>();
  // const [reports, setReports] = useState<PaginatedResponse<IOrder>>();
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [opened, { open, close }] = useDisclosure(false);
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
    const params = useReportParameters.getState();
    getOrdersStatistics(params)
      .then((response) => {
        setIsLoading(false);
        setOrderStatistics(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });

    // fetchReports(1);
  };
  // const fetchReports = (page: number) => {
  //   setLoadingOrders(true);
  //   const params = useDashboardParameters.getState();

  //   getOrders(params, page)
  //     .then((response) => {
  //       setLoadingOrders(false);
  //       setReports(response.data);
  //     })
  //     .catch((_error) => {
  //       setLoadingOrders(false);
  //       notifications.show({
  //         color: "red",
  //         title: "Error",
  //         message: "Something went wrong!",
  //       });
  //     });
  // };

  useEffect(() => {
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
          Reports
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
        {ordersStatistics && !isLoading ? (
          <>
            <OrderStatisticCard
              title="Active Jobs"
              data={ordersStatistics?.active_orders!}
              duration="This Month"
            />
            <OrderStatisticCard
              title="Completed Jobs"
              data={ordersStatistics?.delivered_orders!}
              duration="This Month"
            />
            <OrderStatisticCard
              title="Pending Jobs"
              data={ordersStatistics?.pending_orders!}
              duration="This Month"
            />
            <OrderStatisticCard
              title="Cancelled Jobs"
              data={ordersStatistics?.cancelled_orders!}
              duration="This Month"
            />
          </>
        ) : (
          skeletons
        )}
      </SimpleGrid>

      <Space h="md" />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
          <ReportTable
            orders={{ results: [], count: 0 , next: null, previous: null}}
            loadingOrders={false}
            fetchOrders={() => {}}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Modal opened={opened} onClose={close} 
          withCloseButton={false}
            centered
            radius="md"
            size="md"
            >
            <Box
            
              style={{
                background: 'linear-gradient(45deg, #192252, #0B72DA)',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >

              <Group justify="flex-end" pe={10} pt={10}>

                <ActionIcon  onClick={close} variant="transparent" >
                  <IoMdClose color="white" />
                </ActionIcon>
              </Group>
              <div style={{ padding: '0px 32px 32px 32px'}}>

              <Text
                style={{
                  marginTop: '16px',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                }}
              >
                No data available at the moment.
              </Text>
              {/* <Text style={{ marginTop: '8px', fontSize: '1rem' }}>
                We're working hard to bring you this exciting new feature. Stay
                tuned for updates!
              </Text> */}
              </div>
            </Box>
          </Modal>

          <Paper p="md" radius="10px" style={{ border: "2px solid #1A2F570F" }}>
            <Text size="18px" fw={500}>
              Generate Report
            </Text>
            <Space h="md" />

            <Select
              label="Report Type"
              placeholder="Select"
              data={["Job Report", "Financial Report"]}
            />
            <Space h="md" />

            <DatePickerInput
              type="range"
              label="Date Range"
              placeholder="Pick dates range"
              value={value}
              onChange={setValue}
            />
            <Space h="md" />
            <Button fullWidth size="lg" radius={"md"} color={Color.DarkBlue} onClick={open}>
              Generate Report
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
}
