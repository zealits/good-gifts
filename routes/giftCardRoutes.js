const express = require('express');
const {
  createGiftCard,
  getGiftCardById,
  getAllGiftCards,
  updateGiftCard,
  deleteGiftCard,
  addBuyer,
  redeemGiftCard,
} = require('../controllers/giftCardController.js');

const router = express.Router();

// Routes to manage and interact with gift cards
router.post('/create-giftcard', createGiftCard); // Create a new gift card
router.get('/details/:id', getGiftCardById); // Get specific gift card details
router.get('/list', getAllGiftCards); // List all gift cards
router.put('/update/:id', updateGiftCard); // Update gift card information
router.delete('/remove/:id', deleteGiftCard); // Remove a gift card

// Buyer Routes
router.post('/:id/buyers', addBuyer);
router.post('/redeem', redeemGiftCard);

module.exports = router;
