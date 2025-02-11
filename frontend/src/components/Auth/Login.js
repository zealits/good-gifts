import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/Actions/authActions";
import "./Login.css";

const GiftCardLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      setShowModal(true);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password, navigate));
  };

  return (
    <div className="giftcard_auth_wrapper">
      <div className="giftcard_auth_container">
        <div className="giftcard_logo_section">
          <div className="giftcard_animation_wrapper">
            <div className="giftcard_floating_element">
              <div className="giftcard_icon_top"></div>
              <div className="giftcard_icon_ribbon"></div>
              <div className="giftcard_icon_body"></div>
            </div>
          </div>
        </div>

        <div className="giftcard_content_section">
          <h1 className="giftcard_title">Welcome Back</h1>
          <p className="giftcard_subtitle">Please sign in to continue</p>

          <form onSubmit={handleSubmit} className="giftcard_form">
            <div className="giftcard_input_group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="giftcard_input"
              />
              <span className="giftcard_input_highlight"></span>
            </div>

            <div className="giftcard_input_group">
              <div className="giftcard_password_wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="giftcard_input"
                />
                <button
                  type="button"
                  className="giftcard_password_toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <span className="giftcard_input_highlight"></span>
              </div>
            </div>

            <div className="giftcard_options">
              <label className="giftcard_remember_option">
                <input type="checkbox" className="giftcard_checkbox" />
                <span className="giftcard_checkmark"></span>
                Remember me
              </label>
              <a href="#" className="giftcard_forgot_link">Forgot Password?</a>
            </div>

            <button type="submit" className="giftcard_submit_button">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="giftcard_register_prompt">
              Don't have an account? <a href="#" className="giftcard_signup_link">Sign Up</a>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="giftcard_modal_overlay" onClick={() => setShowModal(false)}>
          <div className="giftcard_modal_content" onClick={e => e.stopPropagation()}>
            <p>{error}</p>
            <button className="giftcard_modal_close" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCardLogin;