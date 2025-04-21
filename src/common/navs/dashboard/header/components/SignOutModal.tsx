import { Button, Flex, Modal, Space, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../../../../features/dashboard/notifications/stores";
import { Icons } from "../../../../icons";
import { Color } from "../../../../theme";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";

type Props = {
  menuButton?: boolean;
};

export default function SignOutModal({ menuButton }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const signOut = useSignOut();
  const auth = getAuth();
  const navigate = useNavigate();
  const notificationStore = useNotificationStore();


  return (
    <>
      <Modal opened={opened} onClose={close} centered size="lg">
        <Text c={Color.BrandBlue} fw={600} ta="center" size="30px" mb={"md"}>
         We are so sad 😔 to see you go! 
        </Text>
        <Text c="grey" fw={500} ta="center" size="16px">
         Are you sure you want to log out?
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
            onClick={() => {
              close();
              signOut();
              firebaseSignOut(auth).then(() => {
                // Sign-out successful.
              }).catch((_error) => {
                // An error happened.
              });
              localStorage.clear();
              notificationStore.reset();
              navigate("/");
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
          <Text >Logout</Text>
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
