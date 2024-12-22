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
  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser()); // Load user data on app load
  }, [dispatch]);

  // Loading state handling (optional)
  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log(user.role);

  return (
    <Router>
      <Routes>
        {/* Redirect logged-in users away from login */}
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === "Admin" ? "/dashboard" : "/"} /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        {/* Admin Dashboard: Only accessible by admin */}
        <Route
          path="/dashboard"
          element={
            user?.role === "Admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" /> // Redirect if not admin
            )
          }
        />
        {/* Default landing page for all users */}
        <Route path="*" element={<UserLanding />} />
      </Routes>
    </Router>
  );
}

export default App;
