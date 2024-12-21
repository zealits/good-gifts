import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import the same CSS
import Modal from "../Notification/Modal"; // Import the Modal component

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);  // State for modal visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/admin/login", {
        email,
        password,
      });
      console.log("Login Successful:", res.data);
      // Redirect or handle success here
    } catch (err) {
      console.error("Login Failed:", err.response.data);
      setError(err.response.data.message || "Failed to login");
      setShowModal(true);  // Show the modal on error
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);  // Close the modal
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

            <button type="submit" className="btn">
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
