const express = require("express");
const multer = require("multer");
const path = require("path"); // Import path to handle file extensions
const {
  createGiftCard,
  getGiftCardById,
  getAllGiftCards,
  updateGiftCard,
  deleteGiftCard,
  addBuyer,
  redeemGiftCard,
} = require("../controllers/giftCardController.js");

const router = express.Router();

const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage: storage });

// Routes to manage and interact with gift cards
router.post("/create-giftcard", upload.single("image"), createGiftCard); // Handle file uploads
router.get("/details/:id", getGiftCardById);
router.get("/list", getAllGiftCards);
router.put("/update/:id", updateGiftCard);
router.delete("/remove/:id", deleteGiftCard);

// Buyer Routes
router.post("/:id/buyers", addBuyer);
router.post("/redeem", redeemGiftCard);

module.exports = router;
