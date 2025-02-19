import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/Actions/authActions";
import "./Login.css";

const FallingGifts = () => {
  useEffect(() => {
    const createGift = () => {
      const gift = document.createElement('div');
      gift.className = 'falling-gift';
      
      // Create bow element
      const bow = document.createElement('div');
      bow.className = 'bow';
      gift.appendChild(bow);
      
      // Random position across entire viewport width
      const left = Math.random() * window.innerWidth;
      const duration = 6 + Math.random() * 6;
      const delay = -Math.random() * 20;
      const scale = 0.7 + Math.random() * 0.6;
      const rotation = Math.random() * 360;
      
      gift.style.left = `${left}px`;
      gift.style.animation = `fallAndRotate ${duration}s linear ${delay}s infinite`;
      gift.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
      
      return gift;
    };

    const container = document.createElement('div');
    container.className = 'falling-gifts';
    document.querySelector('.auth-wrapper').appendChild(container);

    const giftCount = 20; // Increased count for fuller effect
    for (let i = 0; i < giftCount; i++) {
      container.appendChild(createGift());
    }

    // Update positions on window resize
    const handleResize = () => {
      container.innerHTML = '';
      for (let i = 0; i < giftCount; i++) {
        container.appendChild(createGift());
      }
    };

    window.addEventListener('resize', handleResize);

    // Periodically add new gifts
    const intervalId = setInterval(() => {
      if (container.children.length < giftCount) {
        container.appendChild(createGift());
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
      container.remove();
    };
  }, []);

  return null;
};

const GiftCardLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setShowModal(true);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password, navigate));
  };

  const toggleGiftAnimation = () => {
    setIsGiftOpen(!isGiftOpen);
  };

 

  return (
    <div className="auth-wrapper">
    <FallingGifts />
      <div className="auth-container">
        <div className="logo-section">
          <div className="gift-wrapper">
            <div className="gift-box">
              {/* Ribbon */}
              <div className="ribbon-wrap">
                <div className="ribbon-vertical"></div>
                <div className="ribbon-horizontal"></div>
                <div className="bow">
                  <div className="bow-circle left"></div>
                  <div className="bow-circle right"></div>
                  <div className="bow-knot"></div>
                </div>
              </div>
              
              {/* Box Lid */}
              <div className="box-lid">
                <div className="lid-top"></div>
                <div className="lid-front"></div>
              </div>
              
              {/* Box Base */}
              <div className="box-base">
                <div className="box-front"></div>
                <div className="box-back"></div>
                <div className="box-left"></div>
                <div className="box-right"></div>
                <div className="box-bottom"></div>
                {/* Sparkles */}
                <div className="sparkles">
                  <div className="sparkle s1"></div>
                  <div className="sparkle s2"></div>
                  <div className="sparkle s3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="content-section">
          <h1 className="title">Login to Giftcard Vault</h1>
          <p className="subtitle">Please sign in to continue</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input-field"
              />
            </div>

            <div className="login-input-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input-field"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

           

            <button type="submit" className="submit-button">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* <div className="register-prompt">
              Don't have an account? <a href="#" className="signup-link">Sign Up</a>
            </div> */}
          </form>
        </div>
      </div>

      {showModal && (
        <div className="login-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="login-modal-content" onClick={e => e.stopPropagation()}>
            <p>{error}</p>
            <button className="login-modal-close" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCardLogin;