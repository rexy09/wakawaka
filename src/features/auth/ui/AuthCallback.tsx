import { Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import sana_anaimation from "../../../assets/sana_anaimation.mp4";
import useAuthServices from "../services";
import { IUserResponse } from "../types";
export default function AuthCallback() {
  const navigate = useNavigate();
  
  const [_loading, setLoading] = useState<boolean>(true);
  const signIn = useSignIn();
  const { getCargoUserDetails, getAuthStatus } = useAuthServices();

  const checkAuth = async () => {
    try {
      const authResponse = await getAuthStatus();
      if (authResponse.data.isAuthenticated) {
        getCargoUserDetails(authResponse.data.accessToken)
          .then(function (response) {
            setLoading(false);
            const responseData = response.data as IUserResponse;
            if (
              signIn({
                auth: {
                  token: authResponse.data.accessToken,
                  type: "Bearer",
                },
                userState: responseData,
              })
            ) {
              if (responseData.user_type==='none') {
                navigate("/account_type");
                
              } else {
                navigate("/");
              }
            } else {
              navigate("/login");
            }
          })
          .catch(function (_error) {
            setLoading(false);
            notifications.show({
              color: "red",
              title: "Error",
              message: "Something went wrong!",
            });
            navigate("/login");
          });
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Something went wrong!",
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Group justify="center" maw={800}>
        <video
          src={sana_anaimation}
          loop
          autoPlay
          muted
          style={{ width: '100%' }}
        >
          Your browser does not support the video tag.
        </video>
      </Group>
    </>
  );
}
