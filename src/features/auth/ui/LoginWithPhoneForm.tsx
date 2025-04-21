import {
  Anchor,
  Button,
  Grid,
  Group,
  PinInput,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { CountrySelector, usePhoneInput } from "react-international-phone";
import { Color, FontFamily } from "../../../common/theme";
import useAuthServices from "../services";
import { IPhoneLoginForm, IUser } from "../types";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import OtpTimerButton from "./OtpTimerButton";
export default function LoginWithPhoneForm() {
  const {
    submitted,
    setSubmitted,
    userLoginWithPhone,
    lginWithPhoneVerifyOTP,
  } = useAuthServices();
  const [otp, setOTP] = useState<boolean>(false);
  const [otpTimer, setOTPTimer] = useState<number>(0);
  const signIn = useSignIn();
  const navigate = useNavigate();

  const { getCargoUserDetails } = useAuthServices();

  const form = useForm<IPhoneLoginForm>({
    initialValues: { phone: "", phoneCountry: "", token: "" },
    validate: {
      phone: (value) =>
        value.trim().length == 0
          ? "Phone number required"
          : value.trim().length < 9
          ? "Phone number must be atleast 9 digits"
          : null,

      ...(otp && {
        token: isNotEmpty("OTP requred"),
      }),
    },
  });

  const phoneInput = usePhoneInput({
    defaultCountry: "tz",
    value: form.values.phoneCountry,
    onChange: (data) => {
      form.setFieldValue("phoneCountry", data.phone);
    },
  });

  const loginWithPhone = () => {
    setSubmitted(true);

    userLoginWithPhone(form.values)
      .then((response) => {
        setSubmitted(false);
        const expires_in = response.data.expires_in;
        setOTPTimer(expires_in);
        setOTP(true);
      })
      .catch((error) => {
        setSubmitted(false);
        if (
          error.response.data.error &&
          typeof error?.response?.data?.error === "string"
        ) {
          notifications.show({
            color: "red",
            title: "Error",
            message: error.response.data.error,
          });
        } else {
          notifications.show({
            color: "red",
            title: "Error",
            message: "Something went wrong!",
          });
        }
      });
  };
  const verifyOTP = () => {
    setSubmitted(true);

    lginWithPhoneVerifyOTP(form.values)
      .then((response) => {
        const access_token = response.data.access_token;
        getCargoUserDetails(access_token)
          .then(function (response) {
            setSubmitted(false);
            const responseData = response.data as IUser;
            if (
              signIn({
                auth: {
                  token: access_token,
                  type: "Bearer",
                },
                userState: responseData,
              })
            ) {
              navigate("/");
            } else {
              navigate("/login");
            }
          })
          .catch(function (_error) {
            setSubmitted(false);
            notifications.show({
              color: "red",
              title: "Error",
              message: "Something went wrong!",
            });
            navigate("/login");
          });

        setSubmitted(false);
      })
      .catch((error) => {
        setSubmitted(false);
        if (
          error.response.data.error &&
          typeof error?.response?.data?.error === "string"
        ) {
          notifications.show({
            color: "red",
            title: "Error",
            message: error.response.data.error,
          });
        } else {
          notifications.show({
            color: "red",
            title: "Error",
            message: "Something went wrong!",
          });
        }
      });
  };
  useEffect(() => {}, []);

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
          otp ? verifyOTP() : loginWithPhone();
        })}
      >
        <Text
          c={Color.BrandBlue}
          size="14px"
          fw={600}
          style={{ lineHeight: "22px" }}
        >
          Phone Number
        </Text>
        <Space h="xs" />
        <Grid grow>
          <Grid.Col span="auto" pr="0px">
            <CountrySelector
              selectedCountry={phoneInput.country.iso2}
              onSelect={(country) => phoneInput.setCountry(country.iso2)}
              renderButtonWrapper={({ children, rootProps }) => (
                <Button
                  {...rootProps}
                  variant="outline"
                  color="#CED4DA"
                  px="4px"
                  mr="8px"
                  radius="md"
                  size="md"
                >
                  {children}
                </Button>
              )}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 8, md: 9, lg: 9 }} pl="0px">
            <TextInput
              withAsterisk
              placeholder="789654321"
              radius="md"
              leftSection={
                <Text c="black" size="md" mt={"2px"}>
                  {phoneInput.phone}
                </Text>
              }
              leftSectionWidth={50}
              error={form.errors.phone}
              value={form.values.phone}
              onChange={(phone) =>
                form.setFieldValue(
                  "phone",
                  phone.target.value.replace(/^0+/, "").replace(/\D/g, "")
                )
              }
              onBlur={() => {
                const isValidInput = /^\d*$/.test(form.values.phone);
                if (!isValidInput) {
                  form.setFieldError("phone_number", "Invalid phone number");
                }
              }}
            />
          </Grid.Col>
        </Grid>
        <Space h="lg" />

        {otp && (
          <>
            <Group justify="start">
              <div>
                <Text
                  c={Color.BrandBlue}
                  size="14px"
                  fw={600}
                  style={{ lineHeight: "22px" }}
                >
                  Enter OTP
                </Text>
                <Space h="xs" />
                <Group justify="start">
                  <PinInput
                    length={6}
                    type="number"
                    oneTimeCode
                    size="md"
                    error={form.errors.token ? true : undefined}
                    onChange={(token) => form.setFieldValue("token", token)}
                  />
                  <OtpTimerButton seconds={otpTimer} resend={loginWithPhone} />
                </Group>

                <Text fz="sm" c="red">
                  {form.errors.token}
                </Text>
              </div>
            </Group>
            <Space h="lg" />
          </>
        )}

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
            {otp ? "Verify" : "Sign In"}
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
