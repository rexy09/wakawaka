import { notifications } from "@mantine/notifications";
import { User } from "firebase/auth";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import { useProfileServices } from "../../dashboard/profile/services";
import { IAuthUser } from "../types";
import { useNotificationService } from "../../notifications/useNotificationService";

interface AuthSignInOptions {
  successRedirect?: string;
  errorRedirect?: string;
  completeProfileRedirect?: string;
  fallbackPhotoURL?: string;
}

export const useAuthSignIn = (options: AuthSignInOptions = {}) => {
  const {
    successRedirect = "/jobs",
    errorRedirect = "/login",
    completeProfileRedirect = "/complete_profile",
  } = options;

  const navigate = useNavigate();
  const signIn = useSignIn();
  const { getUserData } = useProfileServices();
  const { requestAndUpdateNotificationToken } = useNotificationService();

  const handleAuthSignIn = async (
    accessToken: string,
    firebaseUser: User,
    additionalUserData?: Partial<IAuthUser>
  ) => {
    try {
      const userData = await getUserData(firebaseUser.uid);

      if (!userData) {
        if (
          signIn({
            auth: {
              token: accessToken,
              type: "Bearer",
            },
            userState: {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName,
              avatarURL: firebaseUser.photoURL,
            },
          })
        ) {
          requestAndUpdateNotificationToken();
          navigate(completeProfileRedirect);
        } else {
          navigate("/login");
        }

        return { success: false, reason: "profile_incomplete" };
      }

      // Prepare user state with fallback values
      const userState: IAuthUser = {
        id: userData.id,
        uid: userData.uid,
        email: userData.email || firebaseUser.email || "",
        fullName: userData.fullName || firebaseUser.displayName || "",
        avatarURL: userData.avatarURL || firebaseUser.photoURL || null,
        role: userData.role,
        isVerified: userData.isVerified,
        userType: userData.userType,
        // Merge any additional user data
        ...additionalUserData,
      };

      // Attempt to sign in
      const signInSuccess = signIn({
        auth: {
          token: accessToken,
          type: "Bearer",
        },
        userState,
      });

      if (signInSuccess) {
        navigate(successRedirect);
        return { success: true, userData: userState };
      } else {
        navigate(errorRedirect);
        return { success: false, reason: "signin_failed" };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      notifications.show({
        title: "Authentication Error",
        color: "red",
        message: `Failed to authenticate: ${errorMessage}`,
        position: "bottom-left",
      });

      return {
        success: false,
        reason: "error",
        error: errorMessage,
      };
    }
  };

  return {
    handleAuthSignIn,
  };
};
