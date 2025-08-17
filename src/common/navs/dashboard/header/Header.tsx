import {
    Box,
    Burger,
    Button,
    Divider,
    Drawer,
    Group,
    Image,
    ScrollArea
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SetStateAction } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useNavigate } from "react-router-dom";
import logo_white from "../../../../assets/logo_white.svg";
import { Icons } from "../../../icons";
import classes from "./Header.module.css";
import AccountMenu from "./components/AccountMenu";
import NavLinkButton from "./components/NavLinkButton";

export default function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    return (
        <Box bg={"#151F42"}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Image h={36} src={logo_white} />

                    <Group h="100%" gap={"xs"} visibleFrom="md">
                        <NavLinkButton
                            label={"Home"}
                            to={"/"}
                            setOpened={function (_value: SetStateAction<boolean>): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                        <NavLinkButton
                            label={"Find Jobs"}
                            to={"/jobs"}
                            setOpened={function (_value: SetStateAction<boolean>): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                        <NavLinkButton
                            label={"Post Job"}
                            to={"/post_job"}
                            setOpened={function (_value: SetStateAction<boolean>): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                        <NavLinkButton
                            label={"My Jobs"}
                            to={"/my_jobs"}
                            setOpened={function (_value: SetStateAction<boolean>): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                        <NavLinkButton
                            label={"Career"}
                            to={"/career"}
                            setOpened={function (_value: SetStateAction<boolean>): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                        {/* <NavLinkButton
              label={"About"}
              to={"/bout"}
              setOpened={function (_value: SetStateAction<boolean>): void {
                throw new Error("Function not implemented.");
              }}
            /> */}

                        {/* <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                            <HoverCard.Target>
                                <a href="#" className={classes.link}>
                                    <Center inline>
                                        <Box component="span" mr={5}>
                                            Features
                                        </Box>
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                                <Group justify="space-between" px="md">
                                    <Text fw={500}>Features</Text>
                                    <Anchor href="#" fz="xs">
                                        View all
                                    </Anchor>
                                </Group>

                                <Divider my="sm" />

                                <SimpleGrid cols={2} spacing={0}>
                                    {links}
                                </SimpleGrid>

                                <div className={classes.dropdownFooter}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={500} fz="sm">
                                                Get started
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Their food sources have decreased, and their numbers
                                            </Text>
                                        </div>
                                        <Button variant="default">Get started</Button>
                                    </Group>
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard> */}
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

                    <a href="/" className={classes.link}>
                        Home
                    </a>
                    <a href="/jobs" className={classes.link}>
                        Jobs
                    </a>
                    <a href="/post_job" className={classes.link}>
                        Post Job
                    </a>
                    <a href="/my_jobs" className={classes.link}>
                        My Jobs
                    </a>
                    <a href="/career" className={classes.link}>
                        Career
                    </a>


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
