import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";
import {
  Button,
  createTheme,
  MantineProvider,
  Select,
  TextInput,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import { notifications, Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import '@mantine/tiptap/styles.css';
import { onMessage } from "firebase/messaging";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Icons } from "./common/icons";
import { Color, FontFamily } from "./common/theme";
import { messaging } from "./config/firebase";
import { AuthProvider } from "./features/auth/context/FirebaseAuthContext";
import { useNotificationStore } from "./features/dashboard/notifications/stores";
import { router } from "./routes/Router";
import { register } from "./serviceWorker";
import '@mantine/carousel/styles.css';

register();

const theme = createTheme({
  fontFamily: FontFamily.Inter,
  // primaryColor: "blue",
  cursorType: "pointer",
  components: {
    Button: Button.extend({
      defaultProps: {
        color: Color.PrimaryBlue,
        radius: "md",
        size: "sm",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: "md",
        size: "md",
      },
    }),
    Select: Select.extend({
      defaultProps: {
        radius: "md",
        size: "md",
      },
    }),
  },
});

function App() {
  /* const refresh = createRefresh({
    interval: 10, // The time in sec to refresh the Access token
  refreshApiCallback: async (param) => {
      try {
        const response = await axios.post("/refresh", param, {
          headers: { 'Authorization': `Bearer ${param.authToken}` }
        })
        console.log("Refreshing")
        return {
          isSuccess: true,
          newAuthToken: response.data.token,
          newAuthTokenExpireIn: 10,
          newRefreshTokenExpiresIn: 60
        }
      }
      catch (error) {
        console.error(error)
        return {
          isSuccess: false,
          newAuthToken: ''
        }
      }
    }
  }) */

  const notificationStore = useNotificationStore();

  onMessage(messaging, (payload) => {
    if (payload.notification) {
      notifications.show({
        color: "#e9ecef",
        title: payload.notification.title,
        message: payload.notification.body,
        position: "top-right",
        icon: Icons.notification,
      });
      notificationStore.inc();
    }
  });

  return (
    <>
      <MantineProvider theme={theme}>
        <Notifications />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </MantineProvider>
    </>
  );
}

export default App;

//  nvm use 20
