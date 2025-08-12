import axios from "axios";
import { useState } from "react";
import Env from "../../config/env";
import {
  IPhoneLoginForm,
} from "./types";
import useApiClient from "../services/ApiClient";
// import useApiClient from "../services/ApiClient";

export default function useAuthServices() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { sendRequest } = useApiClient();
  // const authUser = useAuthUser<IUserData>();

  async function getAuthStatus() {
    return axios.get(
      Env.baseURL + "/auth/status",

      {
        withCredentials: true,
      }
    );
  }

  async function getCargoUserDetails(accessToken: string) {
    return axios.get(
      Env.baseURL + "/user/",

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }
  async function userLogin(email: string, password: string) {
    return axios.post(
      Env.baseURL + "/accounts/v2/signin",
      {
        username: email.toLowerCase(),
        password: password,
      },
      {
        headers: {},
      }
    );
  }
  async function userLoginWithPhone(b: IPhoneLoginForm) {
    return axios.post(
      Env.baseURL + "/request-otp",

      {
        phone_number: b.phoneCountry + b.phone,
      }
    );
  }

  async function lginWithPhoneVerifyOTP(b: IPhoneLoginForm) {
    return axios.post(
      Env.baseURL + "/verify-otp",
      {
        phone_number: b.phoneCountry + b.phone,
        code: b.token,
      },
      {
        headers: {},
      }
    );
  }
 


  const updateUserDevice = async (token: string) => {
    const url = "/user/";
    return sendRequest({
      method: "patch",
      url: url,
      data: {
        token,
        device_type: "web",
      },
    });
  };

  const deleteUserDevice = async (token: string) => {
    const url = "/device/" + token;
    return sendRequest({
      method: "delete",
      url: url,
    });
  };

  return {
    userLogin,
    submitted,
    setSubmitted,
    getCargoUserDetails,
    getAuthStatus,
    updateUserDevice,
    deleteUserDevice,
    userLoginWithPhone,
    lginWithPhoneVerifyOTP,
  };
}
