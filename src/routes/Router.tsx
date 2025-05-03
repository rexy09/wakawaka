import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DashboardLayout from "../common/layouts/DashboardLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import { NotFound } from "../pages/NotFound";
import JobPage from "../pages/dashboard/JobPage";
import JobDetailsPage from "../pages/dashboard/JobDetailsPage";
import AuthLayout from "../common/layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import PostJobPage from "../pages/dashboard/PostJobPage";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={
          // <RequireAuth fallbackPath={"/login"}>
          <DashboardLayout />
          // </RequireAuth>
        }
        // errorElement={<ServerError />}
      >
        <Route index path="/" element={<DashboardPage />} />
        <Route index path="/jobs" element={<JobPage />} />
        <Route index path="/jobs/:id" element={<JobDetailsPage />} />

        {/* 
        <Route element={<AuthRights allowedRights={["owner"]} />}>
          <Route index path="/company" element={<CompanyPage />} />
        </Route>
        <Route index path="/order/:id" element={<CargoDetailsPage />} />
        <Route index path="/bids" element={<BidPage />} />
        <Route index path="/bids/:id" element={<BidDetailsPage />} />
        <Route index path="/documents" element={<DocumentPage />} />
        <Route index path="/eve" element={<EvePage />} />
        <Route index path="/notifications" element={<NotificationPage />} />
        <Route index path="/settings" element={<SettingsPage />} />
        <Route index path="/reports" element={<ReportsPage />} />
        <Route index path="/billing" element={<BillingPage />} />
        <Route index path="/billing/:id" element={<BillingDetailsPage />} /> */}
      </Route>
      <Route
        element={
          <RequireAuth fallbackPath={"/signin"}>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index path="/post_job" element={<PostJobPage />} />
      </Route>

      {/* <Route element={<RequireAuth fallbackPath={"/login"}>
        <AuthLayout />
      </RequireAuth>
      }>
        <Route path="/account_type" element={<AccountTypePage />} />
      </Route>
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/login/phone" element={<LoginWithPhonePage />} />
         */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);
