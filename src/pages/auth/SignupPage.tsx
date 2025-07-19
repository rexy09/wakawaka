import { Center, Image, Space, Text } from "@mantine/core";
import logo from "../../assets/logo.png";
import SignupForm from "../../features/auth/ui/SignupForm";

export default function SignupPage() {
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
          <Text size="30px" fw={600} c={"#181D27"} style={{ lineHeight: "38px" }}>Signup for Free</Text>
          <Text size="16px" fw={400} c={"#535862"} style={{ lineHeight: "24px" }}>Meet your dream job</Text>
          <Space h="md" />
          <SignupForm />
        </div>
      </Center>
    </div>
  );
}
