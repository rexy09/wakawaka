// import useAuthUser from "react-auth-kit/hooks/useAuthUser";
// import { IUserResponse } from "../../auth/types";
import useApiClient from "../../services/ApiClient";
import { ReportFilterParameters } from "./types";

export const useReportServices = () => {
  const { sendRequest } = useApiClient();
  // const authUser = useAuthUser<IUserResponse>();


  const getOrdersStatistics = async (p: ReportFilterParameters) => {
    return sendRequest({
      method: "get",
      url: "/stats/order",
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
      },
    });
  };

  

  return {
    getOrdersStatistics,
  };
};
