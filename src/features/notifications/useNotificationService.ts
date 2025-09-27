import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import Env from "../../config/env";
import { messaging } from "../../config/firebase";
import { useAuth } from "../auth/context/FirebaseAuthContext";
import useDbService from "../services/DbService";

export const useNotificationService = () => {
  const { usersRef } = useDbService();
  const { user: authUser } = useAuth();

  const getFCMToken = async (): Promise<string | null> => {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: Env.APP_VAPID_KEY,
        });
        // console.log("FCM Token generated:", token);
        return token;
      } else {
        console.log("Notification permission denied");
        return null;
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  };

  const updateUserNotificationToken = async (uid: string, token: string) => {
    try {
      const docRef = doc(usersRef, uid);
      
      // First get the current user data to check existing fcmTokens
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("User document not found");
      }
      
      const userData = docSnap.data();
      const currentTokens = userData?.fcmTokens || [];
      
      // Check if token already exists in fcmTokens array
      if (!currentTokens.includes(token)) {
        // Add the new token to existing tokens
        const updatedTokens = [...currentTokens, token];
        
        await updateDoc(docRef, {
          notifToken: token,
          fcmTokens: updatedTokens,
          dateUpdated: Timestamp.fromDate(new Date()),
        });
        // console.log("New notification token added to array and notifToken updated");
      } else {
        // Token exists, just update notifToken (current active token)
        await updateDoc(docRef, {
          notifToken: token,
          dateUpdated: Timestamp.fromDate(new Date()),
        });
        // console.log("Notification token already exists in array, updated notifToken only");
      }
    } catch (error) {
      console.error("Error updating notification token:", error);
      throw new Error(`Failed to update notification token: ${error}`);
    }
  };

  const requestAndUpdateNotificationToken = async () => {
    try {
      if (!authUser?.uid) {
        console.log("No authenticated user found");
        return;
      }

      // Get FCM token
      const token = await getFCMToken();
      if (!token) {
        console.log("No FCM token received");
        return;
      }

      // Update user's notification token
      await updateUserNotificationToken(authUser.uid, token);
      // console.log("User notification token updated successfully");
      
      return token;
    } catch (error) {
      console.error("Error requesting and updating notification token:", error);
    }
  };

  return {
    getFCMToken,
    updateUserNotificationToken,
    requestAndUpdateNotificationToken,
  };
};
