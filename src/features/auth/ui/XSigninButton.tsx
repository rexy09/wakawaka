import { Button, Image } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import x from "../../../assets/icons/x.png";
import { useAuthSignIn } from "../hooks/useAuthSignIn";

export default function XSigninButton() {
  const provider = new TwitterAuthProvider();
  const auth = getAuth();
  const { handleAuthSignIn } = useAuthSignIn();


  return (
    <>
      <Button
        radius="md"
        size="lg"
        fullWidth
        variant="default"
        leftSection={<Image src={x} alt={"x"} h={"26"} radius={"sm"} />}
        style={{ color: "#414651", fontWeight: 600, fontSize: "16px" }}
        onClick={() => {
          signInWithPopup(auth, provider)
            .then(async (result) => {
              const credential =
                TwitterAuthProvider.credentialFromResult(result);
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
        Continue with X
      </Button>
    </>
  );
}
