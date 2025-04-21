import { Avatar, Flex, Group, Menu, Space, Text } from "@mantine/core";

import { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../../../../features/auth/types";
import { Color } from "../../../../theme";
import SignOutModal from "./SignOutModal";
type Props = {
  showTitle?: boolean;
};
function AccountMenu({}: Props) {
  const navigate = useNavigate();
  const authUser = useAuthUser<IUser>();

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <Flex
      gap="xs"
      justify="space-between"
      align="center"
      direction="row"
      wrap="nowrap"
    >
      <Menu
        position="top-start"
        opened={userMenuOpened}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        width={200}
        transitionProps={{ transition: "rotate-right", duration: 150 }}
        shadow="md"
        withinPortal={false}
      >
        <Menu.Target>
          <Flex
            gap="xs"
            justify="space-between"
            align="flex-start"
            direction="row"
            wrap="nowrap"
            maw={200}
          >
            <Group>
              <Avatar src={authUser?.photoUrl} radius="xl" />
            </Group>
          </Flex>
        </Menu.Target>
        <Menu.Dropdown>
          <Group gap={5} p={"5px"}>
            <Avatar
              src={
                authUser?.photoUrl
              }
              radius="xl"
            />

             <div >
              <Text size="14px" fw={500} c={Color.Dark} lineClamp={1} style={{ lineHeight: 1.2 }}>
                {authUser?.name}
                </Text>
                <Space h="3px" />

                <Text
                  size="12px"
                  c={Color.PrimaryBlue}
                  fw={400}
                lineClamp={1} style={{ lineHeight: 1.2 }}
                >
                {authUser?.email}
                </Text>
              </div>
          </Group>
          <Space h="xs" />
          <Menu.Item
            leftSection={<CiUser size="25" />}
            onClick={() => {
              navigate("/profile");
            }}
          >
            <Text>Profile</Text>
          </Menu.Item>
          <SignOutModal menuButton={true} />
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
}

export default AccountMenu;
