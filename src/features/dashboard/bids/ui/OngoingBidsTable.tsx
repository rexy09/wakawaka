import {
  ActionIcon,
  Badge,
  CopyButton,
  Group,
  NumberFormatter,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { FaCheck } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import { getColorForStateMui } from "../../../hooks/utils";
import { IOrder, parseLocationFromJson } from "../../home/types";
import { Actions, BidFilterParameters, PaginatedResponse } from "../types";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../../common/icons";
import { MdOutlineClear } from "react-icons/md";

interface Props {
  orders?: PaginatedResponse<IOrder>;
  parameters: BidFilterParameters & Actions;
  loadingOrders: boolean;
  fetchOrders: (offset: number) => void;
}

export default function OngoingBidsTable({ orders, loadingOrders, parameters, fetchOrders }: Props) {
  const navigate = useNavigate();
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
      <Table.Td w="150">
        {moment(row.created_at).format(" D MMM YYYY")}
      </Table.Td>

      <Table.Td w={100}>
        <Badge
          variant="light"
          color={getColorForStateMui(row.state)}
          size="sm"
          radius="sm"
        >
          {row.state}
        </Badge>
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
      <Table.Td w={150}>
        {row.total_bids}
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="default"
          radius="md"
          onClick={() => {
            navigate("/bids/" + row.id);
          }}
        >
          <IoMdEye color="#3A4656" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <CustomTable
      title="Ongoing Bids"
      summary={<>
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
      </>}
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
          <Table.Th>Created Date</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>From</Table.Th>
          <Table.Th>To</Table.Th>
          <Table.Th>Budget</Table.Th>
          <Table.Th>Bids Received</Table.Th>
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


