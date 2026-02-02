import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";

import DashboardLayout from "../layouts/DashboardLayout";

// USER PAGES
import MyLeaves from "../pages/user/MyLeaves";
import RequestLeave from "../pages/user/RequestLeave";
import Profile from "../pages/user/Profile";

// ADMIN PAGES
import Users from "../pages/admin/Users";
import AllLeaves from "../pages/admin/AllLeaves";
import AddCredit from "../pages/admin/AddCredit";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* USER ROUTES */}
        <Route index element={<MyLeaves />} />
        <Route path="request-leave" element={<RequestLeave />} />
        <Route path="profile" element={<Profile />} />

        {/* ADMIN ROUTES */}
        <Route path="users" element={<Users />} />
        <Route path="leaves" element={<AllLeaves />} />
        <Route path="add-credit" element={<AddCredit />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
