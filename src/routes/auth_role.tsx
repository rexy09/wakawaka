import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUser } from "../features/auth/types";
interface Props {
  allowedRights: string[];
}
const AuthRights = ({ allowedRights }: Props) => {
  const authUser = useAuthUser<IUser>();


  const location = useLocation();
  
  const itemsExist = [authUser?.email].some((right: any) =>
    allowedRights.includes(right)
  );

  return itemsExist ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }}  />
  );
};

export default AuthRights;
