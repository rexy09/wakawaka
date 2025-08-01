import { BackgroundImage, Box, Button, Container, Grid, Group, Image, Paper, Space, Text } from "@mantine/core";
import jobior_banner_1 from "../../assets/img/jobior_banner_1.png";
import jobior_banner_2 from "../../assets/img/jobior_banner_2.png";
import apple_button from "../../assets/img/apple_button.svg";
import google_button from "../../assets/img/google_button.svg";
import apple_button2 from "../../assets/img/apple_button2.svg";
import google_button2 from "../../assets/img/google_button2.svg";
import image_1 from "../../assets/img/image_1.png";
import waka from "../../assets/img/waka.gif";
import { useNavigate } from "react-router-dom";
import ExploreSection from "../../features/dashboard/home/ui/ExploreSection";
import { TypeAnimation } from 'react-type-animation';
import { useMediaQuery } from "@mantine/hooks";


export default function DashboardPage() {
  const navigate = useNavigate();
  const matches2 = useMediaQuery("(min-width: 1024px)");


  return (
    <>
      <Image src={jobior_banner_1} />
      <Space h={50} />

      <Group justify="center" align="center">
        <Text c="#1B3227" size={matches2?"64px":"44px"} fw={700}>
          Daywaka for
        </Text>
        <Text c="#9066D9" size="64px" fw={700} visibleFrom="md" >
          <TypeAnimation
            cursor={false}
            sequence={[
              'Everyone',
              1000,
              'You',
              1000,
              'The hustlers',
              1000,
              'Dreamers',
              1000,
              'Gig workers',
              1000,
              'Tanzania',
              1000,
              'Wasaka kazi',
              1000,
              'Mabingwa',
              1000,
              'Go-getters',
              1000,
              'Kesho',
              1000,
              'All',
              1000,
            ]}
            speed={30}
            repeat={Infinity}
          />
        </Text>
      </Group>
      <Text c="#9066D9" size={matches2 ? "64px" : "44px"} fw={700} hiddenFrom="md" ta={"center"} mt="md" h={64}>
        <TypeAnimation
          cursor={false}
          sequence={[
            'Everyone',
            1000,
            'You',
            1000,
            'The hustlers',
            1000,
            'Dreamers',
            1000,
            'Gig workers',
            1000,
            'Tanzania',
            1000,
            'Wasaka kazi',
            1000,
            'Mabingwa',
            1000,
            'Go-getters',
            1000,
            'Kesho',
            1000,
            'All',
            1000,
          ]}
          speed={30}
          repeat={Infinity}
        />
      </Text>
      <Text c="#1B3227" size="24px" fw={400} ta={"center"} mt="md">
        Browse millions of Jobs for you.
      </Text>
      <Group justify="center" align="center" mt="lg" gap="md">
        <Image src={apple_button} />
        <Image src={google_button} />
      </Group>
      <Space h={50} />
      <Image src={jobior_banner_2} />
      <Container size="xl" mt="-60px" mb={50}>
        <BackgroundImage
          src={waka}
          radius="12px"
        >
          <Box h={480} p={"xl"}>
            <Space h="100" />
            <Box pl={"xl"}>
              <Text c="white" fw={700} size={matches2 ? "38px" : "20px"} >
                10 ways to increase your
              </Text>
              <Text c="white" fw={700} size={matches2 ? "38px" : "20px"} mt={"sm"} >
                chances of getting hired
              </Text>
              <Button mt={"md"} color="#525FE1" onClick={() => {
                navigate("/jobs")
              }} >
                Find Jobs
              </Button>
            </Box>
          </Box>
        </BackgroundImage>
        <Space h={100} />
        <Text c="#111212" size="26px" fw={700} >
          Explore
        </Text>
        <Space h={"lg"} />

        <ExploreSection />
        <Space h={70} />

        <Grid gutter={0}>
          <Grid.Col span={{ base: 12, sm: 4,}} bg={"#151F42"} p={"xl"} m={0} mih={260}>
            <div className="p-5">

              <Text c="white" size="20px" fw={600} >
                Get The App
              </Text>
              <Space h={"md"} />
              <Text c="white" size="12px" fw={600} >
                Experience the power of Jobior anywhere with our quick   apply feature.
              </Text>
              <Space h={"md"} />
              <Group align="center" mt="lg" gap="md">
                <Image src={apple_button2} />
                <Image src={google_button2} />
              </Group>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 8, }} p={0} m={0} mih={260}>
            <BackgroundImage src={image_1} h="100%">
            </BackgroundImage>
          </Grid.Col>
        </Grid>
        <Space h={50} />

        <Paper bg={"#F9F9F9"} p={"xl"} withBorder radius="20px" shadow="md">
          <Group justify="space-between" align="center">
            <div>

              <Text c="#111212" size="24px" fw={700} >
                Endless Jobs. Epic prices.
              </Text>
              <Space h={"md"} />
              <Text c="#111212" size="14  px" fw={400} >
                Browse millions of Jobs for you.
              </Text>
            </div>
            <Button color="#151F42" size="lg" onClick={() => {
              navigate("/jobs")
            }} >
              Find Jobs
            </Button>
          </Group>

        </Paper>


      </Container>

    </>
  );
}
