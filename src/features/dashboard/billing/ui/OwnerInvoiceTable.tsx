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
import { useNavigate } from "react-router-dom";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import { getColorForStateMui } from "../../../hooks/utils";
import { IBilling,  PaginatedResponse } from "../types";

interface Props {
  invoices?: PaginatedResponse<IBilling>;
  loadingOrders: boolean;
  fetchInvoices: (page: number) => void;
}

export default function OwnerInvoiceTable({
  invoices,
  loadingOrders,
  fetchInvoices,
}: Props) {
  const navigate = useNavigate();
  const rows = invoices?.results.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Group justify="space-start">
          <CopyButton value={row.invoice_id} timeout={2000}>
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
            {row.invoice_id}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text tt="uppercase" fz={"14px"} fw={500}>
          #{row.order.tracking_id}
        </Text>
      </Table.Td>
      <Table.Td>{row.sender.full_name}</Table.Td>
      <Table.Td>
        <NumberFormatter prefix="Tsh " value={row.amount} thousandSeparator />
      </Table.Td>
      <Table.Td>
        <NumberFormatter prefix="Tsh " value={row.remaining_amount} thousandSeparator />
      </Table.Td>
      <Table.Td>
        <Text tt="capitalize" fz={"14px"} fw={500}>
          {row.category}
        </Text>
      </Table.Td>

      <Table.Td w={100}>
        <Badge
          variant="light"
          color={getColorForStateMui(row.status)}
          size="sm"
          radius="sm"
        >
          {row.status}
        </Badge>
      </Table.Td>

      <Table.Td>
        <ActionIcon
          variant="default"
          radius="md"
          onClick={() => {
            navigate("/billing/" + row.id);
          }}
        >
          <IoMdEye color="#3A4656" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <CustomTable
      title="Invoices"
      rows={rows ?? []}
      colSpan={8}
      isLoading={loadingOrders}
      fetchData={fetchInvoices}
      totalData={invoices != undefined ? invoices.count : 0}
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
            Invoice ID
          </Table.Th>
          <Table.Th>Cargo ID</Table.Th>
          <Table.Th>Cargo Owner</Table.Th>
          <Table.Th>Amount </Table.Th>
          <Table.Th>remaining amount</Table.Th>
          <Table.Th>Type</Table.Th>
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
