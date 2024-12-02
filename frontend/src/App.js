import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login.js";
import Register from "./components/Register.js";

function App() {
  return (
    <div className="app">
      <Router>
        {/* {isAuthenticated && (
          <>
            {user.role === "admin" && <AdminSidebar />}
            {user.role === "user" && <Sidebar />}
            {user.role === "superadmin" && <SuperAdminSidebar />}
          </>
        )} */}
        <div>
          <Routes>
           
            <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
            {/* {!isAuthenticated && <Route path="/" element={<PandaLogin />} />} */}

            {/* {isAuthenticated && totpVerified && user.is2FAEnabled ? (
              <Route path="/" element={<TotpPage />} />
            ) : (
              isAuthenticated &&
              !totpVerified && (
                <>
                  {user.role === "user" && (
                    <>
                      <Route exact path="/" element={<Home />} />
                      
                    </>
                  )}

                  {user.role === "admin" && (
                    <>
                      <Route exact path="/" element={<AdminDashboard />} />
                     
                    </>
                  )}

                  {user.role === "superadmin" && (
                    <>
                      <Route exact path="/" element={<SuperAdminDashboard />} />
                    </>
                  )}
                </>
              )
            )} */}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
