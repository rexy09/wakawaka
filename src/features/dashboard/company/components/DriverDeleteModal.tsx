import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  ActionIcon,
  Text,
  Space,
  Center,
  Group,
} from "@mantine/core";
import { Color } from "../../../../common/theme";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useCompanyServices } from "../services";
import { MdDeleteOutline } from "react-icons/md";
import { IDriver } from "../types";

interface Props {
  driverId: string;
  driver: IDriver;

  fetchData: (page: number) => void;
}

export default function DriverDeleteModal({
  driverId,
  fetchData,
  driver,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteDriver } = useCompanyServices();

  const deleteAction = () => {
    setIsLoading(true);

    deleteDriver(driverId)
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData(1);
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Driver successfuly deleted",
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
            Delete Vehicle
          </Text>
        }
      >
        <Text size="14px" c={Color.Text4} mb={"xs"} ta={"center"} fw={500}>
          Are you sure you want to delete this vehicle?
        </Text>
        <Text size="14px" c={Color.TextSecondary2} mb={"xs"} ta={"center"}>
          {driver.full_name} - {driver.information.driver_license}
        </Text>
        <Space h="md" />
        <Center>
          <Group>
            <Button onClick={close} color={"gray"} variant="outline">
              Close
            </Button>
            <Button
              onClick={() => {
                deleteAction();
              }}
              color={Color.Danger}
              loading={isLoading}
              disabled={isLoading}
            >
              Delete
            </Button>
          </Group>
        </Center>
      </Modal>

      <ActionIcon variant="default" onClick={open} radius="md">
        <MdDeleteOutline color={Color.Danger} />
      </ActionIcon>
    </>
  );
}
