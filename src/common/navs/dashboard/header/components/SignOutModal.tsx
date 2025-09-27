import { Button, Flex, Modal, Space, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../features/auth/context/FirebaseAuthContext";
import { useNotificationStore } from "../../../../../features/dashboard/notifications/stores";
import { Icons } from "../../../../icons";
import { Color } from "../../../../theme";

type Props = {
  menuButton?: boolean;
};

export default function SignOutModal({ menuButton }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const { signOutUser } = useAuth();
  const navigate = useNavigate();
  const notificationStore = useNotificationStore();


  return (
    <>
      <Modal opened={opened} onClose={close} centered size="lg">
        <Text c={Color.BrandBlue} fw={600} ta="center" size="30px" mb={"md"}>
         We are so sad 😔 to see you go! 
        </Text>
        <Text c="grey" fw={500} ta="center" size="16px">
         Are you sure you want to Sign out?
        </Text>

        <Space h={"xl"} />
        <Flex
          gap="xl"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Button
            color={"red"}
            onClick={async () => {
              close();
              try {
                await signOutUser();
                localStorage.clear();
                notificationStore.reset();
                navigate("/");
              } catch (error) {
                console.error("Error signing out:", error);
              }
            }}
            variant="subtle"
          >
            Sign out
          </Button>
            <Button
            color="gray"
            onClick={() => {
              close();
            }}
            variant="light"
            >
            Go back
            </Button>
        </Flex>
      </Modal>
      {menuButton ? (
        <Button
          radius={'sm'}
          justify="flex-start"
          fullWidth
          color={Color.Danger}
          variant="subtle"
          leftSection={Icons.logout}
          onClick={() => {
            open();
          }}
        >
          <Text >Sign out</Text>
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
          <Text fw={600} >
              Sign out
          </Text>
        </Button>
      )}
    </>
  );
}
