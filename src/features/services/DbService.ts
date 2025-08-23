import { collection } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function useDbService() {
  const CACHE_DURATION = 5 * 60 * 1000;
  const usersRef = collection(db, "users");
  const hiredJobsRef = collection(db, "hiredJobs");
  const jobPostsRef= collection(db, "jobPosts");

  return { CACHE_DURATION, usersRef, hiredJobsRef, jobPostsRef };
}
