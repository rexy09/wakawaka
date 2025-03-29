import { Group, Space, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useDocumentServices } from "../services";
import { useDashboardParameters } from "../stores";
import { ICargoOrder, PaginatedResponse } from "../types";
import BidTable from "./DocumentTable";

export default function Documents() {
  // const parameters = useDashboardParameters();
  // const { getFormattedDate } = useUtilities();
  const { getDocuments } = useDocumentServices();
  const [loadingTable, setLoadingTable] = useState(false);
  // const [openStartDate, setOpenStartDate] = useState(false);
  // const [openEndDate, setOpenEndDate] = useState(false);
  const [documnts, setDocuments] = useState<PaginatedResponse<ICargoOrder>>();

  // const getFirstDayOfCurrentMonth = (): Date => {
  //   const today = new Date();
  //   const value = new Date(today.getFullYear(), today.getMonth(), 1);

  //   return value;
  // };

  // const getLastDayOfCurrentMonth = (): Date => {
  //   const today = new Date();
  //   const value = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  //   return value;
  // };

  // const [startDate, setStartDate] = useState<Date | null>(() =>
  //   getFirstDayOfCurrentMonth()
  // );
  // const [endDate, setEndDate] = useState<Date | null>(() =>
  //   getLastDayOfCurrentMonth()
  // );

  const fetchData = () => {
    fetchOrders(1);
  };
  const fetchOrders = (page: number) => {
    setLoadingTable(true);
    const params = useDashboardParameters.getState();

    getDocuments(params, page)
      .then((response) => {
        setLoadingTable(false);
        setDocuments(response.data);
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
  useEffect(() => {
    // parameters.updateText("startDate", getFormattedDate(startDate));
    // parameters.updateText("endDate", getFormattedDate(endDate));
    fetchData();
  }, []);

  return (
    <div>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Documents
        </Text>

        {/* <Button.Group>
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
        </Button.Group> */}
      </Group>

      <Space h="md" />
      <BidTable
        bids={documnts}
        loadingOrders={loadingTable}
        fetchOrders={fetchOrders}
      />
    </div>
  );
}
