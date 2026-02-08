import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import VehicleGrid from "../components/dashboard/VehicleGrid";
import RouteOptimization from "../components/dashboard/RouteOptimization";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";
import DriverDashboard from "../components/dashboard/DriverDashboard";
import CustomerDashboard from "../components/dashboard/CustomerDashboard";
import VerificationPortal from "../components/dashboard/VerificationPortal";
import RideHistory from "../components/dashboard/RideHistory";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout role="ADMIN" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="vehicles" element={<VehicleGrid />} />
        <Route path="map" element={<RouteOptimization />} />
        <Route path="verification" element={<VerificationPortal />} />
        <Route path="drivers" element={<div className="p-10 text-center text-gray-500">Driver Management Module (Coming Soon)</div>} />
        <Route path="settings" element={<div className="p-10 text-center text-gray-500">System Settings (Coming Soon)</div>} />
      </Route>

      {/* Manager Routes */}
      <Route path="/manager" element={<DashboardLayout role="MANAGER" />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="fleet" element={<VehicleGrid />} />
        <Route path="maintenance" element={<div className="p-10 text-center text-gray-500">Maintenance Schedule</div>} />
      </Route>

      {/* Driver Routes */}
      <Route path="/driver" element={<DashboardLayout role="DRIVER" />}>
        <Route index element={<DriverDashboard />} />
        <Route path="history" element={<div className="p-10 text-center text-gray-500">Trip History</div>} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer" element={<DashboardLayout role="CUSTOMER" />}>
        <Route index element={<CustomerDashboard />} />
        <Route path="trips" element={<RideHistory />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
