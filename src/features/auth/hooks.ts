import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUserResponse } from "./types";

export default function useUserAuth(){

  const authUser = useAuthUser<IUserResponse>();

  function hasRight(right: string) {
    const rightExist = [authUser?.user_type].some(
      (item:any) => item === right
    );
    return rightExist;
  }


return { hasRight };
};
