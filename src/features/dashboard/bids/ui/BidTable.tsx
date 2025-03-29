import { ActionIcon, Badge, Button, CopyButton, Group, Menu, NumberFormatter, Table, Text, TextInput, Tooltip } from "@mantine/core";
import { FaCheck } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import { getColorForStateMui } from "../../../hooks/utils";
import { parseLocationFromJson } from "../../home/types";
import { Actions, BidFilterParameters, IBidResult, PaginatedResponse, } from "../types";
import { useNavigate } from "react-router-dom";
import { IUserResponse } from "../../../auth/types";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import { MdOutlineClear } from "react-icons/md";

interface Props {
  bids?: PaginatedResponse<IBidResult>;
  loadingOrders: boolean;
  fetchOrders: (offset: number) => void;
  parameters: BidFilterParameters & Actions;
}

function BidTable({ bids, loadingOrders, parameters, fetchOrders }: Props) {
  const navigate = useNavigate();
  const authUser = useAuthUser<IUserResponse>();


  const rows = bids?.results.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Group gap="5" wrap="nowrap">
          <CopyButton value={row.order.tracking_id} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                  {copied ? <FaCheck /> : <IoCopyOutline />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Text tt="uppercase" fz={'14px'} fw={500}>
            #{row.order.tracking_id}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text tt="capitalize" fz={'14px'} fw={500}>
          {row.order.category}
        </Text>
      </Table.Td>
      <Table.Td w={150}>
        <NumberFormatter prefix="Tsh " value={row.price} thousandSeparator />
      </Table.Td>
      <Table.Td>
        {authUser?.user_type == "sender" && <Text fz={'14px'} fw={500} c={row.user_state == "accepted" ? "green" : "red"}>
          {row.user_state == "accepted" ? "Yes" : "No"}
        </Text>}
        {authUser?.user_type == "owner" && <Text fz={'14px'} fw={500} c={row.is_bid_won ? "green" : "red"}>
          {row.is_bid_won ? "Yes" : "No"}
        </Text>}
      </Table.Td>
      <Table.Td w={100}>
        <Group>
          <Badge
            variant="light"
            color={getColorForStateMui(row.state)}
            size="sm"
            radius="sm"
          >
            {row.state}
          </Badge>

        </Group>
      </Table.Td>


      <Table.Td w={300}>
        {parseLocationFromJson(row.order.sender_location).senderLocation}
      </Table.Td>
      <Table.Td w={300}>
        {parseLocationFromJson(row.order.receiver_location).receiverLocation}
      </Table.Td>
      <Table.Td>

        {row.owner.company}

      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="default"
          radius="md"
          onClick={() => {
            navigate('/bids/' + row.order.id);
          }}
        >
          <IoMdEye color="#3A4656" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));
  return (<CustomTable
    title="Bids"
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
              { label: "Pending", value: "pending" },
              { label: "Cancelled", value: "cancelled" },
              { label: "Accepted", value: "accepted" },

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
      </>
    }
    rows={rows ?? []}
    colSpan={8}
    isLoading={loadingOrders}
    fetchData={fetchOrders}
    totalData={bids != undefined ? bids.count : 0}
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
        <Table.Th>Bid Amount</Table.Th>
        <Table.Th>Bid Won</Table.Th>
        <Table.Th>Bid State</Table.Th>
        <Table.Th>From</Table.Th>
        <Table.Th>To</Table.Th>
        <Table.Th>Company Name</Table.Th>
        <Table.Th
          style={{
            borderRadius: "0px 10px 10px 0px",
          }}
        >
          Action
        </Table.Th>
      </Table.Tr>
    }
  />);
}

export default BidTable;