import {
  ActionIcon,
  Box,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Paper,
  SimpleGrid,
  Space,
  Text
} from "@mantine/core";
import { IoMdEye } from "react-icons/io";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import { IFile, parseLocationFromJson } from "../../home/types";
import { convertSecondsToReadableTime } from "../../../hooks/utils";

interface Props {
  loadingOrder: boolean;
  order: any;
}

function OrderDetails({ loadingOrder, order }: Props) {
  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={loadingOrder}
          loaderProps={{ children: "Loading..." }}
        />
        <Paper bg={"white"} p={"md"} radius={"md"} style={{ border: "1px solid #1A2F570F" }}>
          <Group justify="space-between">
            <Group>
              <div
                style={{
                  border: "1px solid #292D3214",
                  borderRadius: "8px",
                  padding: 10,
                  width: "40px",
                  height: "40px",
                }}
              >
                {Icons.truck_fast}
              </div>
              <Text c="#0B131B" size="18px" fw={500}>
                Cargo Information
              </Text>
            </Group>
          </Group>
          <Space h="md" />
          <div>
            <Group justify="space-between">
              <Text size="18px" fw={700} c={Color.TextTitle3} mb={"xs"}>
                Consignor Details
              </Text>
              {/* {order.tracking_id != undefined ? <Group justify="space-between">
                <Text tt="uppercase" fz={'14px'} fw={500}>
                  #{order.tracking_id}
                </Text>
                <CopyButton value={order.tracking_id} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                      <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                        {copied ? <FaCheck /> : <IoCopyOutline />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group> : null} */}
            </Group>
            <Space h="xs" />
            <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
              <div>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Consignor Name
                    </Text>
                    <Text size="18px" c={Color.Text3} fw={500}>
                      {order?.extra_information.consignor_name}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Phone Number
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.consignor_phone}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Pickup Location
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {
                        parseLocationFromJson(order?.sender_location!)
                          .senderLocation
                      }
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Notes
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.consignor_notes}
                    </Text>
                  </div>
                </SimpleGrid>
              </div>
            </Paper>
          </div>
          <Space h="xl" />
          <div>
            <Text size="18px" fw={700} c={Color.TextTitle3} mb={"xs"}>
              Consignee Details
            </Text>
            <Space h="xs" />

            <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
              <div>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Consignee Name
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.receiver_name}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Phone Number
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.receiver_phone}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Expected Delivery
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.duration ? convertSecondsToReadableTime(`${order?.duration}`) : "-"}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Delivery Location
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {
                        parseLocationFromJson(order?.receiver_location!)
                          .receiverLocation
                      }
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Notes
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.receiver_notes}
                    </Text>
                  </div>
                </SimpleGrid>
              </div>
            </Paper>
          </div>
          <Space h="xl" />

          <div>
            <Text size="18px" fw={700} c={Color.TextTitle3} mb={"xs"}>
              Package Details
            </Text>
            <Space h="xs" />

            <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
              <div>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Category
                    </Text>
                    <Text
                      size="18px"
                      fw={500}
                      c={Color.Text3}
                      tt={"capitalize"}
                    >
                      {order?.category}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Number of Packages
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.pieces}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Weight
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.package_size}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Dimensions
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.dims}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Package Type
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      {order?.extra_information.package_type}
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Properties
                    </Text>

                    <Group gap="sm">
                      {order?.extra_information.hazardous ? (
                        <Text size="18px" fw={500} c={Color.Text3}>
                          Hazardous
                        </Text>
                      ) : null}
                      {order?.extra_information.stackable ? (
                        <Text size="18px" fw={500} c={Color.Text3}>
                          Stackable
                        </Text>
                      ) : null}
                      {order?.extra_information.fast_load ? (
                        <Text size="18px" fw={500} c={Color.Text3}>
                          Fast Load
                        </Text>
                      ) : null}
                    </Group>
                  </div>
                  <div>
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Budget
                    </Text>
                    <Text size="18px" fw={500} c={Color.Text3}>
                      <NumberFormatter
                        prefix="Tshs "
                        value={order?.price}
                        thousandSeparator
                      />
                    </Text>
                  </div>
                </SimpleGrid>
              </div>
            </Paper>
          </div>
          <Space h="xl" />

          <div>
            <Text size="18px" fw={700} c={Color.TextTitle3} mb={"xs"}>
              Documents
            </Text>
            <Space h="xs" />

            <Paper bg={"#F6F6F6"} px={"md"} pt={"md"} pb={"5px"} radius={"md"}>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                {order?.extra_information.files.map((item: IFile, index: number) => (
                  <Paper
                    p="sm"
                    radius="10px"
                    bg={Color.White}
                    mb={"sm"}
                    key={index}
                  >
                    <Group justify="space-between">
                      <Group>
                        {Icons.doc}
                        <div>
                          <Text fz={"12px"} fw={500} c={Color.Text4}>
                            {item.name}
                          </Text>
                          {/* <Text fz={"11px"} fw={400} c={Color.Text5}>
                            92 kb
                          </Text> */}
                        </div>
                      </Group>
                      <Group justify="flex-end">
                        <ActionIcon
                          component="a"
                          href={item.image}
                          target="_blank"
                          download
                          variant="subtle"
                          radius="xl"
                          aria-label="Settings"
                        >
                          <IoMdEye />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Paper>
                ))}

                {order?.extra_information.files.length == 0 && <Paper
                  p="sm"
                  radius="10px"
                  bg={Color.White}
                  mb={"sm"}

                >
                  <Group justify="space-between">
                    <Group>
                      <div>
                        <Text fz={"12px"} fw={500} c={Color.Text4}>
                          No documents
                        </Text>

                      </div>
                    </Group>

                  </Group>
                </Paper>}
              </SimpleGrid>
            </Paper>
          </div>
        </Paper>
      </Box>


    </>
  );
}

export default OrderDetails;
