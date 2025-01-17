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
      type: Number, // Changed to Number for proper revenue calculation
    },
    discount: {
      type: String,
    },
    currency: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "redeemed", "expired", "sold"], // Added 'sold' status
      default: "active",
    },
    expirationDate: {
      type: Date,
    },
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
        qrCode: {
          uniqueCode: {
            type: String,
          },
          dataUrl: {
            type: String,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          isUsed: {
            type: Boolean,
            default: false,
          },
        },
        otp: {
          code: {
            type: String, // OTP code
          },
          expiresAt: {
            type: Date, // Expiry of OTP
          },
        },
        usedAmount: {
          type: Number, // Tracks the total amount redeemed by this buyer
          default: 0,
        },
        remainingBalance: {
          type: Number, // Tracks the balance after redeeming an amount
          default: function () {
            return this.usedAmount > 0 ? this.usedAmount : null;
          },
        },
      },
    ],
    redemptionHistory: [
      {
        redeemedAmount: {
          type: Number,
          required: true,
        },
        redemptionDate: {
          type: Date,
          default: Date.now,
        },
        originalAmount: {
          type: Number,
          required: true,
        },
        remainingAmount: {
          type: Number, // New field for tracking remaining balance
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GiftCard", giftCardSchema);
