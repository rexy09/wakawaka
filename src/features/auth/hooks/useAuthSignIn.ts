import { notifications } from "@mantine/notifications";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/FirebaseAuthContext";
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
    // errorRedirect = "/login",
    completeProfileRedirect = "/complete_profile",
  } = options;

  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { getUserData } = useProfileServices();
  const { requestAndUpdateNotificationToken } = useNotificationService();

  const handleAuthSignIn = async (
    _accessToken: string,
    firebaseUser: User,
    additionalUserData?: Partial<IAuthUser>
  ) => {
    try {
      const userData = await getUserData(firebaseUser.uid);

      if (!userData) {
        const tempUserData: IAuthUser = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          fullName: firebaseUser.displayName || "",
          avatarURL: firebaseUser.photoURL || null,
          role: null,
          isVerified: false,
          userType: null,
          country: null,
          currency: null,
          dateAdded: new Date().toISOString(),
        };

        signIn(tempUserData, firebaseUser);
        requestAndUpdateNotificationToken();
        navigate(completeProfileRedirect);

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
        country: userData.country || null,
        currency: userData.currency || null,
        dateAdded: userData.dateAdded,
        // Merge any additional user data
        ...additionalUserData,
      };

      // Sign in with Firebase auth context
      signIn(userState, firebaseUser);
      navigate(successRedirect);
      return { success: true, userData: userState };
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
