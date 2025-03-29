import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import Env from "../../config/env";
import { useNavigate } from "react-router-dom";

interface RequestOptions {
  method: "get" | "post" | "put" | "patch" | "delete";
  url: string;
  data?: Object;
  params?: Object;
  headers?: any;
}

export default function useApiClient() {
  const authHeader = useAuthHeader();
  const navigate = useNavigate();

  // const signOut = useSignOut();
  // const { notifyError } = userTostify();
  // const { userLogin } = useLoginServices();
  // const signIn = useSignIn();
  // const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);

  // const errorHandlerSwitch = (message: string) => {
  //   switch (message) {
  //     case "author_id : Required property, author_id : Expected string":
  //       return true;
  //     case "author_id : Required property":
  //       return true;
  //     default:
  //       return false;
  //   }
  // };

  // Add a request interceptor
  /*  axios.interceptors.request.use(
    async function (config) {
      // Do something before request is sent

      if (
        config.params &&
        typeof config.params === "object" &&
        config.params.hasOwnProperty("author_id")
      ) {
        if (config.params.author_id === undefined) {
         
          try {
            const user = auth.currentUser;
            // console.log(user);
            const token = await user?.getIdToken(true);
            const response = await userLogin(user?.email!, token!);
            const apiData = response.data as ApiResponse;
            const data = apiData.data as IUserData;
            if (
              signIn({
                auth: {
                  token: token!,
                  type: "Bearer",
                },
                refresh: token,
                userState: data,
              })
            ) {
              config.params.author_id = data.id;
              config.headers.Authorization = "Bearer " + token;
              return config;
            } else {
              signOut();
              navigate("/login", { replace: true });
            }
          } catch (error) {
            // console.error("Error fetching new token:", error);
          }
        }
      }

      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
 */
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      // console.log(error.response.data);
      // const data = error.response.data;
      const status = error.response ? error.response.status : null;
      // console.log("Error Status: ", status);

      if (status === 400) {
        // Handle unauthorized access
        // if (errorHandlerSwitch(data.message as string)) {
        //   // notifyError("Unauthorized");
        //   // signOut();
        //   // navigate("/login", { replace: true });
        // }
      } else if (status === 401) {
        // Handle unauthorized access
        // notifyError("Unauthorized");
        // signOut();
        // navigate("/login", { replace: true });
        
      //  if (
      //    error.response.data.type &&
      //    typeof error?.response?.data?.type === "string" &&
      //    error.response.data.type == "keycloak"
      //  ) {
      //    return;
      //  }
      //   navigate("/auth/callback");
      } else if (status === 403) {
        // Handle unauthorized access
      } else if (status === 404) {
        // Handle not found errors
      } else {
        // Handle other errors
        // notifyError("Error something went wrong!");
      }

      return Promise.reject(error);
    }
  );

  /*  const refreshUserSession = async () => {
   
    try {
      const user = auth.currentUser;
      // console.log(user);
      const token = await user?.getIdToken(true);
      const response = await userLogin(user?.email!, token!);
      const apiData = response.data as ApiResponse;
      const data = apiData.data as IUserData;
      if (
        signIn({
          auth: {
            token: token!,
            type: "Bearer",
          },
          refresh: token,
          userState: data,
        })
      ) {
        // console.log("Refresh successfuly");
      } else {
        signOut();
        navigate("/login", { replace: true });
      }
    } catch (error) {
      // console.error("Error fetching new token:", error);
    }
  }; */

  async function sendRequest({
    method,
    url,
    data,
    params,
    headers,
  }: RequestOptions) {
    return axios({
      method: method,
      url: Env.baseURL + url,
      data: data,
      params: params,
      headers: { Authorization: authHeader, ...headers },
    });
  }

  return { sendRequest };
}
