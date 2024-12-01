const express = require("express");
const {
  sendOtp,
  registerRestaurantAdmin,
  loginRestaurantAdmin,
  requestPasswordReset,
  verifyOTP,
} = require("../controllers/restaurantAdminController");

const router = express.Router();

// Route to send OTP for email verification
router.post("/send-otp", sendOtp);

// Route to register a restaurant admin after OTP verification
router.put("/register", registerRestaurantAdmin);

// Route to login a restaurant admin
router.post("/login", loginRestaurantAdmin);

// Route to request password reset
router.post("/password-reset", requestPasswordReset);

// Route to verify OTP
router.post("/verify-otp", verifyOTP);

module.exports = router;
