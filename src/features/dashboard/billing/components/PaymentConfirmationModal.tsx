import {
  Button,
  Group,
  Modal,
  NumberFormatter,
  Space,
  Text
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { Color } from "../../../../common/theme";
import { useBillingServices } from "../services";
import { IBillingConfirmation } from "../types";
interface Props {
  payment: IBillingConfirmation;
  fetchData: () => void;
}

export default function PaymentConfirmationModal({
  payment,
  fetchData,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const { patchConfirmBillingPayment } = useBillingServices();

  const updatePaymentState = () => {
    setIsLoading(true);

    patchConfirmBillingPayment(payment.id)
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Payment confirmed successfuly",
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
            Payment Confirmation
          </Text>
        }
      >
        <Text size="14px" c={Color.Text4} mb={"xs"} ta={"center"} fw={500}>
          Are you sure you want to confirm this payment?
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"} ta={"center"}>
          <NumberFormatter
            prefix="Tsh "
            value={payment?.amount}
            thousandSeparator
          />
        </Text>

        <Space h="md" />
        <Group justify="center">
          <Button
            onClick={() => {
              close();
            }}
            variant="light"
            color={"gray"}
            loading={isLoading}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              updatePaymentState();
            }}
            color={Color.PrimaryBlue}
            loading={isLoading}
            disabled={isLoading}
          >
            Confirm
          </Button>
        </Group>
      </Modal>
      <Button
        fullWidth
        size="md"
        radius={"md"}
        color={Color.PrimaryBlue}
        onClick={open}
      >
        Confirm
      </Button>
    </>
  );
}
