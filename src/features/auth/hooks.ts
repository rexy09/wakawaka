import { useAuth } from "./context/FirebaseAuthContext";

export default function useUserAuth(){

  const { user: authUser } = useAuth();

  function hasRight(right: string) {
    const rightExist = [authUser?.email].some(
      (item:any) => item === right
    );
    return rightExist;
  }


return { hasRight };
};
