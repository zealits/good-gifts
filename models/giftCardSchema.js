const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema(
  {
    giftCardName: {
      type: String,
      required: true,
      unique: true, // Ensures the card number is unique
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "redeemed", "expired"], // Enum to control valid statuses
      default: "active",
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "restaurantAdminSchema", // Links to the admin who created the gift card
    //   required: true,
    // },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    buyers: [
      {
        buyerName: {
          type: String,
          required: true,
        },
        buyerPhone: {
          type: String,
          required: true,
        },
        buyerEmail: {
          type: String,
          required: true,
        },
        paymentMethod: {
          type: String,
          enum: ["PhonePe", "GPay", "PayPal", "CreditCard"], // Payment methods
          required: true,
        },
        generatedCode: {
          type: String,
          unique: true, // Code generated after payment
          required: true,
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["active", "redeemed", "expired"], // Buyer's card status
          default: "active",
        },
        usedDate: {
          type: Date, // Populated when redeemed
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("GiftCard", giftCardSchema);
