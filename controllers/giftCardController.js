const GiftCard = require("../models/giftCardSchema");
const ApiFeatures = require("../utils/apifeatures");
const multer = require("multer");
const path = require("path");
const sendEmail = require("../utils/sendEmail"); // Assuming sendEmail is in the same directory
const QRCode = require("qrcode"); // For generating QR codes
const cloudinary = require("cloudinary");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


// Create a new gift card
// const cloudinary = require("cloudinary").v2;

const createGiftCard = async (req, res) => {
  try {
    const { giftCardName, giftCardTag, description, amount, discount, expirationDate } = req.body;
    let giftCardImgUrl = null;

    if (req.file) {
      // Generate a unique filename
      const uniqueFilename = `${Date.now()}-${req.file.originalname}`;

      // Upload the image to Cloudinary with explicit public_id including folder
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `gift_cards/${uniqueFilename}`, // Explicitly specify folder in public_id
        resource_type: "auto",
      });

      // Log the result to verify upload location
      console.log("Upload result:", result);

      giftCardImgUrl = result.secure_url;
    }

    const giftCard = new GiftCard({
      giftCardName,
      giftCardTag,
      description,
      amount,
      discount,
      expirationDate,
      giftCardImg: giftCardImgUrl,
    });

    console.log(giftCard);
    const savedGiftCard = await giftCard.save();
    res.status(201).json(savedGiftCard);
  } catch (error) {
    console.error("Error:", error);
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

/**
 * Fetch Gift Card by ID QR unique id (id and qr id are different imp)
 */
const fetchGiftCardById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching Gift Card for ID:', id); // Debug logging

    const giftCard = await GiftCard.findOne({ 'buyers.qrCode.uniqueCode': id });

    if (!giftCard) {
      console.log('Gift card not found for ID:', id);
      return res.status(404).json({ message: 'Gift card not found' });
    }

    res.status(200).json(giftCard);
  } catch (error) {
    console.error('Error fetching gift card:', error.message);
    res.status(500).json({ error: 'Internal server error' });
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
    console.log("shesh");
    const giftCardCount = await GiftCard.countDocuments();
    console.log("GiftCard Count:", giftCardCount); // Debugging
    const resultPerPage = 30;

    const apiFeatures = new ApiFeatures(GiftCard.find(), req.query).search().pagination(resultPerPage);

    const giftCards = await apiFeatures.query;

    console.log("Gift Cards Retrieved:", giftCards.length); // Debugging
    res.status(200).json({
      giftCardCount,
      giftCards,
    });
  } catch (error) {
    console.error("Error in getAllGiftCards:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get total gift cards sold
const getTotalGiftCardsSold = async (req, res) => {
  try {
    const allGiftCards = await GiftCard.find();
    const totalSold = allGiftCards.reduce((sum, card) => sum + (card.buyers?.length || 0), 0);

    res.status(200).json({ totalSold });
  } catch (error) {
    console.error("Error in getTotalGiftCardsSold:", error);
    res.status(500).json({ error: "Failed to calculate total gift cards sold" });
  }
};

const getTotalRevenue = async (req, res) => {
  try {
    const allGiftCards = await GiftCard.find();

    const totalRevenue = allGiftCards.reduce((sum, card) => {
      if (!card.amount || !card.discount) {
        console.warn(`Skipping card with missing amount or discount: ${JSON.stringify(card)}`);
        return sum;
      }

      const cardRevenue = (card.amount - card.amount * (card.discount / 100)) * (card.buyers?.length || 0);

      return sum + cardRevenue;
    }, 0);

    res.json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ message: "Error calculating total revenue", error });
  }
};

const getSalesTrends = async (req, res) => {
  try {
    const { period } = req.query; // period: 'daily', 'weekly', 'monthly'

    // Define the start of the time period
    const dateNow = new Date();
    let startDate;

    // Set startDate based on the selected period
    if (period === "daily") {
      startDate = new Date(dateNow.setHours(0, 0, 0, 0)); // Start of today
    } else if (period === "weekly") {
      const dayOfWeek = dateNow.getDay();
      const diff = dateNow.getDate() - dayOfWeek; // Get the start of the week
      startDate = new Date(dateNow.setDate(diff));
    } else if (period === "monthly") {
      startDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1); // Start of the month
    } else {
      return res.status(400).json({ error: "Invalid period parameter" });
    }

    console.log("Period:", period); // Log the period
    console.log("Start Date:", startDate); // Log the start date for the given period

    // Fetch gift cards with buyers who have purchased after the start date
    const allGiftCards = await GiftCard.find({
      "buyers.purchaseDate": { $gte: startDate },
    });

    console.log("Fetched Gift Cards:", allGiftCards.length); // Log the number of gift cards found

    // Aggregate sales based on the selected period
    const salesData = allGiftCards.reduce((acc, card) => {
      card.buyers.forEach((buyer) => {
        if (buyer.purchaseDate >= startDate) {
          const saleDate = new Date(buyer.purchaseDate);
          const dateKey = `${saleDate.getFullYear()}-${saleDate.getMonth() + 1}-${saleDate.getDate()}`; // 'YYYY-MM-DD'

          if (!acc[dateKey]) {
            acc[dateKey] = 0;
          }
          acc[dateKey]++;
        }
      });
      return acc;
    }, {});

    console.log("Aggregated Sales Data:", salesData); // Log aggregated sales data

    res.status(200).json({ salesData });
  } catch (error) {
    console.error("Error in getSalesTrends:", error);
    res.status(500).json({ error: "Failed to fetch sales trends" });
  }
};

const getSalesData = async (req, res) => {
  try {
    // Get the current date and 30 days ago
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30); // 30 days range

    console.log("Start Date (30 days ago):", startDate);
    console.log("End Date:", endDate);

    // Query the database for sales data in the past 30 days based on the 'purchaseDate' of buyers
    const salesData = await GiftCard.aggregate([
      {
        $unwind: "$buyers", // Unwind the 'buyers' array to work with each individual purchase
      },
      {
        $match: {
          "buyers.purchaseDate": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$buyers.purchaseDate" } }, // Group by purchaseDate
          sales: { $sum: 1 }, // Sum the sales for each day
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date (ascending)
      },
    ]);

    console.log("Sales Data (raw aggregation):", salesData);

    // If no sales data is found, send a message indicating that
    if (!salesData.length) {
      console.log("No sales data found for the given date range.");
      return res.status(200).json([]);
    }

    // Format the data to match the expected structure for the frontend
    const formattedData = salesData.map((item) => ({
      date: item._id,
      sales: item.sales,
    }));

    console.log("Formatted Sales Data:", formattedData);
    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return res.status(500).json({ message: "Error fetching sales data" });
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


const sendOtp = async (req, res) => {
  const { email, redeemAmount } = req.body;
  console.log("sendOtp function triggered with request body:", req.body);

  try {
    if (!email) {
      console.log("Email is missing in the request body.");
      return res.status(400).json({ message: "Email is required" });
    }
    console.log("Checking if email exists:", email);
    // Find the gift card by matching the email with either the buyer's or recipient's email
    const giftCard = await GiftCard.findOne({
      $or: [
        { "buyers.selfInfo.email": email }, // Buyer email
        { "buyers.giftInfo.recipientEmail": email }, // Recipient email
      ],
    });

    if (!giftCard) {
      console.log("Gift card not found for email:", email);
      return res.status(404).json({ message: "Gift card not found" });
    }
    console.log("Gift card found:", giftCard);

    const { otp, expiresAt } = generateOtp();

    // Save OTP to the gift card
    giftCard.otp = { code: otp, expiresAt };
    await giftCard.save();

    console.log("OTP generated and saved:", otp);

    // Determine whether to send OTP to the buyer or recipient email
    const emailToSendOtp = giftCard.buyers.some(
      (buyer) => buyer.selfInfo.email === email
    )
      ? email // If it's the buyer's email
      : giftCard.buyers[0]?.giftInfo?.recipientEmail; // Otherwise, send to recipient's email

    if (!emailToSendOtp) {
      console.log("Recipient email not found for gift card.");
      return res.status(400).json({ message: "Recipient email not found" });
    }
    console.log("Email to send OTP:", emailToSendOtp);

    // Send OTP via email, including redeem amount
    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: emailToSendOtp,
      subject: "Your OTP for Gift Card Redemption",
      // Keep the content in plain text
      text: `Your OTP is ${otp}. It is valid for 10 minutes.\n\nAmount to Redeem: ₹${redeemAmount}`,
      encoding: "utf-8", // Ensuring proper encoding
    };
    
    
    console.log("Mail Options:", mailOptions);
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: "OTP sent successfully along with redeem amount" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Check if the email belongs to the buyer or recipient and search for the gift card
    const giftCard = await GiftCard.findOne({
      $or: [
        { "buyers.selfInfo.email": email },
        { "buyers.giftInfo.recipientEmail": email },  // Added check for recipient's email
      ],
    });

    if (!giftCard) {
      return res.status(404).json({ message: "Gift card not found" });
    }

    // Validate OTP
    const isOtpValid =
      giftCard.otp &&
      giftCard.otp.code === otp &&
      giftCard.otp.expiresAt > new Date();

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear the OTP after verification
    giftCard.otp = null;
    await giftCard.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};



// const redeemGiftCard = async (req, res) => {
//   try {
//     const { qrCode, amount } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: "Invalid redeem amount." });
//     }

//     // Find the gift card based on the unique QR code
//     const giftCard = await GiftCard.findOne({ "buyers.qrCode.uniqueCode": qrCode });

//     if (!giftCard) {
//       return res.status(404).json({ message: "Invalid QR code" });
//     }

//     // Find the buyer using the unique QR code
//     const buyer = giftCard.buyers.find((buyer) => buyer.qrCode.uniqueCode === qrCode);
//     if (!buyer || buyer.status === "redeemed") {
//       return res.status(400).json({ message: "QR code already redeemed or invalid" });
//     }

//     // Check if the redeem amount does not exceed available balance
//     if (amount > giftCard.amount) {
//       return res.status(400).json({ message: "Amount exceeds available balance" });
//     }

//     // Proceed with redemption
//     buyer.status = "redeemed";
//     buyer.usedDate = new Date();

//     // Calculate the remaining amount after redemption
//     const remainingAmount = giftCard.amount - amount;

//     // Add to redemption history
//     giftCard.redemptionHistory.push({
//       redeemedAmount: amount,
//       redemptionDate: new Date(),
//       originalAmount: giftCard.amount,
//       remainingAmount: remainingAmount,
//     });

//     // Deduct the redeem amount from the gift card's balance
//     giftCard.amount = remainingAmount;

//     // Save the updated gift card
//     const updatedGiftCard = await giftCard.save();

//     // Respond with success and updated data
//     res.status(200).json({
//       message: "Gift card redeemed successfully",
//       buyer,
//       redemptionHistory: updatedGiftCard.redemptionHistory,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
const redeemGiftCard = async (req, res) => {
  try {
    const { qrCode, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid redeem amount." });
    }

    // Find the gift card based on the unique QR code
    const giftCard = await GiftCard.findOne({ "buyers.qrCode.uniqueCode": qrCode });

    if (!giftCard) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    // Find the buyer using the unique QR code
    const buyer = giftCard.buyers.find((buyer) => buyer.qrCode.uniqueCode === qrCode);
    if (!buyer) {
      return res.status(400).json({ message: "Buyer not found for the given QR code" });
    }

    // Check if the redeem amount does not exceed available balance for the buyer
    const remainingBalance = giftCard.amount - (buyer.usedAmount || 0);
    if (amount > remainingBalance) {
      return res.status(400).json({ message: "Amount exceeds available balance for the buyer." });
    }

    // Update buyer's details
    buyer.usedAmount = (buyer.usedAmount || 0) + amount; // Update the used amount
    buyer.remainingBalance = giftCard.amount - buyer.usedAmount; // Update the remaining balance
    buyer.status = buyer.remainingBalance === 0 ? "redeemed" : "partial"; // Set status to 'redeemed' if balance is 0
    buyer.usedDate = new Date();

    // Add to redemption history
    giftCard.redemptionHistory.push({
      redeemedAmount: amount,
      redemptionDate: new Date(),
      originalAmount: giftCard.amount, // Keep the original amount intact
      remainingAmount: buyer.remainingBalance, // Track remaining balance
    });

    // Save the updated gift card
    const updatedGiftCard = await giftCard.save();

    // Respond with success and updated data
    res.status(200).json({
      message: "Gift card redeemed successfully",
      buyer,
      redemptionHistory: updatedGiftCard.redemptionHistory,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// const redeemGiftCard = async (req, res) => {
//   try {
//     console.log("Request body:", req.body);
//     const { qrCode, userAmount } = req.body; // Renamed `amount` to `redeemAmount`

//     if (!userAmount || userAmount <= 0) {
//       return res.status(400).json({ message: "Invalid redeem amount." });
//     }

//     // Find the gift card based on the unique QR code
//     const giftCard = await GiftCard.findOne({ "buyers.qrCode.uniqueCode": qrCode });

//     if (!giftCard) {
//       return res.status(404).json({ message: "Gift card not found." });
//     }

//     // Find the buyer using the unique QR code
//     const buyer = giftCard.buyers.find((buyer) => buyer.qrCode.uniqueCode === qrCode);
    
//     if (!buyer || buyer.status === "redeemed") {
//       return res.status(400).json({ message: "QR code already redeemed or invalid" });
//     }

//     // Check if the redeem amount does not exceed the buyer's balance
//     if (userAmount > buyer.balance) {
//       return res.status(400).json({ message: "Redeem amount exceeds available balance" });
//     }

//     // Calculate the remaining balance after redemption
//     const remainingBalance = buyer.balance - userAmount;

//     // Add to redemption history
//     giftCard.redemptionHistory.push({
//       redeemedAmount: redeemAmount,
//       redemptionDate: new Date(),
//       originalAmount: amount, // Original balance before redemption
//       remainingAmount: remainingBalance, // Updated balance after redemption
//     });

//     // Update the buyer's balance in the buyers array
//     buyer.balance = remainingBalance;
//     buyer.status = "redeemed"; // Set the buyer status to redeemed
//     buyer.usedDate = new Date(); // Store the date of redemption

//     // Save the updated gift card with the new balance and redemption history
//     const updatedGiftCard = await giftCard.save();

//     // Respond with success and updated data
//     res.status(200).json({
//       message: "Gift card redeemed successfully",
//       buyer,
//       redemptionHistory: updatedGiftCard.redemptionHistory,
//       updatedBalance: remainingBalance, // Send the updated balance
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };




module.exports = {
  createGiftCard,
  getGiftCardById,
  fetchGiftCardById,
  getAllGiftCards,
  getTotalGiftCardsSold,
  getTotalRevenue,
  getSalesTrends,
  getSalesData,
  updateGiftCard,
  deleteGiftCard,
  addBuyer,
  redeemGiftCard,
  sendOtp,
  verifyOtp,
};
