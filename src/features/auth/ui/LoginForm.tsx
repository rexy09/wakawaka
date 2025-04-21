import {
  Anchor,
  Button,
  Group,
  PasswordInput,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../common/icons";
import { Color } from "../../../common/theme";
import useAuthServices from "../services";
import { UserCredentials } from "../types";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { notifications } from "@mantine/notifications";
import { GoogleAuthProvider } from "firebase/auth";
import useSignIn from "react-auth-kit/hooks/useSignIn";

function LoginForm() {
  const { submitted, setSubmitted } = useAuthServices();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const signIn = useSignIn();

  const navigate = useNavigate();

  const form = useForm<UserCredentials>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: isEmail("Email required"),
      password: isNotEmpty("Password required"),
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

  const loginWithEmail = async () => {
    setSubmitted(true);
    signInWithEmailAndPassword(auth, form.values.username, form.values.password)
      .then((userCredential) => {
        // Signed in
        console.log("userCredential", userCredential);
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        console.log(error.code);

        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/invalid-credential") {
          notifications.show({
            title: `Error`,
            color: "red",
            message: `Invalid email or password`,
            position: "bottom-left",
          });
        } else {
          notifications.show({
            title: `Error`,
            color: "red",
            message: `${errorMessage}`,
            position: "bottom-left",
          });
        }
      });

    setSubmitted(false);
  };

  useEffect(() => {
    setValues();
  }, []);

  return (
    <>
      <form
        onSubmit={form.onSubmit(() => {
          loginWithEmail();
        })}
      >
        <Text c={"#414651"} size="14px" fw={500} style={{ lineHeight: "20px" }}>
          Email
        </Text>
        <Space h="xs" />
        <TextInput
          placeholder="Email address"
          radius={"md"}
          size="md"
          {...form.getInputProps("username")}
        />

        <Space h="md" />
        <Text c={"#414651"} size="14px" fw={500} style={{ lineHeight: "20px" }}>
          Password
        </Text>
        <Space h="xs" />
        <PasswordInput
          placeholder="Password"
          radius={"md"}
          size="md"
          {...form.getInputProps("password")}
        />

        <Space h="lg" />

        <Group justify="flex-end" gap={2}>
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => { }}
            size="xs"
          >
            <Text size="16px" fw={600} c={"#151F42"}>
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
            Sign in
          </Button>
        </Group>

        <Space h="lg" />
        {/* <Group justify="center" gap={5}>
          <Text
            size="16px"
            fw={400}
            c={Color.BrandBlue}
            style={{ fontFamily: FontFamily.Inter }}
          >
            or
          </Text>
        </Group>
        <Space h="lg" /> */}
        <Group>
          <Button
            radius="md"
            size="lg"
            fullWidth
            variant="default"
            leftSection={Icons.google}
            style={{ color: "#414651", fontWeight: 600, fontSize: "16px" }}
            onClick={() => {
              signInWithPopup(auth, provider)
                .then(async (result) => {
                  // This gives you a Google Access Token. You can use it to access the Google API.
                  const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                  const token = credential ? credential.accessToken : null;
                  console.log("token", token);
                  // The signed-in user info.
                  const user = result.user;
                  // IdP data available using getAdditionalUserInfo(result)
                  console.log("user", user);
                  if (token && user) {
                    const accessToken = await user.getIdToken();
                    if (
                      signIn({
                        auth: {
                          token: accessToken,
                          type: "Bearer",
                        },
                        userState: {
                          email: user.email,
                          name: user.displayName,
                          photoUrl: user.photoURL,
                        },
                      })
                    ) {
                      navigate("/");
                    } else {
                      navigate("/login");
                    }
                  }

                  navigate("/");
                })
                .catch((error) => {
                  // Handle Errors here.
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  // The email of the user's account used.
                  const email = error.customData.email;
                  // The AuthCredential type that was used.
                  const credential =
                    GoogleAuthProvider.credentialFromError(error);
                  console.log(errorCode);
                  console.log(errorMessage);
                  console.log(email);
                  console.log(credential);
                  notifications.show({
                    title: `Error`,
                    color: "red",
                    message: `${errorMessage}`,
                    position: "bottom-left",
                  });
                });
            }}
          >
            Sign in with Google
          </Button>
        </Group>
        <Space h="lg" />
        <Group justify="center" gap={5}>
          <Text size="14px" fw={400} c={Color.Text1}>
            Don’t have an account?
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
      </form>
    </>
  );
}

export default LoginForm;
