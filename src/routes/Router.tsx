import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DashboardLayout from "../common/layouts/DashboardLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import { NotFound } from "../pages/NotFound";
import JobPage from "../pages/dashboard/JobPage";

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
        {/* <Route element={<AuthRights allowedRights={["sender"]} />}>
          <Route index path="/post_cargo" element={<PostCargoPage />} />
        </Route>
        <Route element={<AuthRights allowedRights={["owner"]} />}>
          <Route index path="/company" element={<CompanyPage />} />
          <Route index path="/jobs/:id" element={<JobDetailsPage />} />
        </Route>
        <Route index path="/order/:id" element={<CargoDetailsPage />} />
        <Route index path="/tracking" element={<TrackingPage />} />
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


      {/* <Route element={<RequireAuth fallbackPath={"/login"}>
        <AuthLayout />
      </RequireAuth>
      }>
        <Route path="/account_type" element={<AccountTypePage />} />
      </Route>
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/phone" element={<LoginWithPhonePage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route> */}
      <Route path="*" element={<NotFound />} />
    </>
  )
);
