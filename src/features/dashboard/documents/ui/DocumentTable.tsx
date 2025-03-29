import {
  ActionIcon,
  CopyButton,
  Group,
  Table,
  Text,
  Tooltip
} from "@mantine/core";
import moment from "moment";
import { FaCheck } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import { ICargoOrder, PaginatedResponse } from "../types";

interface Props {
  bids?: PaginatedResponse<ICargoOrder>;
  loadingOrders: boolean;
  fetchOrders: (offset: number) => void;
}

function BidTable({ bids: orders, loadingOrders, fetchOrders }: Props) {
  const rows = orders?.results.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Group>
          <Text tt="uppercase" fz={"14px"} fw={500}>
            #{row.order.tracking_id}
          </Text>
          <CopyButton value={row.order.tracking_id} timeout={2000}>
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
        <Group>
          <Text tt="capitalize" fz={"14px"} fw={500}>
            View
          </Text>
          <ActionIcon variant="subtle" radius="md">
            <IoMdEye color="#3A4656" />
          </ActionIcon>
        </Group>
      </Table.Td>

      <Table.Td w={200}>
        {moment(row.created_at).format(" Do MMMM YYYY")}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <CustomTable
      title="Documents"
      rows={rows ?? []}
      colSpan={3}
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
          <Table.Th>Document</Table.Th>
          <Table.Th
            style={{
              borderRadius: "0px 10px 10px 0px",
            }}
          >
            Created At
          </Table.Th>
        </Table.Tr>
      }
    />
  );
}

export default BidTable;
