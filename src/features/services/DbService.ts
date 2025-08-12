import { collection } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function useDbService() {
  const usersRef = collection(db, "users");
  const CACHE_DURATION = 5 * 60 * 1000;

  return {CACHE_DURATION, usersRef };
}
