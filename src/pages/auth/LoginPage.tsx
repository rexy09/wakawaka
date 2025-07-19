import { Center, Image, Space, Text } from "@mantine/core";
import LoginForm from "../../features/auth/ui/LoginForm";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  return (
    <div>

      <Center maw={"100%"} h={"100vh"} >
        <div className="w-[480px]">
          <Image
            w={100}
            src={logo}
            mx={"auto"}
            alt="logo"
            radius={"lg"}
          />
          <Space h="md" />
          <Text size="30px" fw={600} c={"#181D27"} style={{ lineHeight: "38px" }}>Welcome back </Text>
          <Text size="16px" fw={400} c={"#535862"} style={{ lineHeight: "24px" }}>Please enter your details.</Text>
          <Space h="md" />
          <LoginForm />
        </div>
      </Center>

    </div>
  );
}
