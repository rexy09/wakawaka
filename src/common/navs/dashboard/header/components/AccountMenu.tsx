import { Avatar, Flex, Group, Menu, Space, Text } from "@mantine/core";

import { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import { IUserResponse } from "../../../../../features/auth/types";
import { Color } from "../../../../theme";
import { Icons } from "../../../../icons";
import { CiSettings, CiUser } from "react-icons/ci";
import SignOutModal from "./SignOutModal";
type Props = {
  showTitle?: boolean;
};
function AccountMenu({}: Props) {
  const navigate = useNavigate();
  const authUser = useAuthUser<IUserResponse>();

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
        withinPortal
        width={200}
        transitionProps={{ transition: "rotate-right", duration: 150 }}
        shadow="md"
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
              <Avatar
                src={
                  authUser?.user_type === "sender"
                    ? authUser?.user?.profile_img
                    : authUser?.owner?.user.profile_img
                }
                radius="xl"
              />

             {/*  <div style={{ flex: 1 }}>
                <Text size="16px" fw={600} c={Color.Dark} lineClamp={1}>
                  {authUser?.user
                    ? authUser?.user?.full_name
                    : authUser?.owner?.user.full_name}
                </Text>
                <Space h="5px" />

                <Text
                  size="12px"
                  c={Color.PrimaryBlue}
                  fw={400}
                  tt="capitalize"
                >
                  {authUser?.role === "clearing_agent" && "Clearing Agent"}
                  {authUser?.role === "user" && "Cargo Owner"}
                  {authUser?.role === "dalali" && "Broker"}
                  {authUser?.user_type === "owner" && "Transpoter"}
                </Text>
              </div> */}
            </Group>
            {/* {Icons.chevron_down} */}
          </Flex>
        </Menu.Target>
        <Menu.Dropdown p={"sm"}>
          <Menu.Item
            leftSection={<CiUser size="25" />}
            onClick={() => {
              navigate("/settings");
            }}
          >
            <Text>Profile</Text>
          </Menu.Item>
          {authUser?.user_type === "owner" && (
            <Menu.Item
              leftSection={<CiSettings size="25" />}
              onClick={() => {
                navigate("/settings?tab=second");
              }}
            >
              <Text>Company</Text>
            </Menu.Item>
          )}

          <SignOutModal menuButton={true} />
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
}

export default AccountMenu;
