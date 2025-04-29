import {
    Box,
    Burger,
    Button,
    Center,
    Divider,
    Drawer,
    Group,
    Image,
    ScrollArea,
    UnstyledButton
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SetStateAction } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../icons";
import classes from "./Header.module.css";
import AccountMenu from "./components/AccountMenu";
import NavLinkButton from "./components/NavLinkButton";


export default function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);
    const [_linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    // const theme = useMantineTheme();




    return (
        <Box bg={"#151F42"}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Image h={30} w={30} radius="md" />

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
                            label={"Business"}
                            to={"/business"}
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
                        <NavLinkButton
                            label={"About"}
                            to={"/bout"}
                            setOpened={function (_value: SetStateAction<boolean>): void {
                                throw new Error("Function not implemented.");
                            }}
                        />

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

                    <Group visibleFrom="sm">
                        {isAuthenticated ? (
                            <>
                                {Icons.message}
                                {Icons.notification}
                                <AccountMenu />
                            </>
                        ) : (
                            <>
                                <Button variant="default" onClick={() => {
                                    navigate("/signin");
                                }}>Sign in</Button>
                                <Button onClick={() => {
                                    navigate("/signup");
                                }}>Sign up</Button>
                            </>
                        )}
                    </Group>

                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        hiddenFrom="sm"
                    />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Divider my="sm" />

                    <a href="/" className={classes.link}>
                        Home
                    </a>
                    <a href="/jobs" className={classes.link}>
                        Jobs
                    </a>
                    <UnstyledButton className={classes.link} onClick={toggleLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Features
                            </Box>
                            {/* <IconChevronDown size={16} color={theme.colors.blue[6]} /> */}
                        </Center>
                    </UnstyledButton>
                    <a href="#" className={classes.link}>
                        Learn
                    </a>
                    <a href="#" className={classes.link}>
                        Academy
                    </a>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default">Log in</Button>
                        <Button>Sign up</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
