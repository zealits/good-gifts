import React, { useState } from "react";
import "./Sidebar.css";
import { useDispatch } from "react-redux";
import { logout } from "../../services/Actions/authActions";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome, FaBriefcase, FaTasks, FaUser, FaCog, 
  FaInfoCircle, FaHeadset, FaSignOutAlt, FaMoneyBill, 
  FaEnvelope, FaAngleRight, FaAngleLeft, FaTachometerAlt, 
  FaGift, FaShoppingCart, FaUsers, FaChartLine, FaBars
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Updated isActive function to match exact paths
  const isActive = (path) => {
    return location.pathname === path;
  };

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="logo-details">
        <i className="bx bxl-codepen"></i>
        <div className="logo_name">A i i</div>
        <i className={`bx bx-menu ${isOpen ? "rotate" : ""}`} id="btn" onClick={toggleSidebar}>
          {isOpen ? <FaAngleLeft id="btn" className="icon" /> : <FaBars id="btn" className="icon" />}
        </i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/dashboard" className={`linke ${isActive("/dashboard") ? "active" : ""}`}>
            <i className="bx bx-grid-alt">
              <FaTachometerAlt className="icon" />
            </i>
            <span className="links_name">Dashboard</span>
            {isActive("/dashboard") && <span className="active-indicator"></span>}
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/giftcards" className={`linke ${isActive("/giftcards") ? "active" : ""}`}>
            <i className="bx bx-user">
              <FaGift className="icon" />
            </i>
            <span className="links_name">GiftCards</span>
            {isActive("/giftcards") && <span className="active-indicator"></span>}
          </Link>
          <span className="tooltip">GiftCards</span>
        </li>
        <li>
          <Link to="/orders" className={`linke ${isActive("/orders") ? "active" : ""}`}>
            <i className="bx bx-chat">
              <FaShoppingCart className="icon" />
            </i>
            <span className="links_name">Orders</span>
            {isActive("/orders") && <span className="active-indicator"></span>}
          </Link>
          <span className="tooltip">Orders</span>
        </li>
        <li>
          <Link to="/reports" className={`linke ${isActive("/reports") ? "active" : ""}`}>
            <i className="bx bx-pie-chart-alt-2">
              <FaChartLine className="icon" />
            </i>
            <span className="links_name">Reports</span>
            {isActive("/reports") && <span className="active-indicator"></span>}
          </Link>
          <span className="tooltip">Reports</span>
        </li>
        <li>
          <Link to="/settings" className={`linke ${isActive("/settings") ? "active" : ""}`}>
            <i className="bx bx-folder">
              <FaCog className="icon" />
            </i>
            <span className="links_name">Settings</span>
            {isActive("/settings") && <span className="active-indicator"></span>}
          </Link>
          <span className="tooltip">Settings</span>
        </li>
        <li>
          <Link to="/redeem" className={`linke ${isActive("/redeem") ? "active" : ""}`}>
            <i className="bx bx-gift">
              <FaGift className="icon" />
            </i>
            <span className="links_name">Redeem</span>
            {isActive("/redeem") && <span className="active-indicator"></span>}
          </Link>
          <span className="tooltip">Redeem</span>
        </li>

        <li className="profile">
          <div className="profile-details" onClick={handleLogout}>
            <i className="bx bx-export">
              <FaSignOutAlt className="icon" />
            </i>
            <div className="name_job">
              <div className="name">Logout</div>
            </div>
          </div>
        </li>
      </ul>
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
    </div>
  );
};

export default Sidebar;