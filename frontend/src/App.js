import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomDetails from "./pages/RoomDetails";
import Profile from "./pages/Profile"; // Add Profile
import ProtectedRoute from "./components/ProtectedRoute"; // Add ProtectedRoute
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PaymentCallback from "./pages/PaymentCallback";
import MyBookings from "./pages/MyBookings";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageRooms from "./pages/admin/ManageRooms";
import RevenueDashboard from "./pages/admin/RevenueDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route path="/payment-callback" element={<PaymentCallback />} />

          {/* Admin Routes */}
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-rooms" element={<ManageRooms />} />
            <Route path="revenue" element={<RevenueDashboard />} />
          </Route>
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
