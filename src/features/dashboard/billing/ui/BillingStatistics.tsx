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
import moment from "moment";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useUtilities } from "../../../hooks/utils";
import BillingStatisticCard from "../components/BillingStatisticsCard";
import { OrderStatisticCardSkeleton } from "../components/Loaders";
import { useDashboardParameters } from "../stores";
import {
  IBilling,
  InvoiceSummary,
  PaginatedResponse,
} from "../types";
import OwnerInvoiceTable from "./OwnerInvoiceTable";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUserResponse } from "../../../auth/types";
import SenderInvoiceTable from "./SenderInvoiceTable";
import { useBillingServices } from "../services";
import { notifications } from "@mantine/notifications";

export default function BillingStatistics() {
  const parameters = useDashboardParameters();
  const { getFormattedDate } = useUtilities();
  const authUser = useAuthUser<IUserResponse>();

  const { getBillingStatistics, getBillings } = useBillingServices();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBillings, setLoadingBillings] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [billings , setBillings] = useState<PaginatedResponse<IBilling>>()
  const [statistics, setBillingStatistics] = useState<InvoiceSummary>()
  const [senderStatistics, _setSenderStatistics] =
    useState<any>({
      totalSpent: 45000000,
      pendingPayments: 5500000,
      advancePayments: 12000000,
      paidInvoices: 30,
    });
  const [ownerStatistics, _setOwnerStatistics] =
    useState<any>({
      totalEarnings: 18500000,
      pendingPayments: 4000000,
      sanaCommission: 300000,
      paidInvoices: 30,
    });



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
    getBillingStatistics(params)
      .then((response) => {
        setIsLoading(false);
        setBillingStatistics(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });

    fetchBillings(1);
  };
  const fetchBillings = (page: number) => {
    setLoadingBillings(true);
    const params = useDashboardParameters.getState();

    getBillings(params, page)
      .then((response) => {
        setLoadingBillings(false);
        setBillings(response.data);
      })
      .catch((_error) => {
        setLoadingBillings(false);
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

  const skeletons = Array.from({ length: 4 }, (_, index) => (
    <OrderStatisticCardSkeleton key={index} />
  ));

  return (
    <div>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Billing
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
      {authUser?.user_type === "owner" && (
        <>
          <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing={{ base: 10 }}>
            {ownerStatistics && !isLoading ? (
              <>
                <BillingStatisticCard
                  title="Total Earnings"
                  data={statistics?.total_amount!}
                  duration="This Month"
                />
                <BillingStatisticCard
                  title="Pending Payments"
                  data={statistics?.total_pending_amount!}
                  duration="This Month"
                />
                <BillingStatisticCard
                  title="Sana Commission"
                  data={statistics?.sana_commission!}
                  duration="This Month"
                />
                <BillingStatisticCard
                  title="Fully Paid Invoices"
                  data={statistics?.fully_paid_invoices!}
                  duration="This Month"
                  subscript="Trips"
                />
              </>
            ) : (
              skeletons
            )}
          </SimpleGrid>
          <Space h="md" />
          <OwnerInvoiceTable
            invoices={billings}
            loadingOrders={loadingBillings}
            fetchInvoices={fetchBillings}
          />
        </>
      )}
      {authUser?.user_type === "sender" && (
        <>
          <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing={{ base: 10 }}>
            {senderStatistics && !isLoading ? (
              <>
                <BillingStatisticCard
                  title="Total Amount Spent"
                  data={statistics?.total_amount!}
                  duration="This Month"
                />
                <BillingStatisticCard
                  title="Pending Payments"
                  data={statistics?.total_pending_amount!}
                  duration="This Month"
                />
                <BillingStatisticCard
                  title="Advance Payments Made"
                  data={statistics?.partially_paid_invoices!}
                  duration="This Month"
                />
                <BillingStatisticCard
                  title="Fully Paid Invoices"
                  data={statistics?.fully_paid_invoices!}
                  duration="This Month"
                  subscript="Invoices"
                />
              </>
            ) : (
              skeletons
            )}
          </SimpleGrid>
          <Space h="md" />
          <SenderInvoiceTable
            invoices={billings}
            loadingOrders={loadingBillings}
            fetchInvoices={fetchBillings}
          />
        </>
      )}
    </div>
  );
}
