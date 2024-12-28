const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema(
  {
    giftCardName: {
      type: String,
      required: true,
    },
    giftCardTag: {
      type: String,
    },
    description: {
      type: String,
    },
    amount: {
      type: String,
    },
    discount: {
      type: String,
    },
    currency: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "redeemed", "expired"], // Enum to control valid statuses
      default: "active",
    },
    expirationDate: {
      type: Date,
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
    giftCardImg: {
      type: String,
    },
    buyers: [
      {
        purchaseType: {
          type: String,
        },
        selfInfo: {
          name: {
            type: String,
          },
          email: {
            type: String,
          },
          phone: {
            type: String,
          },
        },
        giftInfo: {
          recipientName: {
            type: String,
          },
          recipientEmail: {
            type: String,
          },
          message: {
            type: String,
          },
          senderName: {
            type: String,
          },
          senderEmail: {
            type: String,
          },
          senderPhone: {
            type: String,
          },
        },
        paymentDetails: {
          cardNumber: {
            type: String,
            required: true,
          },
          expiryDate: {
            type: String,
            required: true,
          },
          cvv: {
            type: String,
            required: true,
          },
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("GiftCard", giftCardSchema);
