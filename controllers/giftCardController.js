const GiftCard = require("../models/giftCardSchema");

// Create a new gift card
const createGiftCard = async (req, res) => {
  console.log(req.admin);
  try {
    console.log(req.body);
    const giftCard = new GiftCard(req.body);
    const savedGiftCard = await giftCard.save();
    res.status(201).json(savedGiftCard);
  } catch (error) {
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

// Get all gift cards
const getAllGiftCards = async (req, res) => {
  try {
    const giftCards = await GiftCard.find();
    res.status(200).json(giftCards);
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
