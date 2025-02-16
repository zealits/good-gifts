const jwt = require("jsonwebtoken");
const { GoogleAuth } = require("google-auth-library");
const path = require("path");
const GiftCard = require("../models/giftCardSchema");

// Google Wallet API Credentials
const credentials = {
  
}; // Make sure this file contains client_email and private_key

const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID; // Replace with actual issuer ID
const baseUrl = "https://walletobjects.googleapis.com/walletobjects/v1";

// Initialize Google Auth Client
const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
});

async function createGiftCardClass(giftCardName,description,gifcardImage,expiryDate,aiiLogo) {
  console.log("hit hitted");
  const formattedName = giftCardName.replace(/\s+/g, "_").toLowerCase();
  const classId = `${issuerId}.${formattedName}_class`;

  try {
    await httpClient.request({ url: `${baseUrl}/genericClass/${classId}`, method: "GET" });
    console.log(`Gift Card Class '${formattedName}' already exists.`);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log(`Creating new Gift Card Class: ${formattedName}`);

      const giftCardClass = {
        id: classId,
        classTemplateInfo: {
          cardTemplateOverride: {
            cardRowTemplateInfos: [
              {
                twoItems: {
                  startItem: {
                    firstValue: {
                      fields: [{ fieldPath: 'object.textModulesData["giftcard_info"]' }],
                    },
                  },
                  endItem: {
                    firstValue: {
                      fields: [{ fieldPath: 'object.textModulesData["expiry_date"]' }],
                    },
                  },
                },
              },
            ],
          },
        },
        textModulesData: [
          {
            header: "Gift Card Details",
            body: "Use this gift card for purchases.",
            id: "giftcard_info",
          },
          {
            header: "Expiration Date",
            body: "Valid until specified date.",
            id: "expiry_date",
          },
        ],
        imageModulesData: [
          {
            mainImage: {
              sourceUri: {
                uri: "https://www.concordaerospace.com/cdn/shop/products/GIFTCARD-50.png?v=1639062508",
              },
              contentDescription: {
                defaultValue: { language: "en-US", value: `${giftCardName} Gift Card` },
              },
            },
            id: "giftcard_image",
          },
        ],
      };

      await httpClient.request({ url: `${baseUrl}/genericClass`, method: "POST", data: giftCardClass });
      console.log(`Gift Card Class '${giftCardName}' created successfully.`);
    } else {
      console.error("Error checking/creating class:", err);
      throw err;
    }
  }

  return classId;
}
async function generateWalletPass(req, res) {
  try {
    console.log("Received request body1223:", req.body);
    const { id, purchaseType, selfInfo, giftInfo, paymentDetails } = req.body;

    const giftCardDetails = await GiftCard.findById(id);
    const walletGiftCardName = giftCardDetails.giftCardName;
    const expiryDate = giftCardDetails.expirationDate;
    console.log("GIFT CARD NAME : ", giftCardDetails.giftCardName);
    console.log("GIFT CARD TAG : ", giftCardDetails.giftCardTag);
    console.log("GIFT CARD DESCRIPTION : ", giftCardDetails.description);
    console.log("GIFT CARD AMOUNT : ", giftCardDetails.amount);
    console.log("GIFT CARD DISOCOUNT : ", giftCardDetails.discount);
    console.log("GIFT CARD EXT DATE : ", giftCardDetails.expirationDate); //2025-12-12T00:00:00.000Z
    console.log("GIFT CARD IMAGE : ", giftCardDetails.giftCardImg); //2025-12-12T00:00:00.000Z
    // Validate required fields
    // if (!giftCardName) return res.status(400).json({ error: "Gift card name is required." });

    const userEmail = purchaseType === "self" ? selfInfo.email : giftInfo.recipientEmail || "default@example.com";
    const userName = purchaseType === "self" ? selfInfo.name : giftInfo.recipientName || "Gift Card Holder";
    const transactionId = paymentDetails.transactionId || "UNKNOWN_TXN";
    const amount = giftCardDetails.amount || "0";
    const currency = paymentDetails.currency || "USD";

    const hotelLogo =
      "https://www.southcharlottefamilycounseling.com/wp-content/uploads/2015/10/cropped-logo-dummy.png";
    const hotelName = "Hotel Name";
    const aiiLogo = "https://res.cloudinary.com/dzmn9lnk5/image/upload/v1739316421/Aii/Aii_nobackground_ym8wyn.png"

    console.log("Creating gift card...");
    const classId = await createGiftCardClass(
      hotelLogo,
      hotelName,
      walletGiftCardName,
      giftCardDetails.description,
      giftCardDetails.giftCardImg,
      expiryDate,
      aiiLogo
    );
    const objectId = `${issuerId}.${userEmail.replace(/[^\w.-]/g, "_")}`;

    // in below gifcard object
    let giftCardObject = {
      id: objectId,
      classId: classId,
      genericType: "GENERIC_TYPE_UNSPECIFIED",
      hexBackgroundColor: "#FFD700",
      logo: {
        sourceUri: { uri: giftCardDetails.giftCardImg },
      },
      cardTitle: { defaultValue: { language: "en", value: walletGiftCardName } },
      subheader: { defaultValue: { language: "en", value: `${currency} ${amount}` } },
      header: { defaultValue: { language: "en", value: userName } },
      barcode: { type: "QR_CODE", value: transactionId },
      textModulesData: [
        {
          header: "Gift Card Details",
          body: `Value: ${currency} ${amount}\nTransaction ID: ${transactionId}`,
          id: "giftcard_info",
        },
        {
          header: "Expiration Date",
          body: `Expires on: ${expiryDate || "No Expiry"}`,
          id: "expiry_date",
        },
      ],
    };

    console.log("Class ID:", classId);
    console.log("Object ID:", objectId);

    // Create JWT Token for Google Wallet
    const claims = {
      iss: "giftcard-wallet-service-accoun@turing-reach-420001.iam.gserviceaccount.com",
      aud: "google",
      typ: "savetowallet",
      payload: { genericObjects: [giftCardObject] },
    };

    const token = jwt.sign(claims, credentials.private_key, { algorithm: "RS256" });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    console.log("Generated Save URL:", saveUrl);
    res.json({ saveUrl });
  } catch (error) {
    console.error("Error generating wallet pass:", error);
    res.status(500).json({ error: "Failed to generate Google Wallet pass." });
  }
}

module.exports = generateWalletPass;
