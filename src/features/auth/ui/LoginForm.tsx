import {
  Anchor,
  Button,
  Group,
  Space,
  Text,
  TextInput
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useEffect } from "react";
import { Color, FontFamily } from "../../../common/theme";
import useAuthServices from "../services";
import { UserCredentials } from "../types";
import classes from "./css/Input.module.css";
import Env from "../../../config/env";
import { MdPhoneIphone } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const { submitted, setSubmitted } = useAuthServices();
  const navigate = useNavigate();

  const form = useForm<UserCredentials>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: isEmail("Email required"),
    },
  });

  const setValues = () => {
    const values = {
      username: "",
      password: "",
    };
    form.setValues(values);
    form.resetDirty(values);
  };



  const keycloackLogin = async () => {
    setSubmitted(true);

    window.location.href = `${Env.authURL}/login?login_hint=${encodeURIComponent(form.values.username)}`;

    setSubmitted(false);
  };



  useEffect(() => {
    setValues();
  }, []);

  const handleRegistration = () => {
    const registrationUrl =
      `https://accounts.skyconnect.co.tz/realms/flex/protocol/openid-connect/registrations` +
      `?client_id=flex-sample-app` +
      `&response_type=code` +
      `&scope=openid profile email phone offline_access` +
      `&redirect_uri=${window.location.origin}/login`;

    window.location.href = registrationUrl;
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit(() => {
          keycloackLogin();
        })}
      >
        <Text
          c={Color.BrandBlue}
          size="14px"
          fw={600}
          style={{ lineHeight: "22px" }}
        >
          Email
        </Text>
        <Space h="xs" />
        <TextInput
          placeholder="Email address"
          radius={"md"}
          size="md"
          classNames={{ input: classes.input }}
          {...form.getInputProps("username")}
        />

        <Space h="lg" />

        <Group justify="space-between" gap={2}>
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => {
              window.location.href = "https://accounts.skyconnect.co.tz/realms/flex/login-actions/reset-credentials?client_id=flex-sample-app";
            }}
            size="xs"
          >
            <Text size="16px" fw={600} c={Color.PrimaryBlue}>
              Forgot password
            </Text>
          </Anchor>
        </Group>
        <Space h="lg" />

        <Group>
          <Button
            radius="md"
            size="lg"
            fullWidth
            style={{ backgroundColor: Color.DarkBlue }}
            disabled={submitted}
            loading={submitted}
            type="submit"
          >
            Sign In
          </Button>
        </Group>

        <Space h="lg" />
        <Group justify="center" gap={5}>
          <Text
            size="16px"
            fw={400}
            c={Color.BrandBlue}
            style={{ fontFamily: FontFamily.Inter }}
          >
            or
          </Text>
        </Group>
        <Space h="lg" />
        <Group>
          <Button
            radius="md"
            size="lg"
            fullWidth
            variant="default"
            leftSection={<MdPhoneIphone />}
            style={{ color: "#170645" ,fontWeight:400, fontSize: '14px'}}
           onClick={()=>{
             navigate("/login/phone");
           }}
          >
            Sign In with Phone Number
          </Button>
        </Group>
        <Space h="lg" />
        <Group justify="center" gap={5}>
          <Text
            size="16px"
            fw={400}
            c={Color.BrandBlue}
            style={{ fontFamily: "Urbanist" }}
          >
            Don’t have an Account
          </Text>
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => {
              handleRegistration();
            }}
            size="xs"
          >
            <Text size="16px" fw={700} c={Color.PrimaryBlue}>
              Register
            </Text>
          </Anchor>
        </Group>
      </form>
    </>
  );
}

export default LoginForm;
