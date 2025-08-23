import { Button } from "@mantine/core";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Icons } from "../../../common/icons";
import { useAuthSignIn } from "../hooks/useAuthSignIn";

export default function GoogleSigninButton() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const { handleAuthSignIn } = useAuthSignIn();


  return (
    <>
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
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential ? credential.accessToken : null;
              const user = result.user;

              if (token && user) {
                const accessToken = await user.getIdToken();
                await handleAuthSignIn(accessToken, user);
              }
            })
            .catch((error) => {
              const errorMessage = error.message;
              console.error(errorMessage);
              
              // notifications.show({
              //   title: `Error`,
              //   color: "red",
              //   message: `${errorMessage}`,
              //   position: "bottom-left",
              // });
            });
        }}
      >
        Continue with Google
      </Button>
    </>
  );
}
