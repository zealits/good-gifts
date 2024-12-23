import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { loadUser } from "./services/Actions/authActions.js";
import Login from "./components/Auth/Login";
import Register from "./components/Register";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import UserLanding from "./pages/user/UserLanding.js";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser()); // Load user data on app load
  }, [dispatch]);

  const { loading, user } = useSelector((state) => state.auth);
  const userDetails = user?.user; // Safely access user.user


  // Loading state handling
  if (loading) {
    return <div>Loading...</div>;
  }

  // Authenticated Route Wrapper

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to={userDetails?.role === "Admin" ? "/dashboard" : "/"} /> : <Login />}
        />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            user ? userDetails?.role === "Admin" ? <AdminDashboard /> : <Navigate to="/" /> : <Navigate to="/login" />
          }
        />

        <Route path="/" element={<UserLanding />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
