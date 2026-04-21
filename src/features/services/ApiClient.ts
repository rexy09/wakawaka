import axios from "axios";
import { useAuth } from "../auth/context/FirebaseAuthContext";
import Env from "../../config/env";

interface RequestOptions {
  method: "get" | "post" | "put" | "patch" | "delete";
  url: string;
  data?: Object;
  params?: Object;
  headers?: any;
}

export default function useApiClient() {
  const { getIdToken, signOutUser } = useAuth();

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response ? error.response.status : null;

      if (status === 401) {
        try {
          await signOutUser();
        } catch {
          // Sign-out failed; continue with rejection
        }
        window.location.href = "/signin";
      }

      return Promise.reject(error);
    }
  );

  async function sendRequest({
    method,
    url,
    data,
    params,
    headers,
  }: RequestOptions) {
    // Get Firebase ID token
    const token = await getIdToken();
    const authHeader = token ? `Bearer ${token}` : undefined;

    return axios({
      method: method,
      url: Env.baseURL + url,
      data: data,
      params: params,
      headers: {
        ...(authHeader && { Authorization: authHeader }),
        'X-Requested-With': 'XMLHttpRequest',
        ...headers
      },
    });
  }

  return { sendRequest };
}
