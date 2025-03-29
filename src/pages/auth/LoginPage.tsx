import { Center, Image, Space, Text } from "@mantine/core";
import LoginForm from "../../features/auth/ui/LoginForm";
import sana_logo from "../../assets/sana_logo.svg";
import { Color } from "../../common/theme";

export default function LoginPage() {
  return (
    <div>

      <Center maw={"100%"} h={"100vh"} >
        <div className="w-[480px]">
          <Image
            w={155}
            src={sana_logo}
          />
          <Space h="md" />
          <Text size="40px" fw={700} c={Color.BrandBlue} style={{ lineHeight: "48px", letterSpacing: "-0.8px" }}>Welcome back </Text>
          <Space h="md" />
          <LoginForm />
        </div>
      </Center>

    </div>
  );
}
