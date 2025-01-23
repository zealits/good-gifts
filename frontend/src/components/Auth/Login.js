import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../services/Actions/authActions";
import "./Login.css"; // Import the same CSS
import Modal from "../Notification/Modal"; // Import the Modal component
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      // If there is an error, show the modal
      setShowModal(true);
    }
  }, [error]); // Whenever error changes, show modal

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password, navigate));
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="background">
      <div className="login-container">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Please sign in to continue</p>

          {/* Modal for error */}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="register-link">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>

        {showModal && <Modal message={error} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default Login;
