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
  getSoldGiftCards,
  getGiftCardBuyers,
  getAllBuyers,
  totalRedemptionValue,
  getRevenueForLast30Days
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
// Endpoint to get all sold gift cards
router.get('/giftcards', getSoldGiftCards);

// Endpoint to get buyers for a specific gift card
router.get('/giftcards/:id/buyers', getGiftCardBuyers);
router.get("/buyers", getAllBuyers);


router.get("/scan-giftcard/:id", fetchGiftCardById);

router.post("/send-otp-redeem", sendOtp);
router.post("/verify-otp-redeem", verifyOtp);

router.get("/total-redemption", totalRedemptionValue); 
router.get("/last-30-days", getRevenueForLast30Days);
module.exports = router;
