const GiftCard = require("../models/giftCardSchema");
const ApiFeatures = require("../utils/apifeatures");
const multer = require("multer");
const path = require("path");

// Create a new gift card
const createGiftCard = async (req, res) => {
  console.log("dfdf :", req.body);
  try {
    const { giftCardName, giftCardTag, description, amount, discount, expirationDate } = req.body;

    // console.log(req.body);
    const giftCardImg = req.file ? req.file.buffer.toString("base64") : null;
    // Create new GiftCard object
    const giftCard = new GiftCard({
      giftCardName,
      giftCardTag,
      description,
      amount,
      discount,
      expirationDate,
      giftCardImg, // Store image as Buffer
    });

    // console.log(giftCard);

    const savedGiftCard = await giftCard.save();

    // console.log(savedGiftCard);
    console.log("there");
    res.status(201).json(savedGiftCard);
    console.log("here");
  } catch (error) {
    console.log("error : ", error);
    res.status(400).json({ error: error.message });
  }
};

// Get a gift card by ID
const getGiftCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
      return res.status(404).json({ message: "Gift card not found" });
    }
    res.status(200).json(giftCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.getAllVenues = catchAsyncErrors(async (req, res, next) => {
//   const venuesCount = await Venue.countDocuments();
//   const resultPerPage = 30;

//   const apiFeatures = new ApiFeatures(Venue.find(), req.query).search().pagination(resultPerPage);
//   // const venues = await Venue.find();
//   const venues = await apiFeatures.query;

//   res.status(200).json({
//     success: true,
//     venues,
//     venuesCount,
//     // resultPerPage,
//   });
// });

// Get all gift cards
const getAllGiftCards = async (req, res) => {
  try {
    console.log("trigger");
    const giftCardCount = await GiftCard.countDocuments();
    const resultPerPage = 30;

    const apiFeatures = new ApiFeatures(GiftCard.find(), req.query).search().pagination(resultPerPage);

    const giftCards = await apiFeatures.query;

    console.log(giftCards);
    res.status(200).json({
      giftCards,
    });

    // const giftCards = await GiftCard.find();
    // res.status(200).json(giftCards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a gift card
const updateGiftCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGiftCard = await GiftCard.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedGiftCard) {
      return res.status(404).json({ message: "Gift card not found" });
    }
    res.status(200).json(updatedGiftCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a gift card
const deleteGiftCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGiftCard = await GiftCard.findByIdAndDelete(id);
    if (!deletedGiftCard) {
      return res.status(404).json({ message: "Gift card not found" });
    }
    res.status(200).json({ message: "Gift card deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a buyer to a gift card
const addBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerName, buyerPhone, buyerEmail, paymentMethod, generatedCode } = req.body;

    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
      return res.status(404).json({ message: "Gift card not found" });
    }

    giftCard.buyers.push({
      buyerName,
      buyerPhone,
      buyerEmail,
      paymentMethod,
      generatedCode,
    });

    const updatedGiftCard = await giftCard.save();
    res.status(201).json(updatedGiftCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Redeem a gift card using QR code
const redeemGiftCard = async (req, res) => {
  try {
    const { qrCode } = req.body;

    const giftCard = await GiftCard.findOne({ "buyers.qrCode": qrCode });
    if (!giftCard) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    const buyer = giftCard.buyers.find((buyer) => buyer.qrCode === qrCode);
    if (!buyer || buyer.status === "redeemed") {
      return res.status(400).json({ message: "QR code already redeemed or invalid" });
    }

    buyer.status = "redeemed";
    buyer.usedDate = new Date();

    const updatedGiftCard = await giftCard.save();
    res.status(200).json({ message: "Gift card redeemed successfully", buyer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createGiftCard,
  getGiftCardById,
  getAllGiftCards,
  updateGiftCard,
  deleteGiftCard,
  addBuyer,
  redeemGiftCard,
};
