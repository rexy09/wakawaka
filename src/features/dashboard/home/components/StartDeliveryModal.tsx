import {
  ActionIcon,
  Button,
  Center,
  Modal,
  Space,
  Text,
  Tooltip
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import { useDashboardServices } from "../services";
interface Props {
  orderId: string;
  fetchData: () => void;
}

export default function StartDeliveryModal({ orderId, fetchData }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateOrder } = useDashboardServices();

  const updateOrderState = (state: string) => {
    setIsLoading(true);

    updateOrder({ state, orderId })
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Order state changed",
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
            Start Delivery
          </Text>
        }
      >
        <Text size="14px" c={Color.Text4} mb={"xs"} ta={"center"} fw={500}>
          Ready to Start Delivery?
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"} ta={"center"}>
          Begin the delivery process
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"} ta={"center"}>
          Current: Accepted ➜ Next: Started
        </Text>
        <Space h="md" />
        <Center>
          <Button
            onClick={() => {
              updateOrderState("started");
            }}
            color={Color.PrimaryBlue}
            loading={isLoading}
            disabled={isLoading}
          >
            Start Delivery
          </Button>
        </Center>
      </Modal>
      <Tooltip label="Start Delivery">
        <ActionIcon variant="default" onClick={open} radius="md">
          {Icons.truck_fast}
        </ActionIcon>
      </Tooltip>
    </>
  );
}
