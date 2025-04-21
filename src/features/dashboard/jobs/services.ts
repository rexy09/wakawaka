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
import { db } from "../../../config/firebase";
import useApiClient from "../../services/ApiClient";
import { IBidForm, IJobPost, JobFilterParameters } from "./types";

export const useJobServices = () => {
  const { sendRequest } = useApiClient();

  const getJobs = async (
    _p: JobFilterParameters,
    direction: "next" | "prev" | string | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot
  ) => {
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
  const getRelatedJobs = async (
    category: string,
    excludeId: string,
    direction: "next" | "prev" | string | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot
  ) => {
    const pageLimit: number = 6;
    

    const dataCollection = collection(db, "jobPosts");

    let dataQuery = query(
      dataCollection,
      orderBy("datePosted", "desc"),
      where("isActive", "==", true),
      where("category", "==", category),
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
        // where("id", "!=", excludeId),

        endBefore(endBeforeDoc),
        limitToLast(pageLimit)
      );
    }

    // Get snapshot of documents based on the final query
    const documentSnapshots = await getDocs(dataQuery);
    const dataList = documentSnapshots.docs
      .filter((doc) => doc.id !== excludeId) // Exclude the document with the specified ID
      .map((doc) => {
      const data = doc.data();
      return {
        ...(data as IJobPost),
        datePosted: data.datePosted.toDate().toString(),
      };
      });

    return {
      count:dataList.length,
      data: dataList,
      lastDoc: documentSnapshots.docs[documentSnapshots.docs.length - 1],
      firstDoc: documentSnapshots.docs[0],
    };
  };

  const getJob = async (id: string) => {
    console.log("getJob", id);

    const dataCollection = collection(db, "jobPosts");

    let dataQuery = query(
      dataCollection,
      where("id", "==", id),
      where("isActive", "==", true),
      limit(1)
    );
    const querySnapshot = await getDocs(dataQuery);

    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        ...data,
        datePosted: data.datePosted.toDate().toString(),
      } as IJobPost;
    }
    return undefined;
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
    getJobs,
    getJob,
    getRelatedJobs,
    postBid,
    getOrderBid,
  };
};


