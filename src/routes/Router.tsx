import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DashboardLayout from "../common/layouts/DashboardLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import { NotFound } from "../pages/NotFound";
import JobsPage from "../pages/dashboard/JobsPage";
import JobDetailsPage from "../pages/dashboard/JobDetailsPage";
import AuthLayout from "../common/layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import PostJobPage from "../pages/dashboard/PostJobPage";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
import PublicLayout from "../common/layouts/PublicLayout";
import AccountDeletionRequestPage from "../pages/auth/AccountDeletionRequestPage";
import CompleteProfilePage from "../pages/dashboard/CompleteProfilePage";
import MyJobsPage from "../pages/dashboard/MyJobsPage";
import ServerError from "../pages/ServerError";
import AppliedJobDetailsPage from "../pages/dashboard/AppliedJobDetailsPage";
import PostedJobDetailsPage from "../pages/dashboard/PostedJobDetailsPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={
          <PublicLayout />
        }
        errorElement={<ServerError />}
      >
        <Route index path="/" element={<DashboardPage />} />
      </Route>
      <Route
        element={
          <DashboardLayout />
        }
        errorElement={<ServerError />}
      >
        <Route index path="/jobs" element={<JobsPage />} />
        <Route index path="/jobs/:id" element={<JobDetailsPage />} />
      </Route>
      <Route
        element={
          <RequireAuth fallbackPath={"/signin"}>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index path="/complete_profile" element={<CompleteProfilePage />} />
        <Route index path="/post_job" element={<PostJobPage />} />
        <Route index path="/my_jobs" element={<MyJobsPage />} />
        <Route index path="/my_jobs/:id/applied" element={<AppliedJobDetailsPage />} />
        <Route index path="/my_jobs/:id/posted" element={<PostedJobDetailsPage />} />
        <Route index path="/profile" element={<ProfilePage />} />
        <Route index path="/delete/account/request" element={<AccountDeletionRequestPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/login/phone" element={<LoginWithPhonePage />} /> */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  ), {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);
