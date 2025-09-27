import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../../features/auth/context/FirebaseAuthContext";
import logo_white from "../../../../assets/logo_white.svg";
import { Icons } from "../../../icons";
import classes from "./Header.module.css";
import AccountMenu from "./components/AccountMenu";
import NavLinkButton from "./components/NavLinkButton";

export default function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Box bg={"#151F42"}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Image h={36} src={logo_white} />

          <Group h="100%" gap={"xs"} visibleFrom="md">
            <NavLinkButton label={"Home"} to={"/"} />
            <NavLinkButton label={"Find Jobs"} to={"/jobs"} />
            <NavLinkButton label={"Post Job"} to={"/post_job"} />
            <NavLinkButton label={"My Jobs"} to={"/my_jobs"} />
            <NavLinkButton label={"Career"} to={"/career"} />
          </Group>

          <Group visibleFrom="md">
            {isAuthenticated ? (
              <>
                {/* {Icons.message} */}
                {Icons.notification}
                <AccountMenu />
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </Group>
          <Group hiddenFrom="md">
            {isAuthenticated && (
              <>
                {Icons.notification}
                <AccountMenu />
              </>
            )}
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="md"
              color="white"
            />
          </Group>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <Group>
            {" "}
            <Image h={30} src={logo_white} />{" "}
            {isAuthenticated && <>{/* {Icons.message} */}</>}
          </Group>
        }
        hiddenFrom="md"
        zIndex={1000000}
        styles={{
          header: {
            backgroundColor: "#151F42",
            height: "100px",
          },
        }}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          {/* <Divider my="sm" /> */}

          <NavLink
            to="/"
            className={classes.link}
            onClick={closeDrawer}
          >
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            className={classes.link}
            onClick={closeDrawer}
          >
            Jobs
          </NavLink>
          <NavLink
            to="/post_job"
            className={classes.link}
            onClick={closeDrawer}
          >
            Post Job
          </NavLink>
          <NavLink
            to="/my_jobs"
            className={classes.link}
            onClick={closeDrawer}
          >
            My Jobs
          </NavLink>
          <NavLink
            to="/career"
            className={classes.link}
            onClick={closeDrawer}
          >
            Career
          </NavLink>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {isAuthenticated ? (
              <></>
            ) : (
              <>
                <Button
                  variant="default"
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
