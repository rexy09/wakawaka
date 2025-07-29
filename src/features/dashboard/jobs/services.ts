import {
  addDoc,
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
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import {
  ICommitmentType,
  IJobCategory,
  IJobForm,
  IJobPost,
  IUrgencyLevels,
  JobFilterParameters,
} from "./types";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUser } from "../../auth/types";
import { v4 as uuidv4 } from "uuid";


export const useJobServices = () => {
  const authUser = useAuthUser<IUser>();

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
      // orderBy("datePosted", "desc"),
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
        // id: doc.id,
        // datePosted: data.datePosted.toDate().toString(),
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
          // datePosted: data.datePosted.toDate().toString(),
        };
      });

    return {
      count: dataList.length,
      data: dataList,
      lastDoc: documentSnapshots.docs[documentSnapshots.docs.length - 1],
      firstDoc: documentSnapshots.docs[0],
    };
  };
  const getExploreJobs = async (
    direction: "next" | "prev" | string | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot
  ) => {
    const pageLimit: number = 3;

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
    const dataList = documentSnapshots.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...(data as IJobPost),
          // datePosted: data.datePosted.toDate().toString(),
        };
      });

    return {
      count: dataList.length,
      data: dataList,
      lastDoc: documentSnapshots.docs[documentSnapshots.docs.length - 1],
      firstDoc: documentSnapshots.docs[0],
    };
  };

  const getJob = async (id: string) => {
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
        // datePosted: data.datePosted.toDate().toString(),
      } as IJobPost;
    }
    return undefined;
  };
  const getCatgories = async () => {
    const dataCollection = collection(db, "categories");

    let dataQuery = query(dataCollection);

    const documentSnapshots = await getDocs(dataQuery);
    const dataList = documentSnapshots.docs.map((doc) => {
      const data = doc.data();
      return {
        ...(data as IJobCategory),
      };
    });
    return dataList;
  };
  const getCommitmentTypes = async () => {
    const dataCollection = collection(db, "commitmentTypes");

    let dataQuery = query(dataCollection);

    const documentSnapshots = await getDocs(dataQuery);
    const dataList = documentSnapshots.docs.map((doc) => {
      const data = doc.data();
      return {
        ...(data as ICommitmentType),
      };
    });
    return dataList;
  };
  const getUrgencyLevels = async () => {
    const dataCollection = collection(db, "urgencyLevels");

    let dataQuery = query(dataCollection);

    const documentSnapshots = await getDocs(dataQuery);
    const dataList = documentSnapshots.docs.map((doc) => {
      const data = doc.data();
      return {
        ...(data as IUrgencyLevels),
      };
    });
    return dataList;
  };

  const postJob = async (d: IJobForm, published:boolean) => {
    const dataCollection = collection(db, "jobPosts");
    const uuid = uuidv4();
    const jobData = {
      ...d,
      id:uuid,
      postedByUserId: authUser?.uid,
      published: published,
      isActive: true,
      datePosted: Timestamp.fromDate(new Date()),
    };
    const jobpostRef = await addDoc(dataCollection, jobData);

    return jobpostRef.id;
  };

  return {
    getJobs,
    getJob,
    getRelatedJobs,
    getCatgories,
    getCommitmentTypes,
    getUrgencyLevels,
    postJob,
    getExploreJobs,
  };
};
