import { AppShell, Box, Container } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DasboardFooter from "../navs/dashboard/footer/DasboardFooter";
import Header from "../navs/dashboard/header/Header";
import { useNotificationService } from "../../features/notifications";

export default function DashboardLayout() {
  // const [opened, { toggle }] = useDisclosure();
  const [opened] = useDisclosure();
  const [_userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>();
  const { requestAndUpdateNotificationToken } = useNotificationService();

  // const variable array to save the users location

  // define the function that finds the users geolocation
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    // Request notification permission and update token
    requestAndUpdateNotificationToken();
    getUserLocation();
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
              minHeight: "80vh",
              // padding: "20px",
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
