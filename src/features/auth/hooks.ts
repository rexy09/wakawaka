import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUser } from "./types";

export default function useUserAuth(){

  const authUser = useAuthUser<IUser>();

  function hasRight(right: string) {
    const rightExist = [authUser?.email].some(
      (item:any) => item === right
    );
    return rightExist;
  }


return { hasRight };
};
