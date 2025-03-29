import {
  Avatar,
  Badge,
  Button,
  Group,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Color } from "../../../../common/theme";
import { IUserResponse } from "../../../auth/types";
import { useBidServices } from "../services";
import { IBidResult, IDriver } from "../types";
interface Props {
  bid: IBidResult;
  dirivers: IDriver[];
  fetchData: () => void;
}

export default function AssignDriverModal({ fetchData, bid, dirivers }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [driverId, setDriverId] = useState<string>("");
  const authUser = useAuthUser<IUserResponse>();
  const { assignDriverBid } = useBidServices();

  const assignDriverAction = () => {
    setIsLoading(true);
    assignDriverBid(driverId, bid.id!)
      .then((_response) => {
        setIsLoading(false);
        fetchData();
        close();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Your job has been assigned to driver",
        });
      })
      .catch((error) => {
        setIsLoading(false);
        if (
          error.response.data.error &&
          typeof error?.response?.data?.error === "string"
        ) {
          notifications.show({
            color: "red",
            title: "Error",
            message: error.response.data.error,
          });
        } else {
          notifications.show({
            color: "red",
            title: "Error",
            message: "Something went wrong!",
          });
        }
      });
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size={"lg"}
        title={
          <Text size="16px" fw={700} c={Color.TextTitle3} mb={"xs"}>
            Assign Driver
          </Text>
        }
      >
        {authUser?.user_type == "owner" &&
          bid.is_bid_won &&
          bid.order.driver == null && (
            <Paper>
              <ScrollArea
                h={450}
                w={"100%"}
                scrollbars="y"
                type="auto"
                offsetScrollbars
              >
                {dirivers?.map((item, index) => (
                  <Paper
                    bg={"white"}
                    p={"md"}
                    mb={"sm"}
                    radius={"md"}
                    withBorder
                    key={index}
                    style={{
                      border:
                        item.id == driverId
                          ? `2px solid ${Color.PrimaryBlue}`
                          : "2px solid #1A2F570F",
                    }}
                    onClick={() => {
                      if (item.id == driverId) {
                        setDriverId("");
                      } else {
                        setDriverId(item.id);
                      }
                    }}
                  >
                    <div>
                      <Group>
                        <Avatar
                          src={item.profile_img}
                          radius="xl"
                          size={"lg"}
                        />

                        <div style={{ flex: 1 }}>
                          <Text size="16px" fw={600} c={Color.Dark}>
                            {item.full_name}
                          </Text>
                          <Space h="5px" />
                          {!item.is_active ? (
                            <Badge variant="light" color={"green"} radius="sm">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="light" color="gray" radius="sm">
                              Not Available
                            </Badge>
                          )}
                        </div>
                      </Group>

                      <Space h="md" />
                      <SimpleGrid cols={3}>
                        <div>
                          <Text
                            size="16px"
                            fw={400}
                            c={Color.TextSecondary3}
                            mb={"xs"}
                          >
                            Truck number
                          </Text>
                          <Text size="14px" c={Color.Text3}>
                            {item.current_vehicle
                              ? item.current_vehicle.plate_no
                              : "-"}
                          </Text>
                        </div>
                        <div>
                          <Text
                            size="16px"
                            fw={400}
                            c={Color.TextSecondary3}
                            mb={"xs"}
                          >
                            Truck Type
                          </Text>
                          <Text size="14px" c={Color.Text3}>
                            {item.current_vehicle
                              ? item.current_vehicle.body_type
                              : "-"}
                          </Text>
                        </div>

                        <div>
                          <Text
                            size="16px"
                            fw={400}
                            c={Color.TextSecondary3}
                            mb={"xs"}
                          >
                            Driver Number
                          </Text>
                          <Text size="14px" c={Color.Text3}>
                            {item.phone_number}
                          </Text>
                        </div>
                      </SimpleGrid>
                    </div>
                  </Paper>
                ))}
              </ScrollArea>
              <Space h="md" />

              <Group justify="flex-end">
                <Button
                  onClick={() => {
                    assignDriverAction();
                  }}
                  color={Color.PrimaryBlue}
                  loading={isLoading}
                  disabled={isLoading || driverId.length == 0}
                >
                  Assign Driver
                </Button>
              </Group>
            </Paper>
          )}
      </Modal>
      <Button
        onClick={open}
        color={Color.PrimaryBlue}
        loading={isLoading}
        disabled={isLoading}
      >
        Assign Driver
      </Button>
    </>
  );
}
