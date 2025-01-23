const express = require("express");
const multer = require("multer");
const path = require("path"); // Import path to handle file extensions
const {
  createGiftCard,
  getGiftCardById,
  getAllGiftCards,
  updateGiftCard,
  deleteGiftCard,
  getTotalGiftCardsSold,
  getTotalRevenue,
  getSalesTrends,
  getSalesData,
  addBuyer,
  redeemGiftCard,
  sendOtp,
  verifyOtp,
  fetchGiftCardById,
} = require("../controllers/giftCardController.js");

const router = express.Router();

// const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ dest: "uploads/" });

// Routes to manage and interact with gift cards
router.post("/create-giftcard", upload.single("image"), createGiftCard); // Handle file uploads
router.get("/details/:id", getGiftCardById);
router.get("/list", getAllGiftCards);
router.put("/update/:id", updateGiftCard);
router.delete("/remove/:id", deleteGiftCard);
router.get("/total-sold", getTotalGiftCardsSold);
router.get("/total-revenue", getTotalRevenue);
router.get("/sales-trends", getSalesTrends);
router.get("/sales-data", getSalesData);
router.get('/scan-giftcard/:id', fetchGiftCardById);

// Buyer Routes
router.put("/purchase", addBuyer);

router.post("/redeem", redeemGiftCard);
// router.post("/send-otp", sendRedemptionOtp);
// router.post("/verify-otp", verifyRedemptionOtp);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);




router.get("/scan-giftcard/:id", fetchGiftCardById);

router.post("/send-otp-redeem", sendOtp);
router.post("/verify-otp-redeem", verifyOtp);

module.exports = router;
