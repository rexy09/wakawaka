import axios from "axios";
import { useState } from "react";
import Env from "../../config/env";
import {
  IPhoneLoginForm,
  ISenderForm,
  ITransporterForm,
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
 

  const postOwnerDetails = async (d: ITransporterForm) => {
    const url = "/owner/details";

    const formData = new FormData();
    formData.append("full_name", d.full_name);
    formData.append("phone_number", d.phone_number);
    formData.append("role", d.identification);

    formData.append("company", d.company);
    formData.append("company_phone", d.company_phone);
    formData.append("years_of_experience", d.years_of_experience);
    if (d.logo) {
      formData.append("logo", d.logo);
    }
    if (d.registration_certificate) {
      formData.append("registration_certificate", d.registration_certificate);
    }

    return sendRequest({
      method: "post",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  const postSenderDetails = async (d: ISenderForm) => {
    const url = "/sender/details";

    const formData = new FormData();
    formData.append("full_name", d.full_name);
    formData.append("phone_number", d.phone_number);
    formData.append("role", d.identification);

    if (d.profile_img) {
      formData.append("profile_img", d.profile_img);
    }

    return sendRequest({
      method: "post",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

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
    postOwnerDetails,
    postSenderDetails,
    updateUserDevice,
    deleteUserDevice,
    userLoginWithPhone,
    lginWithPhoneVerifyOTP,
  };
}
