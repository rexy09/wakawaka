import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {  getAuth, OAuthProvider, signInWithPopup } from "firebase/auth";
import { FaApple } from "react-icons/fa";
import { useAuthSignIn } from "../hooks/useAuthSignIn";


export default function AppleSigninButton() {
  const provider = new OAuthProvider('apple.com');
  const auth = getAuth();
  const { handleAuthSignIn } = useAuthSignIn();


  return (
    <>
      <Button
        radius="md"
        size="lg"
        fullWidth
        variant="default"
        leftSection={<FaApple size={26}/>}
        style={{ color: "#414651", fontWeight: 600, fontSize: "16px" }}
        onClick={() => {
          signInWithPopup(auth, provider)
            .then(async (result) => {
              const credential =
                OAuthProvider.credentialFromResult(result);
              const token = credential ? credential.accessToken : null;
              const user = result.user;
              if (token && user) {
                const accessToken = await user.getIdToken();
                await handleAuthSignIn(accessToken, user);

              }
            })
            .catch((error) => {
              const errorMessage = error.message;
              notifications.show({
                title: `Error`,
                color: "red",
                message: `${errorMessage}`,
                position: "bottom-left",
              });
            });
        }}
      >
        Continue with Apple
      </Button>
    </>
  );
}
