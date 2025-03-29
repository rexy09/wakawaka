import {
  ActionIcon,
  Badge,
  CopyButton,
  Group,
  NumberFormatter,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { FaCheck } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import { getColorForStateMui } from "../../../hooks/utils";
import { IOrder, parseLocationFromJson } from "../../home/types";
import { PaginatedResponse } from "../types";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface Props {
  orders?: PaginatedResponse<IOrder>;
  loadingOrders: boolean;
  fetchOrders: (offset: number) => void;
}

export default function ReportTable({ orders, loadingOrders, fetchOrders }: Props) {
  const navigate = useNavigate();
  const rows = orders?.results.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Group justify="space-between">
          <Text tt="uppercase" fz={"14px"} fw={500}>
            #{row.tracking_id}
          </Text>
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
        </Group>
      </Table.Td>
      <Table.Td>
        <Text tt="capitalize" fz={"14px"} fw={500}>
          {row.category}
        </Text>
      </Table.Td>
      <Table.Td>
        {moment(row.created_at).format(" Do MMMM YYYY, h:mm:ss a")}
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
      <Table.Td>
        <ActionIcon
          variant="subtle"
          radius="md"
          onClick={() => {
            navigate("/jobs/" + row.id);
          }}
        >
          <IoMdEye color="#3A4656" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <CustomTable
      title="Reports"
      rows={rows ?? []}
      colSpan={4}
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
            Report ID
          </Table.Th>
          <Table.Th>Report Type</Table.Th>
          <Table.Th>Date Generated</Table.Th>
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


