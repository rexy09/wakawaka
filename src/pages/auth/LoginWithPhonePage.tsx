import { Center, Image, Space, Text } from "@mantine/core";
import sana_logo from "../../assets/sana_logo.svg";
import { Color } from "../../common/theme";
import LoginWithPhoneForm from "../../features/auth/ui/LoginWithPhoneForm";

export default function LoginWithPhonePage() {
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
          <Text
            size="18px"
            fw={400}
            c={"#8692A6"}
            style={{ lineHeight: "28px", fontFamily: "Urbanist" }}
          >
            Login with phone number
          </Text>
          <Space h="md" />
          <LoginWithPhoneForm />
         

        </div>
      </Center>

    </div>
  );
}
