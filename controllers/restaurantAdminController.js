const RestaurantAdmin = require("../models/restaurantAdminSchema");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail"); // Utility for sending emails
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // Middleware for handling async errors

// Send OTP for email verification
exports.sendOtp = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  // Use RestaurantAdmin model here instead of User
  let restaurantAdmin = await RestaurantAdmin.findOne({ email });

  if (!restaurantAdmin) {
    restaurantAdmin = new RestaurantAdmin({ email });
  }

  const otp = restaurantAdmin.generateVerificationCode();
  await restaurantAdmin.save({ validateBeforeSave: false });

  console.log(otp); // Log the OTP for testing purposes (remove in production)
  const message = `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`;

  try {
    // Send the OTP via email
    await sendEmail({
      email: restaurantAdmin.email,
      subject: "Email Verification OTP for Restaurant Admin",
      message,
    });

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email} successfully`,
    });
  } catch (error) {
    restaurantAdmin.verificationCode = undefined;
    restaurantAdmin.verificationCodeExpire = undefined;

    await restaurantAdmin.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Register Restaurant Admin after OTP verification
exports.registerRestaurantAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phone, restaurantName, restaurantAddress, otp } = req.body;

  // Check if email already exists in the database
  let admin = await RestaurantAdmin.findOne({ email });

  // If the admin already exists, check if OTP is valid
  if (admin) {
    if (!admin.verificationCode || admin.verificationCodeExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid or has expired",
      });
    }

    // Verify OTP
    const isOtpValid = await admin.verifyOTP(otp);
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // If OTP is valid, update the existing admin
    admin.name = name;
    admin.password = password;
    admin.phone = phone;
    admin.restaurantName = restaurantName;
    admin.restaurantAddress = restaurantAddress;

    await admin.save();
    const token = admin.getJWTToken(); // Generate JWT token for the updated admin

    return res.status(200).json({
      success: true,
      message: "Restaurant admin updated successfully",
      token,
      admin,
    });
  }

  // If no admin found, create a new one
  admin = await RestaurantAdmin.create({
    name,
    email,
    password,
    phone,
    restaurantName,
    restaurantAddress,
  });

  // Generate JWT token
  const token = admin.getJWTToken();

  res.status(201).json({
    success: true,
    message: "Restaurant admin registered successfully",
    token,
    admin,
  });
});

// Login Restaurant Admin
exports.loginRestaurantAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await RestaurantAdmin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Compare password
    const isPasswordMatched = await admin.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = admin.getJWTToken();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Password Reset - Request Token
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if admin exists
    const admin = await RestaurantAdmin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Generate password reset token
    const resetToken = admin.getResetPasswordToken();
    await admin.save({ validateBeforeSave: false });

    // In a real app, send resetToken via email
    res.status(200).json({
      success: true,
      message: "Password reset token generated",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Verify OTP for Email Verification
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await RestaurantAdmin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isOtpValid = await admin.verifyOTP(otp);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
