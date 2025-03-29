import {
  Box,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Space,
  Stack,
  Text
} from "@mantine/core";
import { useState } from "react";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import DeliveryMap from "../components/DeliveryMap";
import { MapSkeleton, OrderSkeleton } from "../components/Loaders";
import { IOrder } from "../types";
interface Props {
  data: IOrder[];
  isLoading: boolean;
}
export default function OngoingDeliver(props: Props) {
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const orderSkeletons = Array(4)
    .fill(0)
    .map((_, index) => <OrderSkeleton key={index} />);

  return (
    <Paper p="md" radius="10px" style={{ border: "2px solid #1A2F570F" }}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
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
                Ongoing Delivery
              </Text>
            </Group>
          </Group>
          <Space h="md" />
          <ScrollArea h={450} w={"100%"} scrollbars="y" offsetScrollbars type="auto">
            <Box w={"100%"}>
              {!props.isLoading
                ? props.data.map((order, index) => (
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
              {props.data.length == 0 &&

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
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 7 }}>
          {!props.isLoading ? (
            <DeliveryMap shipment={props.data[orderIndex] ?? null} />
          ) : (
            <MapSkeleton />
          )}
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
