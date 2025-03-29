import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  ActionIcon,
  Text,
  Space,
  Center,
  Group,
  Rating,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { Color } from "../../../../common/theme";
import { useState } from "react";
import { useDashboardServices } from "../services";
import { notifications } from "@mantine/notifications";
import { FaRegCheckCircle } from "react-icons/fa";
interface Props {
  orderId: string
  fetchData: () => void;

}

export default function ConfirmDeliveryModal({ orderId, fetchData }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [comment, setComment] = useState('');

  const { updateOrder, } =
    useDashboardServices();


  const updateOrderState = (state: string) => {
    setIsLoading(true);

    updateOrder({ state, orderId, ratings ,comment })
      .then((_response) => {
        setIsLoading(false);
        close()
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
            Confirm Delivery
          </Text>
        }
      >
        <Text size="14px" c={Color.Text4} mb={"xs"} ta={"center"} fw={500}>
          Ready to Confirm & Rate Delivery?
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"} ta={"center"}>
          Final state of the delivery
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"} ta={"center"}>
          Current: Waiting Confirmation → Next: Delivered
        </Text>
        <Space h="md" />
        <Center>
        <Rating value={ratings} onChange={setRatings} size={'lg'} />
         
        </Center>
        <Space h="md" />
        <Center>
          <Textarea
            value={comment}
            label='Additional Comments'
            placeholder="Share your experience..."
            onChange={(event) => setComment(event.currentTarget.value)}
          />
        </Center>
        <Space h="md" />
        <Center>
          <Group>
            <Button onClick={close} color={"gray"} variant="outline">
              Close
            </Button>
            <Button
              onClick={() => {
                if (ratings >0) {
                  updateOrderState('delivered')
                  
                }else{
                  notifications.show({
                    color: "red",
                    title: "Error",
                    message: "Rating required",
                  });
                }
              }}
              color={'#1C8C6E'}
              loading={isLoading}
              disabled={isLoading}
            >
              Confirm Delivery
            </Button>
          </Group>
        </Center>
      </Modal>
      <Tooltip label="Confirm Delivery">

      <ActionIcon variant="default" onClick={open} radius="md">
        <FaRegCheckCircle color="green" />
      </ActionIcon>
      </Tooltip>
      
    </>
  );
}
