import {
  Anchor,
  Group,
  Space,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Color } from "../../../common/theme";
import AppleSigninButton from "./AppleSigninButton";
import GoogleSigninButton from "./GoogleSigninButton";

function LoginForm() {
  const navigate = useNavigate();

  return (
    <>
      <GoogleSigninButton />
      <Space h="md" />
      <AppleSigninButton />
      <Space h="md" />
      <Space h="lg" />
      <Group justify="center" gap={5}>
        <Text size="14px" fw={400} c={Color.Text1}>
          Don't have an account?
        </Text>
        <Anchor
          component="button"
          type="button"
          c="dimmed"
          onClick={() => {
            navigate("/signup");
          }}
          size="xs"
        >
          <Text size="14px" fw={600} c={Color.DarkBlue}>
            Sign up
          </Text>
        </Anchor>
      </Group>
      <Space h="md" />
    </>
  );
}

export default LoginForm;
