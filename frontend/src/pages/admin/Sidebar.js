import React, { useState } from "react";
import "./Sidebar.css"; // Ensure you import the CSS
import { useDispatch } from "react-redux";
import { logout } from "../../services/Actions/authActions";
import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaBriefcase,
  FaTasks,
  FaUser,
  FaCog,
  FaInfoCircle,
  FaHeadset,
  FaSignOutAlt,
  FaMoneyBill,
  FaEnvelope,
  FaAngleRight,
  FaAngleLeft,
  FaTachometerAlt,
  FaGift,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isActive = (path) => location.pathname === path;

  const [isOpen, setIsOpen] = useState(true); // Sidebar open initially

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
          {isOpen ? <FaAngleLeft id="btn" className="icon" /> : <FaAngleRight id="btn" className="icon" />}
        </i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/dashboard" className={`linke ${isActive("/") ? "active" : ""}`}>
            <i className="bx bx-grid-alt">
              <FaTachometerAlt className="icon " />
            </i>
            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/giftcards" className={`linke ${isActive("/my-gigs") ? "active" : ""}`}>
            <i className="bx bx-user">
              <FaGift className="icon " />
            </i>
            <span className="links_name">GiftCards</span>
          </Link>
          <span className="tooltip">GiftCards</span>
        </li>
        <li>
          <Link to="/orders" className={`linke ${isActive("/available-projects") ? "active" : ""}`}>
            <i className="bx bx-chat">
              <FaShoppingCart className="icon " />
            </i>
            <span className="links_name">Orders</span>
          </Link>
          <span className="tooltip">Orders</span>
        </li>
        <li>
          <Link to="/customers" className={`linke ${isActive("/available-jobs") ? "active" : ""}`}>
            <i className="bx bx-chat">
              <FaUsers className="icon" />
            </i>
            <span className="links_name">Customers</span>
          </Link>
          <span className="tooltip">Customers</span>
        </li>

        <li>
          <Link to="/reports" className={`linke ${isActive("/profile") ? "active" : ""}`}>
            <i className="bx bx-pie-chart-alt-2">
              <FaChartLine className="icon " />
            </i>
            <span className="links_name">Reports</span>
          </Link>
          <span className="tooltip">Reports</span>
        </li>
        <li>
          <Link to="/settings" className={`linke ${isActive("/earnings") ? "active" : ""}`}>
            <i className="bx bx-folder">
              <FaCog className="icon " />
            </i>
            <span className="links_name">Settings</span>
          </Link>
          <span className="tooltip">Settings</span>
        </li>
        {/* <li>
          <Link to="/preferences" className="linke">
            <i className="bx bx-cart-alt">
              <FaCog className="icon " />
            </i>
            <span className="links_name">Preferences</span>
          </Link>
          <span className="tooltip">Preferences</span>
        </li> */}

        {/* <li>
          <Link to="/knowledge-bank" className="linke">
            <i className="bx bx-cog">
              <FaInfoCircle className="icon " />
            </i>
            <span className="links_name">Knowledge Bank</span>
          </Link>
          <span className="tooltip">Knowledge Bank</span>
        </li> */}
        {/* <li>
          <Link to="/support" className="linke">
            <i className="bx bx-cog">
              <FaHeadset className="icon " />
            </i>
            <span className="links_name">Support</span>
          </Link>
          <span className="tooltip">Support</span>
        </li> */}
        <li className="profile">
          <div className="profile-details" onClick={handleLogout}>
            <i className="bx bx-export">
              <FaSignOutAlt className="icon " />
            </i>
            <div className="name_job">
              <div className="name">Logout</div>
            </div>
          </div>
          <i className="bx bx-log-out" id="log_out"></i>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
