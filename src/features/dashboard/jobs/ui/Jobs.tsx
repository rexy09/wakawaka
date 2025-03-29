import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Paper,
  Text,
  TextInput
} from "@mantine/core";
import { useEffect, useState } from "react";
import { MdOutlineClear } from "react-icons/md";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import { useUtilities } from "../../../hooks/utils";
import { IOrder, IOrdersStatistics } from "../../home/types";
import { OrderStatisticCardSkeleton } from "../components/Loaders";
import { useJobServices } from "../services";
import { useDashboardParameters } from "../stores";
import { PaginatedResponse } from "../types";

export default function Jobs() {
  const parameters = useDashboardParameters();
  const { getFormattedDate } = useUtilities();
  const { getOrdersStatistics, getOrders } = useJobServices();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [ordersStatistics, setOrderStatistics] = useState<IOrdersStatistics>();
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
    getOrdersStatistics(params)
      .then((response) => {
        setIsLoading(false);
        setOrderStatistics(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        // notifications.show({
        //   color: "red",
        //   title: "Error",
        //   message: "Something went wrong!",
        // });
      });

    fetchOrders(1);
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
        // notifications.show({
        //   color: "red",
        //   title: "Error",
        //   message: "Something went wrong!",
        // });
      });
  };
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
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Paper p={"md"} radius={"md"}>
            <Group justify="space-between">
              <Text size="16px" fw={700} c="#040404">
                Filter Job
              </Text>
              <Text size="14px" fw={400} c="#F25454">
                Reset Filter
              </Text>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
          <Paper p={"md"} radius={"md"}>
            <Group justify="space-between">
             <Group>
               <TextInput
                          leftSection={Icons.search}
                  placeholder="UI UX Designer"
                          radius={"md"}
                          value={parameters.search}
                          onChange={(value) => {
                            parameters.updateText("search", value.currentTarget.value);
                            fetchOrders(1);
                          }}
                          rightSection={parameters.search.length != 0 ? <ActionIcon variant="transparent" color="black" onClick={() => {
                            parameters.updateText("search", "");
                            fetchOrders(1);
                          }}>
              
                            <MdOutlineClear />
                          </ActionIcon> : null}
                        />
               <TextInput
                          leftSection={Icons.location}
                  placeholder="Dar es salaam, Tanzania"
                          radius={"md"}
                          value={parameters.search}
                          onChange={(value) => {
                            parameters.updateText("search", value.currentTarget.value);
                            fetchOrders(1);
                          }}
                          rightSection={parameters.search.length != 0 ? <ActionIcon variant="transparent" color="black" onClick={() => {
                            parameters.updateText("search", "");
                            fetchOrders(1);
                          }}>
              
                            <MdOutlineClear />
                          </ActionIcon> : null}
                        />
             </Group>
              <Button size="md" variant="filled" color={Color.PrimaryBlue}>Find Job</Button>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
}
