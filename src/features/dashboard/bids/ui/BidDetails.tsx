import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  NumberFormatter,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Color } from "../../../../common/theme";
import { IUserResponse } from "../../../auth/types";
import { getColorForStateMui } from "../../../hooks/utils";
import { IOrder } from "../../home/types";
import { useJobServices } from "../../jobs/services";
import AssignDriverModal from "../components/AssignDriverModal";
import OrderDetails from "../components/OrderDetails";
import { useBidServices } from "../services";
import { IBidResult, IDriver, PaginatedResponse } from "../types";
import { Icons } from "../../../../common/icons";

export default function BidDetails() {
  const { getOrder, getOrderBid } = useJobServices();
  const { cancelBid, acceptBid, declineBid, getAvailableDrivers } =
    useBidServices();
  const { id } = useParams();
  const authUser = useAuthUser<IUserResponse>();
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [order, setOrder] = useState<IOrder>();
  const [bids, setBids] = useState<PaginatedResponse<IBidResult>>();
  const [dirivers, setDirivers] = useState<PaginatedResponse<IDriver>>();

  const cancelBidAction = () => {
    setIsLoading(true);
    cancelBid(bids?.results[0].id!)
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Your bid has been cancelled",
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

  const acceptBidAction = (bidId: string) => {
    setIsLoading(true);
    acceptBid(bidId)
      .then((_response) => {
        setIsLoading(false);
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Bid has been accepted",
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

  const declineBidAction = (bidId: string) => {
    setIsLoading(true);
    declineBid(bidId)
      .then((_response) => {
        setIsLoading(false);
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Bid has been declined",
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

  const fetchData = () => {
    setLoadingOrder(true);

    getOrder(id!)
      .then((response) => {
        setLoadingOrder(false);
        setOrder(response.data);
      })
      .catch((_error) => {
        setLoadingOrder(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });

    getOrderBid(id!)
      .then((response) => {
        setLoadingOrder(false);
        setBids(response.data);
      })
      .catch((_error) => {
        setLoadingOrder(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });

    if (authUser?.user_type == "owner") {
      fetchAvailableDrivers(1);
    }
  };

  const fetchAvailableDrivers = (page: number) => {
    setLoadingOrder(true);

    getAvailableDrivers(page)
      .then((response) => {
        setLoadingOrder(false);
        setDirivers(response.data);
      })
      .catch((_error) => {
        setLoadingOrder(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Group justify="space-between">
        <Group>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IoMdArrowRoundBack />
          </ActionIcon>
          <Text size="18px" fw={500}>
            Bid Details
          </Text>
        </Group>
        <>
          <Modal
            opened={opened}
            onClose={close}
            title={
              <Text size="16px" fw={700} c={Color.TextTitle3} mb={"xs"}>
                Cancel Bid
              </Text>
            }
          >
            <Text size="14px" c={Color.TextSecondary2} mb={"xs"}>
              Are you sure you want to cancel your bid?
            </Text>
            <Space h="md" />
            <Center>
              <Group>
                <Button
                  onClick={() => {
                    cancelBidAction();
                  }}
                  color={Color.Danger}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Cancel Bid
                </Button>
                <Button onClick={close} color={"gray"}>
                  Close
                </Button>
              </Group>
            </Center>
          </Modal>
          {authUser?.user_type == "owner" && (
            <>
              {bids?.results[0].state != "cancelled" && (
                <Button
                  variant=""
                  color={"gray"}
                  onClick={open}
                  disabled={order?.state != "bidding"}
                >
                  Cancel Bid
                </Button>
              )}
            </>
          )}
        </>
      </Group>
      <Space h="md" />
      {authUser?.user_type == "owner" && (
        <>
          <Space h="md" />
          {bids?.results.length! > 0 && (
            <Paper bg={"white"} p={"md"} radius={"md"} withBorder>
              <div>
                <Group justify="space-between">
                  <Text size="18px" fw={600} c={Color.TextTitle2} mb={"xs"}>
                    Your Bid
                  </Text>
                  <>
                    {bids?.results[0].is_bid_won ? (
                      <Badge variant="light" color={"green"} radius="sm">
                        Won
                      </Badge>
                    ) : (
                      <Badge variant="light" color="yellow" radius="sm">
                        Not Won
                      </Badge>
                    )}
                  </>
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                  <div>
                    <Text
                      size="16px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Bid Amount
                    </Text>
                    <Text size="14px" c={Color.Text3}>
                      <NumberFormatter
                        prefix="Tshs "
                        value={bids?.results[0].price}
                        thousandSeparator
                      />
                    </Text>
                  </div>
                  <div>
                    <Text
                      size="16px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Status
                    </Text>
                    <Badge
                      variant="light"
                      color={getColorForStateMui(bids?.results[0].state ?? "")}
                      size="sm"
                      radius="sm"
                    >
                      {bids?.results[0].state}
                    </Badge>
                  </div>

                  <div>
                    <Text
                      size="16px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Submitted On
                    </Text>
                    <Text size="14px" c={Color.Text3}>
                      {moment(bids?.results[0].created_at).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </Text>
                  </div>
                </SimpleGrid>
              </div>
              {authUser?.user_type == "owner" &&
                bids?.results[0].is_bid_won &&
                bids?.results[0].order.driver == null && (
                  <Group justify="flex-end">
                    <AssignDriverModal
                      fetchData={fetchData}
                      dirivers={dirivers?.results ?? []}
                      bid={bids?.results[0]!}
                    />
                  </Group>
                )}
            </Paper>
          )}
          <Space h="md" />
        </>
      )}

      {authUser?.user_type == "owner" &&
        bids?.results[0].is_bid_won &&
        bids?.results[0].order.driver && (
          <>
            <Paper bg={"white"} p={"md"} radius={"md"} withBorder>
              <Group justify="space-between">
                <Text size="18px" fw={600} c={Color.TextTitle2} mb={"xs"}>
                  Assigned Driver
                </Text>
              </Group>
              <Space h="xs" />

              <Paper bg={"white"} p={"md"} radius={"md"} withBorder>
                <div>
                  <Group>
                    <Avatar
                      src={bids?.results[0].order.driver.profile_img}
                      radius="xl"
                      size={"lg"}
                    />

                    <div style={{ flex: 1 }}>
                      <Text size="16px" fw={600} c={Color.Dark}>
                        {bids?.results[0].order.driver.full_name}
                      </Text>
                      <Space h="5px" />
                      <Badge variant="light" color={"green"} radius="sm">
                        Accepted
                      </Badge>
                    </div>
                  </Group>

                  <Space h="md" />
                  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
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
                        {bids?.results[0].order.driver.current_vehicle.plate_no}
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
                        {
                          bids?.results[0].order.driver.current_vehicle
                            .body_type
                        }
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
                        {bids?.results[0].order.driver.phone_number}
                      </Text>
                    </div>
                  </SimpleGrid>
                </div>
              </Paper>
            </Paper>
            <Space h="md" />
          </>
        )}
      <Grid>

        {authUser?.user_type == "sender" && <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          {authUser?.user_type == "sender" && bids?.results.length! > 0 && (
            <Paper
              p="md"
              radius="10px"
              style={{ border: "1px solid #1A2F570F" }}
            >
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
                    {Icons.box2}
                  </div>
                  <Text c="#0B131B" size="18px" fw={500}>
                    Bids
                  </Text>
                </Group>
              </Group>
              <Space h="md" />
              <Box pos="relative">
                <LoadingOverlay
                  visible={loadingOrder}
                  loaderProps={{ children: "Loading..." }}
                />
                <ScrollArea h={"90vh"} w={"100%"} scrollbars="y">
                  {bids?.results.map((bid,index) => (
                    <Paper
                      bg={"white"}
                      p={"md"}
                      radius={"md"}
                      withBorder
                      mb={"md"}
                      key={index}
                    >
                      <div>
                        <Group justify="space-between">
                          <Group>
                            <Avatar
                              src={bid.owner.logo}
                              radius="xl"
                              size={"lg"}
                            />

                            <div style={{ flex: 1 }}>
                              <Text size="16px" fw={600} c={Color.Dark}>
                                {bid.owner.company}
                              </Text>
                              <Space h="5px" />

                              <Text
                                size="14px"
                                c={Color.TextSecondary2}
                                fw={400}
                                tt="capitalize"
                              >
                                {bid.owner.office_location}
                              </Text>
                            </div>
                          </Group>
                          <>
                            {bid.user_state == "accepted" ? (
                              <Badge
                                variant="light"
                                color={"green"}
                                radius="sm"
                              >
                                Won
                              </Badge>
                            ) : (
                              <Badge variant="light" color="yellow" radius="sm">
                                Pending
                              </Badge>
                            )}
                          </>
                        </Group>

                        <Space h="md" />
                        <SimpleGrid cols={{ base: 2, sm: 2, lg: 3 }}>
                          <div>
                            <Text
                              size="16px"
                              fw={400}
                              c={Color.TextSecondary3}
                              mb={"xs"}
                            >
                              Contact
                            </Text>
                            <Text size="14px" c={Color.Text3}>
                              {bid.owner.company_phone}
                            </Text>
                          </div>
                          <div>
                            <Text
                              size="16px"
                              fw={400}
                              c={Color.TextSecondary3}
                              mb={"xs"}
                            >
                              Website
                            </Text>
                            <Text size="14px" c={Color.Text3}>
                              {bid.owner.website}
                            </Text>
                          </div>

                          <div>
                            <Text
                              size="16px"
                              fw={400}
                              c={Color.TextSecondary3}
                              mb={"xs"}
                            >
                              Years of experince
                            </Text>
                            <Text size="14px" c={Color.Text3}>
                              {bid.owner.years_of_experience}
                            </Text>
                          </div>

                          <div>
                            <Text
                              size="16px"
                              fw={400}
                              c={Color.TextSecondary3}
                              mb={"xs"}
                            >
                              Bid Amount
                            </Text>
                            <Text size="14px" c={Color.Text3}>
                              <NumberFormatter
                                prefix="Tshs "
                                value={bid.price}
                                thousandSeparator
                              />
                            </Text>
                          </div>
                          <div>
                            <Text
                              size="16px"
                              fw={400}
                              c={Color.TextSecondary3}
                              mb={"xs"}
                            >
                              Status
                            </Text>
                            <Badge
                              variant="light"
                              color={getColorForStateMui(bid.state ?? "")}
                              size="sm"
                              radius="sm"
                            >
                              {bid.state}
                            </Badge>
                          </div>

                          <div>
                            <Text
                              size="16px"
                              fw={400}
                              c={Color.TextSecondary3}
                              mb={"xs"}
                            >
                              Submitted On
                            </Text>
                            <Text size="14px" c={Color.Text3}>
                              {moment(bid.created_at).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </Text>
                          </div>
                        </SimpleGrid>
                      </div>
                      <Space h="xs" />
                      {bid.user_state == null && (
                        <Group justify="flex-start">
                          <Button
                            onClick={() => {
                              acceptBidAction(bid.id);
                            }}
                            color={Color.PrimaryBlue}
                            loading={isLoading}
                            disabled={isLoading}
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => {
                              declineBidAction(bid.id);
                            }}
                            color={"gray"}
                            loading={isLoading}
                            disabled={isLoading}
                          >
                            Decline
                          </Button>
                        </Group>
                      )}
                    </Paper>
                  ))}
                </ScrollArea>
              </Box>
            </Paper>
          )}
        </Grid.Col>}
        <Grid.Col span={authUser?.user_type == "sender" ? { base: 12, md: 6, lg: 6 } : 12}>
          <OrderDetails loadingOrder={loadingOrder} order={order} />
        </Grid.Col>
      </Grid>

    </div>
  );
}
