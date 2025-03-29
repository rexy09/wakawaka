import { Button, Flex, Modal, Space, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../../../../features/dashboard/notifications/stores";
import { Icons } from "../../../../icons";
import { Color } from "../../../../theme";

type Props = {
  menuButton?: boolean;
};

export default function SignOutModal({ menuButton }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const signOut = useSignOut();
  const navigate = useNavigate();
    const notificationStore = useNotificationStore();
  

  return (
    <>
      <Modal opened={opened} onClose={close} centered>
        <Text c="grey" fw={500} ta="center">
          Are you sure you want to logout?
        </Text>

        <Space h={"md"} />
        <Flex
          gap="xl"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Button
            color={"red"}
            onClick={() => {
              close();
              signOut();
              localStorage.clear();
              navigate("/login");
             
              notificationStore.reset();
            }}
            variant="subtle"
          >
            Logout
          </Button>
          <Button
            color="gray"
            onClick={() => {
              close();
            }}
            variant="light"
          >
            Cancel
          </Button>
        </Flex>
      </Modal>
      {menuButton ? (
        <Button
          variant="transparent"
          leftSection={Icons.logout}
          onClick={() => {
            open();
          }}
        >
          <Text c={Color.Danger}>Logout</Text>
        </Button>
      ) : (
        <Button
          ms={"sm"}
          leftSection={Icons.logout}
          variant="transparent"
          color={Color.Danger}
          onClick={() => {
            open();
          }}
        >
          <Text fw={600} style={{ fontFamily: "Manrope" }}>
            Logout
          </Text>
        </Button>
      )}
    </>
  );
}
