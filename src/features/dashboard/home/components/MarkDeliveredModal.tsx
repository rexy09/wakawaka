import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Rating,
  Space,
  Text,
  Textarea,
  Tooltip
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { Color } from "../../../../common/theme";
import { useDashboardServices } from "../services";
interface Props {
  orderId: string;
  fetchData: () => void;
}

export default function MarkDeliveredModal({ orderId, fetchData }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [comment, setComment] = useState("");

  const { updateOrder } = useDashboardServices();

  const updateOrderState = (state: string) => {
    setIsLoading(true);

    updateOrder({ state, orderId, ratings, comment })
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Order successfuly Deliverd",
        });
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title={
          <Text size="16px" fw={700} c={Color.TextTitle3} mb={"xs"}>
            Mark as Delivered
          </Text>
        }
      >
        <Text size="14px" c={Color.Text4} mb={"xs"} fw={500}>
          Ready to Mark as Delivered?
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"}>
          Mark this delivery as completed
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"}>
          Current: Started ➜ Next: Waiting Confirmation
        </Text>
        <Space h="xs" />
        <Rating value={ratings} onChange={setRatings} size={"lg"} />

        <Space h="md" />
        <Textarea
          value={comment}
          label="Additional Comments"
          placeholder="Share your experience..."
          onChange={(event) => setComment(event.currentTarget.value)}
        />
        <Space h="md" />
        <Group justify="flex-start">
          <Button
            onClick={() => {
              if (ratings > 0) {
                updateOrderState("delivered");
              } else {
                notifications.show({
                  color: "red",
                  title: "Error",
                  message: "Rating required",
                });
              }
            }}
            color={"#1C8C6E"}
            loading={isLoading}
            disabled={isLoading}
          >
            Mark as Delivered
          </Button>
        </Group>
      </Modal>
      <Tooltip label="Mark as Delivered">
        <ActionIcon variant="default" onClick={open} radius="md">
          <FaRegCheckCircle color="green" />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
