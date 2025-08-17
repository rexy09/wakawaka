import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../config/firebase";
import { IUser } from "../../auth/types";
import {
  ICommitmentType,
  IJobApplication,
  IJobCategory,
  IJobForm,
  IJobPost,
  ISavedJob,
  IUrgencyLevels,
} from "./types";
import { JobFilterParameters } from "./stores";
import Env from "../../../config/env";

export const useJobServices = () => {
  const authUser = useAuthUser<IUser>();

  const getJobs = async (
    p: JobFilterParameters,
    direction: "next" | "prev" | string | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot
  ) => {
    const pageLimit: number = 6;
    const jobPostsCollection = collection(db, "jobPosts");
    const totalQueryConstraints = [where("isActive", "==", true)];

    if (p.category !== undefined && p.category !== null && p.category !== "") {
      totalQueryConstraints.push(where("category", "==", p.category));
    }
    if (p.urgency !== undefined && p.urgency !== null && p.urgency !== "") {
      totalQueryConstraints.push(where("urgency", "==", p.urgency));
    }
    if (
      p.commitment !== undefined &&
      p.commitment !== null &&
      p.commitment !== ""
    ) {
      totalQueryConstraints.push(where("commitment", "==", p.commitment));
    }
    const totalQuerySnapshot = query(
      jobPostsCollection,
      ...totalQueryConstraints
    );
    const count = await getCountFromServer(totalQuerySnapshot);

    const dataCollection = collection(db, "jobPosts");

    const dataQueryConstraints = [
      orderBy("datePosted", "desc"),
      where("isActive", "==", true),
    ];
    if (p.category !== undefined && p.category !== null && p.category !== "") {
      dataQueryConstraints.push(where("category", "==", p.category));
    }
    if (p.urgency !== undefined && p.urgency !== null && p.urgency !== "") {
      dataQueryConstraints.push(where("urgency", "==", p.urgency));
    }
    if (
      p.commitment !== undefined &&
      p.commitment !== null &&
      p.commitment !== ""
    ) {
      dataQueryConstraints.push(where("commitment", "==", p.commitment));
    }

    let dataQuery = query(
      dataCollection,
      ...dataQueryConstraints,
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
    const pageLimit: number = 10;

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
    const dataList = documentSnapshots.docs.map((doc) => {
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

  const postJob = async (d: IJobForm, published: boolean) => {
    const dataCollection = collection(db, "jobPosts");
    const uuid = uuidv4();
    const jobData = {
      ...d,
      id: uuid,
      postedByUserId: authUser?.uid,
      published: published,
      isActive: true,
      datePosted: Timestamp.fromDate(new Date()),
    };
    const jobpostRef = await addDoc(dataCollection, jobData);

    return jobpostRef.id;
  };

  const postJobApplication = async (jobId: string, coverLetter: string) => {
    const jobRef = doc(db, "jobPosts", jobId);
    const dataCollection = collection(jobRef, "applications");
    const date = new Date().toISOString();
    if (!authUser?.uid) {
      throw new Error("User is not authenticated");
    }
    const jobApplicationData = {
      id: `${jobId}_${authUser?.uid}_${Timestamp.fromDate(
        new Date()
      ).toMillis()}`,
      jobId: jobId,
      applicantName: authUser?.fullName,
      attachments: [],
      avatarURL: authUser?.avatarURL,
      coverLetter: coverLetter,
      feedback: null,
      dateApplied: date,
      lastUpdated: date,
      dateAdded: Timestamp.fromDate(new Date()),
      dateUpdated: Timestamp.fromDate(new Date()),
      isProduction: Env.isProduction,
      resumeUrl: null,
      status: "pending",
      uid: authUser?.uid,
    } as unknown as IJobApplication;
    const applicationRef = await addDoc(dataCollection, jobApplicationData);
    return applicationRef.id;
  };

  const userAppliedForJob = async (
    jobId: string,
    userId: string
  ): Promise<boolean> => {
    const jobRef = doc(db, "jobPosts", jobId);
    const applicationsCollection = collection(jobRef, "applications");
    const queryConstraints = [
      where("uid", "==", userId),
      where("jobId", "==", jobId),
      where("status", "==", "pending"),
    ];
    const querySnapshot = await getDocs(
      query(applicationsCollection, ...queryConstraints)
    );  
    return querySnapshot.docs.length > 0;
  };

  const getSavedJobs = async (
    userId: string,
    direction: "next" | "prev" | string | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot
  ) => {
    const pageLimit: number = 6;
    if (!userId) {
      throw new Error("User ID is required");
    }

    const savedJobsCollection = collection(db, "savedJobs");
    
    // Get total count
    const totalQueryConstraints = [where("userId", "==", userId)];
    const totalQuerySnapshot = query(savedJobsCollection, ...totalQueryConstraints);
    const count = await getCountFromServer(totalQuerySnapshot);

    // Build query for paginated data
    const dataQueryConstraints = [
      orderBy("dateAdded", "desc"),
      where("userId", "==", userId),
    ];

    let dataQuery = query(
      savedJobsCollection,
      ...dataQueryConstraints,
      limit(pageLimit)
    );

    if (direction === "next" && startAfterDoc) {
      dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
      dataQuery = query(
        savedJobsCollection,
        orderBy("dateAdded", "desc"),
        where("userId", "==", userId),
        endBefore(endBeforeDoc),
        limitToLast(pageLimit)
      );
    }

    const querySnapshot = await getDocs(dataQuery);
    
    // Extract job details directly from saved jobs documents
    const jobsWithDetails: IJobPost[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as ISavedJob;
      return data.jobDetails;
    });

    return {
      count: count.data().count,
      data: jobsWithDetails,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      firstDoc: querySnapshot.docs[0],
    };
  };

  const saveJob = async (jobId: string) => {
    if (!authUser?.uid) {
      throw new Error("User is not authenticated");
    }

    const savedJobsCollection = collection(db, "savedJobs");
    const date = new Date().toISOString();
    const savedJobId = `${authUser.uid}_${jobId}`;
    
    // Check if job is already saved
    const existingQuery = query(
      savedJobsCollection,
      where("userId", "==", authUser.uid),
      where("jobId", "==", jobId)
    );
    const existingDocs = await getDocs(existingQuery);
    
    if (existingDocs.docs.length > 0) {
      throw new Error("Job is already saved");
    }

    // Get the full job details to include in the saved job document
    const jobDetails = await getJob(jobId);
    if (!jobDetails) {
      throw new Error("Job not found");
    }

    const savedJobData = {
      id: savedJobId,
      jobId: jobId,
      userId: authUser.uid,
      jobDetails: jobDetails,
      dateAdded: date,
      dateUpdated: date,
      isProduction: Env.isProduction,
    };
    
    const savedJobRef = await addDoc(savedJobsCollection, savedJobData);
    return savedJobRef.id;
  };

  const unsaveJob = async (jobId: string) => {
    if (!authUser?.uid) {
      throw new Error("User is not authenticated");
    }

    const savedJobsCollection = collection(db, "savedJobs");
    const queryConstraints = [
      where("userId", "==", authUser.uid),
      where("jobId", "==", jobId)
    ];
    
    const querySnapshot = await getDocs(
      query(savedJobsCollection, ...queryConstraints)
    );
    
    if (querySnapshot.docs.length === 0) {
      throw new Error("Saved job not found");
    }

    // Delete all matching saved job documents (should be only one)
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return true;
  };

  const isJobSaved = async (jobId: string): Promise<boolean> => {
    if (!authUser?.uid) {
      return false;
    }

    const savedJobsCollection = collection(db, "savedJobs");
    const queryConstraints = [
      where("userId", "==", authUser.uid),
      where("jobId", "==", jobId)
    ];
    
    const querySnapshot = await getDocs(
      query(savedJobsCollection, ...queryConstraints)
    );
    
    return querySnapshot.docs.length > 0;
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
    postJobApplication,
    userAppliedForJob,
    getSavedJobs,
    saveJob,
    unsaveJob,
    isJobSaved,
  };
};
