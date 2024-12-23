import React from "react";
import { useDispatch } from "react-redux";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="heading">Dashboard</h1>
      <div>
      <p>Purpose: Provide an overview of the restaurant's gift card system.</p>
        <h3>Total gift cards created</h3>
        <h3>Total gift cards sold</h3>
        <h3>Total revenue from gift cards</h3>
        <h3>Active promotions</h3>
        <h3>Graphs and statistics (e.g., daily/weekly/monthly sales trends)</h3>
      </div>
    </div>
  );
};

export default AdminDashboard;
