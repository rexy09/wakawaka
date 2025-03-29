import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  NumberFormatter,
  Paper,
  SimpleGrid,
  Space,
  Text
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Color } from "../../../../common/theme";
import { IUserResponse } from "../../../auth/types";
import { getColorForStateMui } from "../../../hooks/utils";
import OrderDetails from "../../bids/components/OrderDetails";
import { IBidResult } from "../../bids/types";
import { useJobServices } from "../../jobs/services";
import { IOrder, PaginatedResponse } from "../types";

export default function CargoDetails() {
  const { getOrder, getOrderBid } = useJobServices();

  const { id } = useParams();
  const authUser = useAuthUser<IUserResponse>();
  const navigate = useNavigate();

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [order, setOrder] = useState<IOrder>();
  const [bids, setBids] = useState<PaginatedResponse<IBidResult>>();

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
            Cargo Details
          </Text>
        </Group>
      </Group>
      {authUser?.user_type == "sender" && (
        <>
          <Space h="md" />
          {bids?.results.length! > 0 && (
            <Paper bg={"white"} p={"md"} radius={"md"} withBorder>
              <div>
                <Group justify="space-between">
                  <Group>
                    <Avatar
                      src={bids?.results[0].owner.logo}
                      radius="xl"
                      size={"lg"}
                    />

                    <div style={{ flex: 1 }}>
                      <Text size="16px" fw={600} c={Color.Dark}>
                        {bids?.results[0].owner.company}
                      </Text>
                      <Space h="5px" />

                      <Text
                        size="14px"
                        c={Color.TextSecondary2}
                        fw={400}
                        tt="capitalize"
                      >
                        {bids?.results[0].owner.office_location}
                      </Text>
                    </div>
                  </Group>
                  <>
                    {bids?.results[0].user_state == "accepted" ? (
                      <Badge variant="light" color={"green"} radius="sm">
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
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
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
                      {bids?.results[0].owner.company_phone}
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
                      {bids?.results[0].owner.website}
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
                      {bids?.results[0].owner.years_of_experience}
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
            </Paper>
          )}
        </>
      )}
      {authUser?.user_type == "owner" && (
        <>
          <Space h="md" />
          {bids?.results?.length! > 0 && (
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
            </Paper>
          )}
        </>
      )}

      <Space h="md" />
      {authUser?.user_type == "owner" && bids?.results?.length! > 0 &&
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
      <OrderDetails loadingOrder={loadingOrder} order={order} />
    </div>
  );
}
