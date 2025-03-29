import {
  CloseButton,
  Group,
  Image,
  Paper,
  ScrollArea,
  Space,
  Stack
} from "@mantine/core";

import divider from "../../../../assets/divider.svg";
import mainLogo from "../../../../assets/sana_logo.svg";

import { useMediaQuery } from "@mantine/hooks";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUserResponse } from "../../../../features/auth/types";
import { Icons } from "../../../icons";
import { Color } from "../../../theme";
import AccountMenu from "../header/components/AccountMenu";
import NotificationMenu from "../header/components/NotificationMenu";
import SignOutModal from "../header/components/SignOutModal";
import classes from "./sidenav.module.css";
import NavLinkButton from "./ui/nav_link";

type SidebarProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ setOpened }: SidebarProps) {
  const matches = useMediaQuery("(min-width: 62em)");
  const authUser = useAuthUser<IUserResponse>();


  return (
    <nav className={classes.navbar} style={{ backgroundColor: Color.White }}>
      <Group justify="flex-end" hiddenFrom="md">
        <CloseButton
          title="Close"
          size="xl"
          iconSize={20}
          icon={Icons.close}
          onClick={() => setOpened(true)}
        />
      </Group>

      <Stack
        h={matches ? "95vh" : "90vh"}
        align="stretch"
        justify="space-between"
        gap="xs"
      >
        <ScrollArea h={"100vh"}>
          <div>
            <Group mt={"md"} justify="center">
              <Image w={"200px"} src={mainLogo} alt="logo image" />
            </Group>
            <Image my="md" w={"100%"} src={divider} alt="divider" />

            <Group hiddenFrom="md">
              <Paper p={"md"} radius="md" w={"100%"}>
                <Group justify="space-between">
                  <AccountMenu />
                  <NotificationMenu setOpened={setOpened} />
                </Group>
              </Paper>
            </Group>
            <NavLinkButton
              setOpened={setOpened}
              to={"/"}
              label={"Dashboard"}
              iconKey={"dashboard"}
            />
            <Space h="3px" />
            {authUser?.user ? (
              <>
                <NavLinkButton
                  setOpened={setOpened}
                  to={"/post_cargo"}
                  label={"Post Cargo"}
                  iconKey={"post_cargo"}
                />
                <Space h="3px" />
              </>
            ) : null}
            {authUser?.owner ? (
              <>
                <NavLinkButton
                  setOpened={setOpened}
                  to={"/jobs"}
                  label={"Jobs"}
                  iconKey={"post_cargo"}
                />
                <Space h="3px" />
              </>
            ) : null}
            <NavLinkButton
              setOpened={setOpened}
              to={"/tracking"}
              label={"Tracking"}
              iconKey={"tracking"}
            />
            <Space h="3px" />
            <NavLinkButton
              setOpened={setOpened}
              to={"/bids"}
              label={"Bids"}
              iconKey={"bids"}
            />
            <Space h="3px" />
            {authUser?.user ? (
              <>
                <NavLinkButton
                  setOpened={setOpened}
                  to={"/documents"}
                  label={"Documents"}
                  iconKey={"document"}
                />
                <Space h="3px" />
              </>
            ) : null}
            {authUser?.owner ? (
              <>
                <NavLinkButton
                  setOpened={setOpened}
                  to={"/company"}
                  label={"Company"}
                  iconKey={"document"}
                />
                <Space h="3px" />
              </>
            ) : null}

            <Space h="3px" />
            <NavLinkButton
              setOpened={setOpened}
              to={"/billing"}
              label={"Billing"}
              iconKey={"billing"}
            />
            <Space h="3px" />
            <NavLinkButton
              setOpened={setOpened}
              to={"/reports"}
              label={"Reports"}
              iconKey={"report"}
            />
            <Space h="3px" />

            <NavLinkButton
              setOpened={setOpened}
              to={"/settings"}
              label={"Settings"}
              iconKey={"setting"}
            />

            <Space h="3px" />

            <NavLinkButton
              setOpened={setOpened}
              to={"/eve"}
              label={"Eve AI"}
              iconKey={"eve"}
            />
            <Image my="md" w={"100%"} src={divider} alt="divider" />
            <Space h="md" />
            
            <SignOutModal  />
            <Space h="lg" />
          </div>
        </ScrollArea>
      </Stack>
    </nav>
  );
}

export default Sidebar;
