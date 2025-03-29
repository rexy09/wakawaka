import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUserResponse } from "../../auth/types";
import useApiClient from "../../services/ApiClient";
import { BidFilterParameters } from "./types";

export const useBidServices = () => {
  const { sendRequest } = useApiClient();
  const authUser = useAuthUser<IUserResponse>();

  const getBidStatistics = async (p: BidFilterParameters) => {
    return sendRequest({
      method: "get",
      url: "/stats/bid",
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
      },
    });
  };

  const getOperationBidding = async (p: BidFilterParameters, page: number) => {
    return sendRequest({
      method: "get",
      url: "/operation/bidding",
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
        limit: 10,
        page: page,
        state: p.state,
        tracking_id: p.search,
      },
    });
  };
  const cancelBid = async (bidId: string) => {
    const url = `/operation/bidding/${bidId}/`;
    return sendRequest({
      method: "patch",
      url: url,
      data: {
        state: "cancelled",
      },
    });
  };
  const acceptBid = async (bidId: string) => {
    const url = `/operation/bidding/${bidId}/`;
    return sendRequest({
      method: "patch",
      url: url,
      data: {
        state: "accepted",
      },
    });
  };
  const declineBid = async (bidId: string) => {
    const url = `/operation/bidding/${bidId}/`;
    return sendRequest({
      method: "patch",
      url: url,
      data: {
        state: "declined",
      },
    });
  };

  const assignDriverBid = async (driverId: string, bidId: string) => {
    const url = `/operation/bidding/${bidId}`;

    return sendRequest({
      method: "patch",
      url: url,

      data: {
        state: "accepted",
        driver: driverId,
      },
    });
  };

  const getAvailableDrivers = async (page: number) => {
    const url = `/owner/driver?page=${page}`;
    return sendRequest({
      method: "get",
      url: url,
      params: {
        is_active: false,
        assigned_vehicle: true,
        limit: 100,
      },
    });
  };
  const getBiddedOrders = async (p: BidFilterParameters, page: number) => {
    const url = authUser?.user_type == "owner" ? "/owner/order" : "/order";
    return sendRequest({
      method: "get",
      url: url,
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
        limit: 10,
        page: page,
        state: "bidding",
        bidded: true,
        tracking_id: p.search,
      },
    });
  };
  return {
    getBidStatistics,
    getOperationBidding,
    cancelBid,
    acceptBid,
    declineBid,
    getAvailableDrivers,
    assignDriverBid,
    getBiddedOrders,
  };
};
