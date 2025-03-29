import useApiClient from "../../services/ApiClient";
import {  ICompanyForm, IUserForm } from "./types";

export const useSettingsServices = () => {
  const { sendRequest } = useApiClient();

  const updateUser = async (d: IUserForm) => {
    const url = "/user/";

    const formData = new FormData();
    formData.append("full_name", d.full_name);
    formData.append("phone_number", d.phone_number);

    return sendRequest({
      method: "patch",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
 
  const updateUserProfileImage = async (d: IUserForm) => {
    const url = "/user";

    const formData = new FormData();
    formData.append("full_name", d.full_name);
    formData.append("profile_img", d.profile_img ?? "");

    return sendRequest({
      method: "patch",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const getUser = async () => {
    const url = "/user";
    return sendRequest({
      method: "get",
      url: url,
    });
  };
  const getYearsOfExperince = async () => {
    const url = "/extra/years_of_experience/";
    return sendRequest({
      method: "get",
      url: url,
    });
  };
  const getOwnerDetails = async () => {
    const url = "/owner/details/";
    return sendRequest({
      method: "get",
      url: url,
    });
  };
   const updateOwnerDetails = async (d: ICompanyForm, ownerId:string) => {
     const url = "/owner/details/" + ownerId;

     const formData = new FormData();
     formData.append("company", d.company);
     formData.append("company_phone", d.company_phone);
     formData.append("office_location", d.office_location);
     formData.append("website", d.website);
     formData.append("years_of_experience", d.years_of_experience);
     if (d.logo) {
       formData.append("logo", d.logo);
     }
     if (d.registration_certificate) {
       formData.append("registration_certificate", d.registration_certificate);
     }

     return sendRequest({
       method: "patch",
       url: url,
       data: formData,
       headers: {
         "Content-Type": "multipart/form-data",
       },
     });
   };
 
  

  return {
    getUser,
    updateUser,
    updateUserProfileImage,
    updateOwnerDetails,
    getOwnerDetails,
    getYearsOfExperince,
  };
};
