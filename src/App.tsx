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
import { notifications, Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import AuthProvider from "react-auth-kit/AuthProvider";
import createStore from "react-auth-kit/createStore";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Color, FontFamily } from "./common/theme";
import { router } from "./routes/Router";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import { Libraries, LoadScript } from "@react-google-maps/api";
import Env from "./config/env";
import { register } from "./serviceWorker";
import { onMessage } from "firebase/messaging";
import { messaging } from "./config/firebase";
import { useNotificationStore } from "./features/dashboard/notifications/stores";
import { Icons } from "./common/icons";

register();

const theme = createTheme({
  fontFamily: FontFamily.Satoshi,
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
  const store = createStore({
    authName: "_auth",
    authType: "cookie",
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === "https:",
    // refresh: refresh
  });
  const libraries: Libraries = ["places", "maps"];

  return (
    <>
      <LoadScript googleMapsApiKey={Env.googleMapsApiKey} libraries={libraries}>
        <MantineProvider theme={theme}>
          <Notifications />
          <AuthProvider store={store}>
            <RouterProvider router={router} />
          </AuthProvider>
        </MantineProvider>
      </LoadScript>
    </>
  );
}

export default App;

//  nvm use 20
