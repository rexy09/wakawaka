import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/FirebaseAuthContext";

interface Props {
  allowedRights: string[];
}

const AuthRights = ({ allowedRights }: Props) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const itemsExist = [user.email].some((right: any) =>
    allowedRights.includes(right)
  );

  return itemsExist ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AuthRights;
