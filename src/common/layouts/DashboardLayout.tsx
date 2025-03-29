import { AppShell, Box, Container } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { getToken } from "firebase/messaging";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Env from "../../config/env";
import { messaging } from "../../config/firebase";
import useAuthServices from "../../features/auth/services";
import DasboardFooter from "../navs/dashboard/DasboardFooter";
import HeaderMenu from "../navs/dashboard/header/HeaderMenu";
import Header from "../navs/dashboard/header/Header";

export default function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { updateUserDevice } = useAuthServices();
  async function requestPermission() {
    //requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: Env.APP_VAPID_KEY,
      });
      await updateUserDevice(token);

      //We can send token to server
      // console.log("Token generated : ", token);
    } else if (permission === "denied") {
      //notifications are blocked
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <AppShell
      header={{ height: 100 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
      padding="0"
      style={{
        backgroundColor: "#f9f9f9",
      }}
    >
      <AppShell.Header h={'100px'} withBorder={false}>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xl">
          <Box
            style={{
              minHeight: "90vh",
              padding: "20px",
            }}
          >
            <Outlet />
          </Box>
        <DasboardFooter />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
