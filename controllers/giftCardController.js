const GiftCard = require("../models/giftCardSchema");
const ApiFeatures = require("../utils/apifeatures");
const multer = require("multer");
const path = require("path");
const sendEmail = require("../utils/sendEmail"); // Assuming sendEmail is in the same directory
const QRCode = require("qrcode"); // For generating QR codes

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
    const giftCardCount = await GiftCard.countDocuments();
    const resultPerPage = 30;

    const apiFeatures = new ApiFeatures(GiftCard.find(), req.query).search().pagination(resultPerPage);

    const giftCards = await apiFeatures.query;

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

// In your controller where you generate and send the email
const addBuyer = async (req, res) => {
  try {
    const { id, purchaseType, selfInfo, giftInfo, paymentDetails } = req.body;

    // Validate required fields
    if (!id || !purchaseType || !paymentDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (purchaseType === "self" && (!selfInfo?.name || !selfInfo?.email || !selfInfo?.phone)) {
      return res.status(400).json({ error: "Missing required fields for self purchase" });
    }

    if (
      purchaseType === "gift" &&
      (!giftInfo?.recipientName || !giftInfo?.recipientEmail || !giftInfo?.senderName || !giftInfo?.senderEmail)
    ) {
      return res.status(400).json({ error: "Missing required fields for gift purchase" });
    }

    const giftCardDetails = await GiftCard.findById(id);

    if (!giftCardDetails) {
      return res.status(404).json({ error: "Gift card not found" });
    }

    // Generate unique code for QR
    const uniqueCode = `${id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Generate QR code as Buffer
    const qrCodeBuffer = await QRCode.toBuffer(uniqueCode, {
      errorCorrectionLevel: "H",
      type: "png",
      margin: 1,
      width: 300,
    });

    // Create unique identifier for QR code image
    const qrCodeCid = `qr-${Date.now()}@giftcard.com`;

    // Save QR code data to database
    const qrCodeBase64 = qrCodeBuffer.toString("base64");
    const buyerDetails = {
      purchaseType,
      selfInfo: purchaseType === "self" ? selfInfo : undefined,
      giftInfo: purchaseType === "gift" ? giftInfo : undefined,
      paymentDetails,
      purchaseDate: new Date(),
      qrCode: {
        uniqueCode,
        dataUrl: `data:image/png;base64,${qrCodeBase64}`,
        createdAt: new Date(),
        isUsed: false,
      },
    };

    // Add buyer to gift card
    giftCardDetails.buyers.push(buyerDetails);
    await giftCardDetails.save();

    const senderEmail = selfInfo?.email || giftInfo?.senderEmail;
    const recipientEmail = giftInfo?.recipientEmail;
    const { giftCardName, giftCardTag, description, amount, expirationDate } = giftCardDetails;

    // Email template function
    const createEmailTemplate = (isRecipient = false) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual Gift Card</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f5f5f5;
            color: #333;
        }

        /* Main email container */
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
        }

        /* Virtual gift card design */
        .gift-card-container {
            max-width: 500px;
            margin: 20px auto;
            background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        /* Card header section */
        .card-header {
            padding: 25px;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
        }

        .card-header h2 {
            color: #ffffff;
            font-size: 24px;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }

        /* Card amount section */
        .card-amount {
            padding: 30px 25px;
            text-align: center;
            background: rgba(255, 255, 255, 0.05);
        }

        .amount {
            font-size: 42px;
            color: #ffffff;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Card details section */
        .card-details {
            padding: 25px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            margin: 0 15px 15px;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(26, 35, 126, 0.1);
        }

        .detail-item:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: #1a237e;
            font-weight: 600;
            font-size: 14px;
        }

        .detail-value {
            color: #333;
            font-size: 14px;
        }

        /* QR Code section */
        .qr-section {
            background: #ffffff;
            padding: 25px;
            text-align: center;
            border-radius: 12px;
            margin: 15px;
        }

        .qr-section p {
            color: #1a237e;
            font-size: 16px;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .qr-code {
            width: 180px;
            height: 180px;
            margin: 0 auto;
            padding: 10px;
            background: #ffffff;
            border: 1px solid rgba(26, 35, 126, 0.1);
            border-radius: 8px;
        }

        /* Instructions section */
        .instructions {
            margin-top: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .instructions h3 {
            color: #1a237e;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .instructions ol {
            margin-left: 20px;
            color: #555;
        }

        .instructions li {
            margin-bottom: 10px;
        }

        /* Footer section */
        .footer {
            margin-top: 25px;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 13px;
            border-top: 1px solid #eee;
        }

        /* Responsive design */
        @media screen and (max-width: 480px) {
            .email-container {
                margin: 10px;
                padding: 15px;
            }

            .card-header h2 {
                font-size: 20px;
            }

            .amount {
                font-size: 36px;
            }

            .qr-code {
                width: 150px;
                height: 150px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="gift-card-container">
            <!-- Card Header -->
            <div class="card-header">
                <h2>${isRecipient ? "Virtual Gift Card" : "Gift Card Purchase"}</h2>
                <p style="color: #ffffff; opacity: 0.9;">
                    ${isRecipient ? `From: ${senderEmail}` : `To: ${recipientEmail}`}
                </p>
            </div>

            <!-- Amount Display -->
            <div class="card-amount">
                <div class="amount">$ ${amount}</div>
            </div>

            <!-- Card Details -->
            <div class="card-details">
                <div class="detail-item">
                    <span class="detail-label">Gift Card Type &nbsp; </span>
                    <span class="detail-value"> ${giftCardName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Card ID &nbsp;</span>
                    <span class="detail-value"> ${giftCardTag}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Valid Until &nbsp;</span>
                    <span class="detail-value">${
                      expirationDate ? new Date(expirationDate).toLocaleDateString() : "No Expiration"
                    }</span>
                </div>
            </div>

            <!-- QR Code Section -->
            <div class="qr-section">
                <p>Scan to Redeem</p>
                <img src="cid:${qrCodeCid}" alt="QR Code" class="qr-code"/>
            </div>
        </div>

        <!-- Instructions -->
         <div class="instructions">
            <h3>How to Redeem Your Gift Card</h3>
              <ol>
                  <li>Visit the restaurant where you want to redeem your gift card.</li>
                  <li>The restaurant admin will scan the QR code on your gift card.</li>
                  <li>Inform the admin how much money you wish to redeem from the gift card balance.</li>
                  <li>An OTP will be sent to your registered email or mobile number for final confirmation.</li>
                  <li>Provide the OTP to the admin to complete the redemption process.</li>
             </ol>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This is a secure automated message. Please do not reply to this email.</p>
            ${!isRecipient ? `<p>A copy of this gift card has been sent to ${recipientEmail}</p>` : ""}
        </div>
    </div>
</body>
</html>
`;

    try {
      // Send email to sender
      await sendEmail({
        email: senderEmail,
        subject: `Your gift card purchase: ${giftCardName}`,
        html: createEmailTemplate(false),
        attachments: [
          {
            filename: "qr-code.png",
            content: qrCodeBuffer,
            cid: qrCodeCid,
          },
        ],
      });

      // Send email to recipient if gift purchase
      if (recipientEmail) {
        await sendEmail({
          email: recipientEmail,
          subject: `You've received a gift card: ${giftCardName}`,
          html: createEmailTemplate(true),
          attachments: [
            {
              filename: "qr-code.png",
              content: qrCodeBuffer,
              cid: qrCodeCid,
            },
          ],
        });
      }
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
    }

    res.status(200).json({
      message: "Buyer added successfully",
      giftCard: giftCardDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the buyer" });
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
    if (!buyer || buyer.status === "+") {
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
