import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  Timeline,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import TrackingMap from "../components/TrackingMap";
import { MapSkeleton, OrderSkeleton } from "../components/Loaders";
import { IoCallOutline } from "react-icons/io5";
import { TbMessageDots } from "react-icons/tb";
import { IoMdEye } from "react-icons/io";
import { useTrackingServices } from "../services";
import { notifications } from "@mantine/notifications";
import { IFile, IOrder } from "../../home/types";
import { Actions, ITracking, ITrackingResponse, TrackingFilterParameters } from "../types";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineClear } from "react-icons/md";

interface Props {
  data: IOrder[];
  isLoading: boolean;
  fetchData: ()=>void;
  parameters: TrackingFilterParameters & Actions;
}
export default function InTransit({ data, isLoading, parameters, fetchData }: Props) {
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const { getOrderTracking } = useTrackingServices();
  const [loading, setLoading] = useState<boolean>(true);
  const [trackings, setTrackings] = useState<ITracking[]>([]);

  const orderSkeletons = Array(4)
    .fill(0)
    .map((_, index) => <OrderSkeleton key={index} />);

  const fetchOrderTracking = async () => {
    if (!data || data.length === 0) {
      // console.error("No order data available");
      return;
    }

    const order = data[orderIndex];
    if (!order) {
      // console.error("Order not found for index", orderIndex);
      return;
    }
    setLoading(true);
    getOrderTracking(order.tracking_id)
      .then((response) => {
        setLoading(false);
        const responseData = response.data as ITrackingResponse;
        setTrackings(responseData.tracking);
      })
      .catch((_error) => {
        setLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  useEffect(() => {
    fetchOrderTracking();
  }, [orderIndex, isLoading]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
        <Paper p="md" radius="10px" style={{ border: "1px solid #1A2F570F" }}>
          <Group justify="space-between" >
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
                In Transit
              </Text>
            </Group>
            <TextInput
              leftSection={Icons.search}
              placeholder="Search by Cargo ID"
              radius={"md"}
              value={parameters.search}
              onChange={(value) => {
                parameters.updateText("search", value.currentTarget.value);
                fetchData();
              }}
              rightSection={parameters.search.length != 0 ? <ActionIcon variant="transparent" color="black" onClick={() => {
                parameters.updateText("search", "");
                fetchData();
              }}>

                <MdOutlineClear />
              </ActionIcon> : null}
            />
          </Group>
          <Space h="md" />
          <ScrollArea h={"90vh"} w={"100%"} scrollbars="y">
            <Box w={"100%"}>
              {!isLoading
                ? data.map((order, index) => (
                  <Paper
                    key={order.id}
                    p="md"
                    mb={"sm"}
                    radius="10px"
                    style={{
                      border:
                        orderIndex == index
                          ? `2px solid ${Color.PrimaryBlue}`
                          : "2px solid #1A2F570F",
                    }}
                    w={"100%"}
                    onClick={() => {
                      setOrderIndex(index);
                    }}
                  >
                    <Group justify="space-between">
                      <div>
                        <Text c="#7D7D91" size="14px" fw={500}>
                          Shipment number
                        </Text>
                        <Space h="xs" />
                        <Text
                          c="#23293D"
                          size="18px"
                          fw={500}
                          tt={"uppercase"}
                        >
                          #{order.tracking_id}
                        </Text>
                      </div>
                      <Group justify="flex-end">
                        {order.driver?.current_vehicle != null ? (
                          <>
                            <Image
                              src={order.driver.current_vehicle.vehicle_img}
                              w={49}
                              h={49}
                            />
                            <div>
                              <Text c="#272924" size="18px" fw={500}>
                                {order.driver.current_vehicle.plate_no}
                              </Text>
                              <Space h="xs" />
                              <Text c="#626262" size="12px" fw={400}>
                                {order.driver.current_vehicle.model}
                              </Text>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </Group>
                    </Group>
                    <Space h="xs" />
                    <Grid>
                      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Group wrap={"nowrap"}>
                          {Icons.point}
                          <Text c="#23293D" size="12px" fw={500}>
                            {JSON.parse(order.sender_location).senderLocation}
                          </Text>
                        </Group>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
                        <Group wrap={"nowrap"}>
                          {Icons.arrow_right}
                          {Icons.location}
                          <Text c="#23293D" size="12px" fw={500}>
                            {
                              JSON.parse(order.receiver_location)
                                .receiverLocation
                            }
                          </Text>
                        </Group>
                      </Grid.Col>
                    </Grid>
                  </Paper>
                ))
                : orderSkeletons}
              {data.length == 0 && !isLoading &&

                <Stack justify="center" align="center" h={300}>
                  <div className="w-20">

                    {Icons.empty}
                  </div>
                  <Text>
                    No Ongoing Jobs
                  </Text>
                </Stack>
              }
            </Box>
          </ScrollArea>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 7 }}>
        <Paper p="md" radius="10px" style={{ border: "1px solid #1A2F570F" }}>
          {data.length > 0 ? (
            <>
              <TrackingMap shipment={data[orderIndex]} />
              <Divider my={"sm"} />
              <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
                  <Paper p="sm" radius="10px" bg={Color.Background}>
                    <Text fz={"17px"} fw={500}>
                      Driver Info
                    </Text>
                    <Space h={"sm"} />
                    <Group justify="space-between">
                      <Group>
                        <Avatar
                          src={data[orderIndex].driver?.profile_img}
                          size={"lg"}
                        />
                        <div>
                          <Text fz={"18px"} fw={700} c={Color.DarkBlue}>
                            {data[orderIndex].driver?.full_name}
                          </Text>

                          <Group justify="space-between">
                            <Group gap={"4px"} justify="flex-start">
                              <div
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  backgroundColor: data[orderIndex].driver
                                    ?.is_active
                                    ? "#5FA4D2"
                                    : "red",
                                }}
                              ></div>
                              <Text fz={"12px"} fw={500} c={"#82878D"}>
                                {data[orderIndex].driver
                                  ?.is_active ? "Active" : "Inactive"}
                              </Text>
                            </Group>
                          </Group>
                        </div>
                      </Group>
                      <Group justify="flex-end">
                        <ActionIcon
                          variant="filled"
                          radius="xl"
                          component="a"
                          href={"sms:" + data[orderIndex].driver?.phone_number}
                        >
                          <TbMessageDots color="white" />
                        </ActionIcon>

                        <ActionIcon
                          variant="filled"
                          radius="xl"
                          component="a"
                          href={"tel:" + data[orderIndex].driver?.phone_number}
                        >
                          <IoCallOutline color="white" />
                        </ActionIcon>
                      </Group>
                    </Group>
                    <Space h="xs" />
                    <div className="overflow-hidden  ">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className=" ">
                            <th className="border-r border-[#EBECEF] px-4 py-2 text-left text-[11px] font-[400] text-[#7D7D91] normal-case">
                              Truck number
                            </th>
                            <th className="border-r border-[#EBECEF] px-4 py-2 text-left text-[11px] font-[400] text-[#7D7D91] normal-case">
                              Trailer Truck
                            </th>

                            <th className="px-4 py-2 text-left text-[11px] font-[400] text-[#7D7D91] normal-case">
                              Trailer number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="">
                            <td className="border-r border-[#EBECEF] px-4 text-sm font-[600] text-gray-900 dark:text-[#23293D]">
                              {data[orderIndex].driver?.current_vehicle
                                ?.plate_no ?? "N/A"}
                            </td>
                            <td className="border-r border-[#EBECEF] px-4 text-sm font-[600] text-gray-900 dark:text-[#23293D]">
                              {data[orderIndex].driver?.current_vehicle
                                ?.model ?? "N/A"}
                            </td>

                            <td className="px-4 text-sm font-[600] text-gray-900 dark:text-[#23293D]">
                              {data[orderIndex].driver?.current_vehicle
                                ?.plate_no ?? "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Paper>
                  <Space h="xs" />
                  <Paper p="sm" radius="10px" bg={Color.Background}>
                    <Text fz={"17px"} fw={500}>
                      Documents
                    </Text>
                    <Space h={"sm"} />
                    <SimpleGrid cols={{ base: 1, }}>
                      {data[orderIndex].extra_information.files.map((item: IFile, index: number) => (
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

                      {data[orderIndex].extra_information.files.length == 0 && <Paper
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
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 7 }}>
                  <Paper p="sm" radius="10px" bg={Color.Background}>
                    <Text fz={"17px"} fw={500}>
                      Route Details
                    </Text>
                    <Space h={"sm"} />
                    <ScrollArea h={350} w={"100%"} scrollbars="y">
                      <Space h={"md"} />
                      {loading ? (
                        <Loader size="sm" />
                      ) : (
                        <Timeline active={1} lineWidth={5} bulletSize={22}>
                          {trackings.map((tracking, index) => (
                            <Timeline.Item
                              key={index}
                              bullet={
                                index == trackings.length - 1 ? (
                                  <IoLocationOutline />
                                ) : null
                              }
                            >
                              <Grid>
                                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                                  <Text fz={"12px"} fw={700} c={Color.Text6}>
                                    {new Date(
                                      tracking.created_at
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </Text>
                                  <Text fz={"12px"} fw={500} c={Color.Text7}>
                                    {new Date(
                                      tracking.created_at
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </Text>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
                                  <Text
                                    fz={"12px"}
                                    fw={700}
                                    c={Color.Text6}
                                    tt={"capitalize"}
                                  >
                                    {tracking.state}
                                  </Text>
                                  <Text fz={"12px"} fw={400} c={Color.Text7}>
                                    {tracking.description}
                                  </Text>
                                </Grid.Col>
                              </Grid>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      )}
                    </ScrollArea>
                  </Paper>
                </Grid.Col>
              </Grid>
            </>
          ) : (
            <MapSkeleton />
          )}
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
