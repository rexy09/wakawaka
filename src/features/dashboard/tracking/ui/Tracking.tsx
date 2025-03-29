import { Button, Center, Group, Menu, Space, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useUtilities } from "../../../hooks/utils";
import { useTrackingServices } from "../services";
import { useDashboardParameters } from "../stores";
import InTransit from "./InTransit";
import { PaginatedResponse, IOrder } from "../../home/types";
export function Tracking() {
  const parameters = useDashboardParameters();
  const { getFormattedDate } = useUtilities();
  const { getOngoingOrders } =
    useTrackingServices();
  const [isLoading, setIsLoading] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
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
  };

  useEffect(() => {
    parameters.updateText("startDate", getFormattedDate(startDate));
    parameters.updateText("endDate", getFormattedDate(endDate));
    fetchData();
  }, []);

  return (
    <div>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Tracking
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
      <InTransit data={ongoingOrders?.results ?? []} isLoading={isLoading} parameters={parameters} fetchData={fetchData} />
      <Space h="md" />
    </div>
  );
}
