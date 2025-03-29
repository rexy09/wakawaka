import useApiClient from "../../services/ApiClient";
import { BidFilterParameters } from "./types";

export const useDocumentServices = () => {
  const { sendRequest } = useApiClient();

  const getDocuments = async (p: BidFilterParameters, page: number) => {
    return sendRequest({
      method: "get",
      url: "/extra/document",
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
        limit: 10,
        page: page,
      },
    });
  };

  return {
    getDocuments,
  };
};
