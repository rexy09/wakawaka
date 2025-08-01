import { AppShell, Box, Container } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { PublicFooter } from "../navs/dashboard/footer/PublicFooter";
import Header from "../navs/dashboard/header/Header";

export default function PublicLayout() {
  // const [opened, { toggle }] = useDisclosure();
  const [opened] = useDisclosure();
  // const { updateUserDevice } = useAuthServices();
  const [_userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>();
  async function requestPermission() {
    //requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // const token = await getToken(messaging, {
      //   vapidKey: Env.APP_VAPID_KEY,
      // });
      // await updateUserDevice(token);

      //We can send token to server
      // console.log("Token generated : ", token);
    } else if (permission === "denied") {
      //notifications are blocked
      alert("You denied for the notification");
    }
  }

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
