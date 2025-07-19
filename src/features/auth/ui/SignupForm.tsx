import {
  Anchor,
  Group,
  Space,
  Text
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Color } from "../../../common/theme";
import { ISignupUserForm } from "../types";
import AppleSigninButton from "./AppleSigninButton";
import GoogleSigninButton from "./GoogleSigninButton";
import XSigninButton from "./XSigninButton";

function SignupForm() {
  // const auth = getAuth();
  const navigate = useNavigate();
  // const { submitted, setSubmitted } = useAuthServices();
  // const signIn = useSignIn();

  const form = useForm<ISignupUserForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Email required"),
      password: isNotEmpty("Password required"),
    },
  });

  const setValues = () => {
    const values = {
      email: "",
      password: "",
    };
    form.setValues(values);
    form.resetDirty(values);
  };

  // const signup = async () => {
  //   setSubmitted(true);

  //   createUserWithEmailAndPassword(
  //     auth,
  //     form.values.email,
  //     form.values.password
  //   )
  //     .then(async (userCredential) => {
  //       setSubmitted(false);
  //       const user = userCredential.user;
  //       if (user) {
  //         const accessToken = await user.getIdToken();
  //         if (
  //           signIn({
  //             auth: {
  //               token: accessToken,
  //               type: "Bearer",
  //             },
  //             userState: {
  //               email: user.email,
  //               name: user.displayName,
  //               photoUrl: user.photoURL,
  //             },
  //           })
  //         ) {
  //           navigate("/");
  //         } else {
  //           navigate("/login");
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       setSubmitted(false);
  //       const errorCode = error.code;
  //       // const errorMessage = error.message;
  //       notifications.show({
  //         title: `Error`,
  //         color: "red",
  //         message: `${errorCode.split("/")[1].replace(/-/g, " ")}`,
  //         position: "bottom-left",
  //       });
  //     });


  // };

  useEffect(() => {
    setValues();
  }, []);

  return (
    <>
      {/* <form
        onSubmit={form.onSubmit(() => {
          signup();
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
          {...form.getInputProps("email")}
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
            Sign up
          </Button>
        </Group>
      </form> */}
      <GoogleSigninButton />
      <Space h="md" />
      <AppleSigninButton />
      <Space h="md" />
      {/* <FacebookSigninButton />
        <Space h="md" /> */}
      <XSigninButton />

      <Space h="lg" />

      <Group justify="center" gap={2}>
        <Text size="14px" fw={400} c={Color.Text1}>
          Already have an Account?
        </Text>
        <Anchor
          component="button"
          type="button"
          c="dimmed"
          onClick={() => {
            navigate("/signin");
          }}
          size="xs"
        >
          <Text size="14px" fw={600} c={Color.DarkBlue}>
            Sign in
          </Text>
        </Anchor>
      </Group>

      <Space h="md" />
    </>
  );
}

export default SignupForm;
