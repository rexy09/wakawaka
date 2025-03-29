import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Select,
  Space,
  Text,
  Tooltip
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { AiOutlineStop } from "react-icons/ai";
import { Color } from "../../../../common/theme";
import { useDashboardServices } from "../services";
import { ICancelReason } from "../types";
interface Props {
  orderId: string;
  fetchData: () => void;
  reasons: ICancelReason[];
}

export default function StopBiddingModal({
  orderId,
  fetchData,
  reasons,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");

  const { updateOrder } = useDashboardServices();

  const updateOrderState = (state: string) => {
    setIsLoading(true);

    updateOrder({ state, orderId, reason })
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
            Stop Bidding
          </Text>
        }
      >
        <Text size="14px" c={Color.Text4} mb={"xs"} fw={500}>
          Ready to Stop Bidding?
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"}>
          Stop accepting new bids for this order
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"}>
          Current: Bidding → Next: Cancelled
        </Text>
        <Select
          withAsterisk
          label="Reason"
          placeholder="Reason"
          searchable
          clearable
          value={reason}
          data={[
            ...reasons.map((item) => ({
              value: item.id,
              label: item.reason,
            })),
          ]}
          onChange={(value) => {
            setReason(value ?? "");
          }}
        />
        <Space h="md" />
        <Group>
          <Button
            onClick={() => {
              if (reason.length > 0) {
                updateOrderState("cancelled");
              } else {
                notifications.show({
                  color: "red",
                  title: "Error",
                  message: "Reason required",
                });
              }
            }}
            color={Color.Danger}
            loading={isLoading}
            disabled={isLoading}
          >
            Stop Bidding
          </Button>
        </Group>
      </Modal>
      <Tooltip label="Stop Bidding">
        <ActionIcon variant="default" onClick={open} radius="md">
          <AiOutlineStop color="#3A4656" />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
