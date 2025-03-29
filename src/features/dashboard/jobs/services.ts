import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useApiClient from "../../services/ApiClient";
import { IBidForm, JobFilterParameters } from "./types";
import { IUserResponse } from "../../auth/types";

export const useJobServices = () => {
  const { sendRequest } = useApiClient();
  const authUser = useAuthUser<IUserResponse>();


  const getOrdersStatistics = async (p: JobFilterParameters) => {
    return sendRequest({
      method: "get",
      url: "/stats/order",
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
        state: "bidding",
      },
    });
  };

  const getOrders = async (p: JobFilterParameters, page: number) => {
    const url = "/owner/order";
    return sendRequest({
      method: "get",
      url: url,
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
        limit: 10,
        page: page,
        state: "bidding",
        bidded: false,
        ordering: "-created_at",
        tracking_id: p.search,
      },
    });
  };

  const getOrder = async (id: string) => {
    const url =
      authUser?.user_type == "owner" ? "/owner/order/" + id : "/order/" + id;
    return sendRequest({
      method: "get",
      url: url,
      params: {},
    });
  };

  const postBid = async (d: IBidForm, order: string) => {
    const url = "/operation/bidding";
    return sendRequest({
      method: "post",
      url: url,
      data: {
        price: d.price,
        order: order,
      },
    });
  };
  const getOrderBid = async ( order: string) => {
    const url = `/operation/bidding?order=${order}`;
    return sendRequest({
      method: "get",
      url: url,
     
    });
  };

  return {
    getOrdersStatistics,
    getOrders,
    getOrder,
    postBid,
    getOrderBid,
  };
};
