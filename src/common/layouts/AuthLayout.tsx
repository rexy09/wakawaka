import {
  ActionIcon,
  BackgroundImage,
  Container,
  Grid,
  Group,
  Space,
  Stack,
  Text
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import cars from "../../assets/carousel/cars.png";
import city from "../../assets/carousel/city.png";
import container from "../../assets/carousel/container.png";
import majani from "../../assets/carousel/majani.png";
import timber from "../../assets/carousel/timber.png";
import { Icons } from "../icons";
import { Color } from "../theme";

function AuthLayout() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [city, cars, timber, container, majani];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex: number) => (prevIndex + 1) % images.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex: number) => (prevIndex + 1) % images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex: number) => (prevIndex - 1 + images.length) % images.length
    );
  };
  return (
    <Container fluid style={{ height: "100vh" }} m={0} p={0}>
      <Grid gutter={0} m={0} p={0}>
        <Grid.Col span={6} p={"2vh"} visibleFrom="md">
          <BackgroundImage src={images[currentImageIndex]} radius={"32px"}>
            <Stack h={"96vh"} justify="flex-end" gap="0">
              <div
                style={{
                  background:
                    "linear-gradient( to bottom,#1D123A00 0%, #17064580 50%",
                  borderRadius: "0px 0px 32px 32px",
                  padding: "0px 50px",
                }}
              >
                <Space h="100px" />

                <div>
                  <Text
                    size="26px"
                    fw={600}
                    c={"white"}
                    style={{ lineHeight: "26px" }}
                  >
                    “Connecting Cargo Owners and
                  </Text>
                  <Text
                    size="26px"
                    fw={600}
                    c={"white"}
                    style={{ lineHeight: "26px" }}
                  >
                    Transporters across Regions.”
                  </Text>
                  <Space h="lg" />

                  <Group justify="space-between">
                    <Group gap={5}>
                      <Text c={"#FFFFFF"} size="14px" fw={400}>
                        {currentImageIndex + 1}
                      </Text>
                      <Text c={Color.White} size="14px" fw={400}>
                        of
                      </Text>
                      <Text c={Color.White} size="14px" fw={400}>
                        {images.length}
                      </Text>
                    </Group>

                    <Group>
                      <ActionIcon
                        variant="transparent"
                        onClick={prevImage}
                        size="lg"
                      >
                        {Icons.circle_arrow_left}
                      </ActionIcon>
                      <ActionIcon
                        variant="transparent"
                        onClick={nextImage}
                        size="lg"
                      >
                        {Icons.circle_arrow_right}
                      </ActionIcon>
                    </Group>
                  </Group>
                </div>
                <Space h="50px" />
              </div>
            </Stack>
          </BackgroundImage>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }} px={"md"}>
          <Outlet />
        </Grid.Col>
        <Grid.Col span={12} p={0} hiddenFrom="md">
          <BackgroundImage src={images[currentImageIndex]} >
            <Stack h={"100vh"} justify="flex-end" gap="0">
              <div
                style={{
                  background:
                    "linear-gradient( to bottom,#1D123A00 0%, #17064580 50%",
                  padding: "0px 10px",
                }}
              >
                <Space h="100px" />

                <div>
                  <Text
                    size="26px"
                    fw={600}
                    c={"white"}
                    style={{ lineHeight: "26px" }}
                  >
                    “Connecting Cargo Owners and
                  </Text>
                  <Text
                    size="26px"
                    fw={600}
                    c={"white"}
                    style={{ lineHeight: "26px" }}
                  >
                    Transporters across Regions.”
                  </Text>
                  <Space h="lg" />

                  <Group justify="space-between">
                    <Group gap={5}>
                      <Text c={"#FFFFFF"} size="14px" fw={400}>
                        {currentImageIndex + 1}
                      </Text>
                      <Text c={Color.White} size="14px" fw={400}>
                        of
                      </Text>
                      <Text c={Color.White} size="14px" fw={400}>
                        {images.length}
                      </Text>
                    </Group>

                    <Group>
                      <ActionIcon
                        variant="transparent"
                        onClick={prevImage}
                        size="lg"
                      >
                        {Icons.circle_arrow_left}
                      </ActionIcon>
                      <ActionIcon
                        variant="transparent"
                        onClick={nextImage}
                        size="lg"
                      >
                        {Icons.circle_arrow_right}
                      </ActionIcon>
                    </Group>
                  </Group>
                </div>
                <Space h="50px" />
              </div>
            </Stack>
          </BackgroundImage>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default AuthLayout;
