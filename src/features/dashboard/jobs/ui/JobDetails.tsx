import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  Space,
  Text
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Color } from "../../../../common/theme";
import OrderDetails from "../../bids/components/OrderDetails";
import { IBidResult } from "../../bids/types";
import { IOrder } from "../../home/types";
import { useJobServices } from "../services";
import { IBidForm, PaginatedResponse } from "../types";

export default function JobDetails() {
  const navigate = useNavigate();

  const { postBid, getOrder, getOrderBid } = useJobServices();
  const { id } = useParams();
  const [opened, {  close }] = useDisclosure(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [order, setOrder] = useState<IOrder>();
  const [_bids, setBids] = useState<PaginatedResponse<IBidResult>>();

  const form = useForm<IBidForm>({
    initialValues: { price: 0 },

    validate: {
      price: (value) =>
        value < order?.price! ? `Amount should be greater or equal to Tshs ${order?.price.toLocaleString()}` : null,
    },
  });

  const placeBid = () => {
    setIsLoading(true);
    postBid(form.values, id!)
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Your bid has been placed",
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
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="subtle" color="gray" onClick={() => {
            navigate(-1);
          }} >
            <IoMdArrowRoundBack />
          </ActionIcon>
          <Text size="18px" fw={500}>
            Job Details
          </Text>
        </Group>
        <>
          <Modal
            opened={opened}
            onClose={() => {
              close();
              form.reset()
            }}
            title={
              <Text size="16px" fw={700} c={Color.TextTitle3} mb={"xs"}>
                Place Bid
              </Text>
            } centered
          >
            <form
              onSubmit={form.onSubmit(() => {
                placeBid();
              })}
            >
              <NumberInput
                prefix="Tshs "
                label="Amount"
                placeholder="Enter bid amount"
                // description={`Amount should be greater or equal to Tshs ${order?.price.toLocaleString()}`}
                thousandSeparator=","
                min={1}
                inputWrapperOrder={['label', 'input', 'description', 'error']}
                key={form.key("price")}
                {...form.getInputProps("price")}
              />
              <Space h="md" />

              <Button
                type="submit"
                color={Color.PrimaryBlue}
                loading={isLoading}
                disabled={isLoading}
              >
                Place Bid
              </Button>
            </form>
          </Modal>

          {/* <Button variant="" color={Color.PrimaryBlue} onClick={open} disabled={bids?.results.length! > 0 || order?.state != 'bidding'}>
            Place Bid
          </Button> */}
        </>
      </Group>
      <Space h="md" />
      {/* {
        bids?.results.length! > 0 &&
        <Paper bg={"white"} p={"md"} radius={"md"} withBorder>
          <div>
            <Text size="18px" fw={600} c={Color.TextTitle2} mb={"xs"}>
              Your Bid
            </Text>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              <div>
                <Text size="16px" fw={400} c={Color.TextSecondary3} mb={"xs"}>
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
                <Text size="16px" fw={400} c={Color.TextSecondary3} mb={"xs"}>
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
                <Text size="16px" fw={400} c={Color.TextSecondary3} mb={"xs"}>
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
      } */}
      <Space h="md" />
      <OrderDetails loadingOrder={loadingOrder} order={order} />

    </div>
  );
}
