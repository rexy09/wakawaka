import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUserResponse } from "../../auth/types";
import useApiClient from "../../services/ApiClient";
import { DashboardFilterParameters } from "./stores";

export const useDashboardServices = () => {
  const { sendRequest } = useApiClient();
  const authUser = useAuthUser<IUserResponse>();


  const getOrdersStatistics = async (p: DashboardFilterParameters) => {
    return sendRequest({
      method: "get",
      url: "/stats/order",
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
      },
    });
  };

  const getOngoingOrders = async (p: DashboardFilterParameters) => {
    const url =
      authUser?.user_type == "owner" ? "/owner/order" : "/order";
    return sendRequest({
      method: "get",
      url: url,
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
        state: "started",
      },
    });
  };
  const getOrders = async (p: DashboardFilterParameters, page:number) => {
    const url = authUser?.user_type == "owner" ? "/owner/order" : "/order";
    return sendRequest({
      method: "get",
      url: url,
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
        state: p.state,
        limit: 10,
        page: page,
        tracking_id: p.search,
      },
    });
  };
  const getCancelReasons = async () => {
    const url = "/extra/cancel_reason/";
    return sendRequest({
      method: "get",
      url: url,
     
    });
  };
  const updateOrder = async ({
    state,
    orderId,
    ratings,
    comment,
    reason,
  }: {
    state: string;
    orderId: string;
    ratings?: number;
    comment?: string;
    reason?: string;
  }) => {
    const url =
      authUser?.user_type == "owner"
        ? `/owner/order/${orderId}`
        : `/order/${orderId}`;
    return sendRequest({
      method: "patch",
      url: url,
      data: {
        state: state,
        ratings: ratings,
        comment: comment,
        reason: reason,
      },
    });
  };

  return {
    getOrdersStatistics,
    getOrders,
    getOngoingOrders,
    updateOrder,
    getCancelReasons,
  };
};



