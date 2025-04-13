import {
  collection,
  DocumentSnapshot,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { db } from "../../../config/firebase";
import { IUserResponse } from "../../auth/types";
import useApiClient from "../../services/ApiClient";
import {
  IBidForm,
  IJobPost,
  JobFilterParameters
} from "./types";

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

  const getJobs = async (
    _p: JobFilterParameters,
    direction: "next" | "prev" | string | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot
  ) => {
    console.log("getJobs", direction, startAfterDoc, endBeforeDoc);

    const pageLimit: number = 6;
    const totalQuerySnapshot = query(
      collection(db, "jobPosts"),
      where("isActive", "==", true)
    );
    const count = await getCountFromServer(totalQuerySnapshot);

    const dataCollection = collection(db, "jobPosts");

    let dataQuery = query(
      dataCollection,
      orderBy("datePosted", "desc"),
      where("isActive", "==", true),
      limit(pageLimit)
    );
    if (direction === "next" && startAfterDoc) {
      // For next direction, start after the provided document
      dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
      // For previous direction, end before the provided document and limit to last
      dataQuery = query(
        dataCollection,
        orderBy("datePosted", "desc"),
        endBefore(endBeforeDoc),
        limitToLast(pageLimit)
      );
    }

    // Get snapshot of documents based on the final query
    const documentSnapshots = await getDocs(dataQuery);
    const dataList = documentSnapshots.docs.map((doc) => {
      const data = doc.data();
      return {
        ...(data as IJobPost),
        datePosted: data.datePosted.toDate().toString(),
      };
    });

    return {
      count: count.data().count,
      data: dataList,
      lastDoc: documentSnapshots.docs[documentSnapshots.docs.length - 1],
      firstDoc: documentSnapshots.docs[0],
    };
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
  const getOrderBid = async (order: string) => {
    const url = `/operation/bidding?order=${order}`;
    return sendRequest({
      method: "get",
      url: url,
    });
  };

  return {
    getOrdersStatistics,
    getJobs,
    getOrder,
    postBid,
    getOrderBid,
  };
};
