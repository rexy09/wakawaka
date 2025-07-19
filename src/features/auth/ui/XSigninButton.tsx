import { Button, Image } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {  getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import x from "../../../assets/icons/x.png";


export default function XSigninButton() {
  const provider = new TwitterAuthProvider();
  const auth = getAuth();
  const signIn = useSignIn();

  const navigate = useNavigate();

  return (
    <>
      <Button
        radius="md"
        size="lg"
        fullWidth
        variant="default"
        leftSection={<Image src={x}  alt={"facebook"}  h={"26"} radius={'sm'}/>}
        style={{ color: "#414651", fontWeight: 600, fontSize: "16px" }}
        onClick={() => {
          signInWithPopup(auth, provider)
            .then(async (result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential =
                TwitterAuthProvider.credentialFromResult(result);
              const token = credential ? credential.accessToken : null;
              // console.log("token", token);
              // The signed-in user info.
              const user = result.user;
              // IdP data available using getAdditionalUserInfo(result)
              // console.log("user", user);
              if (token && user) {
                const accessToken = await user.getIdToken();
                if (
                  signIn({
                    auth: {
                      token: accessToken,
                      type: "Bearer",
                    },
                    userState: {
                      uid: user.uid,
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
            })
            .catch((error) => {
              // Handle Errors here.
              // const errorCode = error.code;
              const errorMessage = error.message;
              // The email of the user's account used.
              // const email = error.customData.email;
              // The AuthCredential type that was used.
              // const credential =
              //   GoogleAuthProvider.credentialFromError(error);
              // console.log(errorCode);
              // console.log(errorMessage);
              // console.log(email);
              // console.log(credential);
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
