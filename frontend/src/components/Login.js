import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await axios.post("/api/v1/admin/login", {
        email,
        password,
      });
      alert("Login successful!");
      console.log(res.data);
      navigate("/dashboard"); // Redirect to the Dashboard page
    } catch (err) {
      alert("Login failed. Check email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Please log in to continue</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={loginUser} className="login-button">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
