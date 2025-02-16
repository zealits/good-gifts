// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const generateWalletPass = require("../controllers/walletController.js");

router.post("/generate-wallet-pass", generateWalletPass);

module.exports = router;
