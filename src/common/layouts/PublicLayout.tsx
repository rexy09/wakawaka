import { AppShell, Box, Container } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { PublicFooter } from "../navs/dashboard/footer/PublicFooter";
import Header from "../navs/dashboard/header/Header";

export default function PublicLayout() {
  const [opened] = useDisclosure();
  const [_userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>();
  async function requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    requestPermission();
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
        <Container size="fluid" p={0}>
          <Box
            style={{
              minHeight: "80vh",
            }}
          >
            <Outlet />
          </Box>
          <PublicFooter />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
