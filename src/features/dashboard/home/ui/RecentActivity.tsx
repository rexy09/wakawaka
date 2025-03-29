import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Menu,
  NumberFormatter,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { FaCheck } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import { IUserResponse } from "../../../auth/types";
import {
  convertMetersToKilometers,
  convertSecondsToReadableTime,
  getColorForStateMui,
} from "../../../hooks/utils";
import ConfirmDeliveryModal from "../components/ConfirmDeliveryModal ";
import MarkDeliveredModal from "../components/MarkDeliveredModal";
import StartDeliveryModal from "../components/StartDeliveryModal";
import StopBiddingModal from "../components/StopBiddingModal";
import { useDashboardServices } from "../services";
import {
  ICancelReason,
  IOrder,
  PaginatedResponse,
  parseLocationFromJson,
} from "../types";
import { Icons } from "../../../../common/icons";
import { Actions, DashboardFilterParameters } from "../stores";
import { Color } from "../../../../common/theme";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { MdOutlineClear } from "react-icons/md";
interface Props {
  orders?: PaginatedResponse<IOrder>;
  loadingOrders: boolean;
  fetchData: () => void;
  fetchOrders: (offset: number) => void;
  parameters: DashboardFilterParameters & Actions;
}

function RecentActivity({
  orders,
  loadingOrders,
  fetchOrders,
  fetchData,
  parameters,
}: Props) {
  const navigate = useNavigate();

  const authUser = useAuthUser<IUserResponse>();
  const [_isLoading, setIsLoading] = useState(false);
  const [reasons, setReasons] = useState<PaginatedResponse<ICancelReason>>();
  const { getCancelReasons } = useDashboardServices();

  const fetchCancelReasons = () => {
    setIsLoading(true);

    getCancelReasons()
      .then((response) => {
        setIsLoading(false);
        setReasons(response.data);
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
    fetchCancelReasons();
  }, []);

  const rows = orders?.results.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Group gap="5" wrap="nowrap">
          <CopyButton value={row.tracking_id} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right"
              >
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? <FaCheck /> : <IoCopyOutline />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Text tt="uppercase" fz={"14px"} fw={500}>
            #{row.tracking_id}
          </Text>
         
        </Group>
      </Table.Td>
      <Table.Td>
        <Text tt="capitalize" fz={"14px"} fw={500}>
          {row.category}
        </Text>
      </Table.Td>
      <Table.Td>
        {convertSecondsToReadableTime(`${row.duration ?? 0}`)}
      </Table.Td>
      <Table.Td>
        {convertMetersToKilometers(Number(row.distance) ?? 0)}
      </Table.Td>
      <Table.Td w={300}>
        {parseLocationFromJson(row.sender_location).senderLocation}
      </Table.Td>
      <Table.Td w={300}>
        {parseLocationFromJson(row.receiver_location).receiverLocation}
      </Table.Td>
      <Table.Td w={150}>
        <NumberFormatter prefix="Tshs " value={row.price} thousandSeparator />
      </Table.Td>
      <Table.Td w={100}>
        <Tooltip label={row.state.split("_").join(" ").toUpperCase()}>
          <Badge
            variant="light"
            color={getColorForStateMui(row.state)}
            size="xs"
            radius="sm"
          >
            {row.state.split("_").join(" ")}
          </Badge>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Group>
          <ActionIcon
            variant="default"
            color="gray"
            radius="md"
            onClick={() => {
              navigate("/order/" + row.id);
            }}
          >
            <IoMdEye color="#3A4656" />
          </ActionIcon>
          {authUser?.user_type == "sender" && (
            <>
              {row.state == "bidding" && (
                <StopBiddingModal
                  orderId={row.id}
                  fetchData={fetchData}
                  reasons={reasons?.results ?? []}
                />
              )}
              {row.state == "waiting_confirmation" && (
                <ConfirmDeliveryModal orderId={row.id} fetchData={fetchData} />
              )}
            </>
          )}
          {authUser?.user_type == "owner" && (
            <>
              {row.state == "accepted" && (
                <StartDeliveryModal orderId={row.id} fetchData={fetchData} />
              )}
              {row.state == "started" && (
                <MarkDeliveredModal orderId={row.id} fetchData={fetchData} />
              )}
            </>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <CustomTable
      title="Recent Activity"
      summary={
        <>
          <TextInput
            leftSection={Icons.search}
            placeholder="Search by Cargo ID"
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
          <Menu width={220} withinPortal>
            <Menu.Target>
              <Button
                color="#13131329"
                variant="default"
                radius={"md"}
                leftSection={Icons.filter}
                pr={12}
              >
                <Text
                  size="14px"
                  fw={parameters.state == "" ? 500 : 700}
                  c={parameters.state == "" ? "" : Color.PrimaryBlue}
                  tt={"capitalize"}
                >
                  {parameters.state == ""
                    ? "Filter"
                    : parameters.state.split("_").join(" ")}
                </Text>
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {[
                { label: "All", value: "" },
                { label: "Delivered", value: "delivered" },
                { label: "Started", value: "started" },
                { label: "Cancelled", value: "cancelled" },
                { label: "Bidding", value: "bidding" },
                { label: "Accepted", value: "accepted" },
                {
                  label: "Waiting Confirmation",
                  value: "waiting_confirmation",
                },
              ].map((item) => (
                <Menu.Item
                  key={item.value}
                  style={{
                    color:
                      parameters.state === item.value
                        ? `${Color.PrimaryBlue}`
                        : "",
                    fontWeight: parameters.state === item.value ? "700" : "",
                  }}
                  onClick={() => {
                    parameters.updateText("state", item.value);
                    fetchOrders(1);
                  }}
                >
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Button
            color="#13131329"
            variant="default"
            radius={"md"}
            leftSection={Icons.exportIcon}
            pr={12}
          >
            <Text size="14px" fw={500}>
              Exports
            </Text>
          </Button>
        </>
      }
      rows={rows ?? []}
      colSpan={8}
      isLoading={loadingOrders}
      fetchData={fetchOrders}
      totalData={orders != undefined ? orders.count : 0}
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
            Cargo ID
          </Table.Th>
          <Table.Th>Cargo</Table.Th>
          <Table.Th>Duration</Table.Th>
          <Table.Th>Distance</Table.Th>
          <Table.Th>From</Table.Th>
          <Table.Th>To</Table.Th>
          <Table.Th>Fee</Table.Th>
          <Table.Th>Status</Table.Th>
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

export default RecentActivity;
