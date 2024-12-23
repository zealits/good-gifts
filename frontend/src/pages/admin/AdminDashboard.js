import React from "react";
import { logout } from "../../services/Actions/authActions";
import { useDispatch } from "react-redux";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
  Admin Dashboard
      <button type="button" onClick={handleLogout} >logout</button>
    </div>
  );
};

export default AdminDashboard;
