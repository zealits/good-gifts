import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { loadUser } from "./services/Actions/authActions.js";
import Login from "./components/Auth/Login";
import Register from "./components/Register";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import UserLanding from "./pages/user/UserLanding.js";
import Sidebar from "./pages/admin/Sidebar.js";
import GiftCards from "./pages/admin/GiftCards.js"; // GiftCards page
import Orders from "./pages/admin/Orders.js"; // GiftCards page
import Customers from "./pages/admin/Customers.js"; // GiftCards page
import Reports from "./pages/admin/Reports.js"; // GiftCards page
import Settings from "./pages/admin/Settings.js"; // GiftCards page
import "./App.css";

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

  return (
    <div className="app">
      <Router>
        {/* Conditionally render Sidebar only if the user is an admin */}
        {userDetails?.role === "Admin" && <Sidebar />}

        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to={userDetails?.role === "Admin" ? "/dashboard" : "/"} /> : <Login />}
          />
          <Route path="/register" element={<Register />} />

          {/* Conditional Admin Routes */}


          {userDetails?.role === "Admin" && (
            <>
              <Route path="/dashboard" element={<div className="content"><AdminDashboard /></div>} />
              <Route path="/giftcards" element={<div className="content"><GiftCards /></div>} />
              <Route path="/orders" element={<div className="content"><Orders /></div>} />
              <Route path="/customers" element={<div className="content"><Customers /></div>} />
              <Route path="/reports" element={<div className="content"><Reports /></div>} />
              <Route path="/settings" element={<div className="content"><Settings /></div>} />
            </>
          )}

          {/* User landing page */}
          <Route path="/" element={<UserLanding />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
