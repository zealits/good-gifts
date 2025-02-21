const jwt = require("jsonwebtoken");
const { GoogleAuth } = require("google-auth-library");
const path = require("path");
const GiftCard = require("../models/giftCardSchema");



const credentials = {
  type: "service_account",
  project_id: "turing-reach-420001",
  private_key_id: "f02df85cb5e9b0de49207c7659d3231e9b44b0f1",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDXzlbZggQUn7lB\n5YA/Fjtfo/qGiiuwmr/UlT23yOrNJBhl1widmK5srejAhas/fZnY078crpznaY6y\nLcHucuMXw37GiFBhQsuwS6an17u4Z9Ttsw7dsoYP/dkh5YZ619Kk1REZKQE8evtR\nx+eVFEhOvMyUrUS2dvqYMK5rkyfAdxRTkbT1sCnTtHYgD+wQpaD/Qoel13GZlkr6\nB/bZz3Zqphr2KYxaXqbfCvV00o4SCLD1Qy5CR1r7pSZ/5ROgQ8IS1ZGEOwYIfFA8\nc6NYEExuzi8PRm/tsJbTA8buuCli/Lc5KEUBXrKHd2fy5gXClaGIiFnFBBZP57Tl\nIZwgd3HnAgMBAAECggEAB92l16b9KIqOMs1oHipcjXg6yoGvfIdQKNTmRvz58fJm\nflh/wypmlvd+UcMwaCy/zbNnMJWIW/zCa3WdUiKLsNA6nlhtO2nxTwhtC7kWu0Ah\n9rIu/3CP0DBQGKa8rYtieQkGuFXd6mVVgYmWrMC99N3Uz9UIM8K74byQJMOiJ6ce\nUIBfIaMo4iG/6yA+rZPy3vKDCrHm2gZBcTT1cZTsO6vgH1a0m0K7oBo5FUE6gj96\nbVIvRR5caPwI0OaEI674U7FhOJPCyaaFEBYDPlExI//m4e8Skifz53jM0QPG4EJI\n3XMJeN8QsHGVNee2Gu9nzDn6Ke0tCJyAir8IORkyAQKBgQD33kJG9O76SMyyaZ+n\n0GU4IJXScgMaU7xzJcTZAjT2z1afsFa7oAeuEZOX/Cu8RWkD59QUh2ul8RRSeoEw\nTZJOblt+wB8m4wp0UcY6cQnZQ4eZVo7AfiERkK5efVUR41UKqy5sY98GdQocYoW8\nW1tbrG6WGlRwaHUljc4DbzdmQQKBgQDe4s2yJISqoVfb5c9HfC4fhydUvKwS9vjX\n2Qg4YcZNWTRDURhEdKcPQfxw0V/g+ePNge4zBM5fBk8qAfRR17frdyplkHvs1Gao\nCjna22d3t8VmLNYRRuqR1JgOa6I8hGbmnF3iGFEDOYFOCPhjnq1fdtHhLZUQfi2n\nE7f6prteJwKBgQD1M6ndB/BhKCNXW6XVHRMEszeDN8ZaBPwn7PUOuGAsyG+pCYjD\nk0wFpt2bPJsHZKK+elgS9uRHBHZWIVorrpFNhV59xREMJw3wg/TVW32isGs0Bayy\nQBP2jGnyj4nYaEt4gl8qWqIGgUG/Urd53eZCihHb67AcgzlgLSffveXQAQKBgQC3\nSt8Lu9paE/sTvGZ8jBPGG7htiAceRXoYz8Nh0o5od45yOZNyYFguRP6brKNjeT0s\neMhxrmckYCTkD91jHLqEamg0Q+CVv4p4cIhpgfsRydANGZwlcyNeL+2oFj3B9MRG\nq5rNX1/n/fdnPBtAmXJMSoOI4ZpviMR0XNP0zf7SCwKBgQDOX5ZgXoK/3XvTLZV2\nZNfyVnVu4CUa1I5YQk1v0C+kw92IZVfq3rHwTLfsC8Ux4TCiamwZmQH73B2RB0TD\nm6xh/bDQtY70dF/vGMouA/InaRevCeXIg5cSZex55gCiXBdhDpLGIZsQUB+JANSD\nQqU68v0UZWD7oBxVVhA3Bo/LEg==\n-----END PRIVATE KEY-----\n",
  client_email: "giftcard-wallet-service-accoun@turing-reach-420001.iam.gserviceaccount.com",
  client_id: "116194697722166493678",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/giftcard-wallet-service-accoun%40turing-reach-420001.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}; // Make sure this file contains client_email and private_key

const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID; // Replace with actual issuer ID
const baseUrl = "https://walletobjects.googleapis.com/walletobjects/v1";

// Initialize Google Auth Client
const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
});

async function createGiftCardClass(giftCardName) {
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

    const userEmail = purchaseType === "self" ? selfInfo.email : giftInfo.recipientEmail || "default@example.com";
    const userName = purchaseType === "self" ? selfInfo.name : giftInfo.recipientName || "Gift Card Holder";
    const amount = giftCardDetails.amount || "0";
    const currency = paymentDetails.currency || "USD";

    // Generate the same unique QR code as used in email
    const uniqueCode = `${id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const aiiLogo = "https://res.cloudinary.com/dzmn9lnk5/image/upload/v1739316421/Aii/Aii_nobackground_ym8wyn.png"

    console.log("Creating gift card...");
    const classId = await createGiftCardClass(walletGiftCardName);
    const objectId = `${issuerId}.${userEmail.replace(/[^\w.-]/g, "_")}.${id}`;

    let giftCardObject = {
      id: objectId,
      classId: classId,
      genericType: "GENERIC_TYPE_UNSPECIFIED",
      hexBackgroundColor: "#4158D0",
      hexForegroundColor: "#FFFFFF",
      logo: {
        sourceUri: { uri: aiiLogo },
        contentDescription: {
          defaultValue: { language: "en-US", value: "Aii Logo" },
        },
      },
      cardTitle: { defaultValue: { language: "en", value: walletGiftCardName } },
      subheader: { defaultValue: { language: "en", value: `${currency} ${amount}` } },
      header: { defaultValue: { language: "en", value: userName } },
      barcode: { 
        type: "QR_CODE", 
        value: uniqueCode,  // Using the same unique code format as email QR
       
      },
      heroImage: {
        sourceUri: { uri: giftCardDetails.giftCardImg },
        contentDescription: {
          defaultValue: {
            language: "en-US",
            value: `${walletGiftCardName} Gift Card`,
          },
        },
        dimensions: {
          height: "130px",
          width: "100%",
        },
      },
      textModulesData: [
        {
          header: "Gift Card Details",
          body: `Value: ${currency} ${amount}\nScan QR code to redeem`,
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

    // Save the QR code details to the gift card document
    const buyerDetails = {
      purchaseType,
      selfInfo: purchaseType === "self" ? selfInfo : undefined,
      giftInfo: purchaseType === "gift" ? giftInfo : undefined,
      paymentDetails,
      purchaseDate: new Date(),
      qrCode: {
        uniqueCode,
        createdAt: new Date(),
        isUsed: false,
      },
      remainingBalance: amount,
    };

    // Add buyer to gift card
    giftCardDetails.buyers.push(buyerDetails);
    await giftCardDetails.save();

    console.log("Generated Save URL:", saveUrl);
    res.json({ saveUrl });
  } catch (error) {
    console.error("Error generating wallet pass:", error);
    res.status(500).json({ error: "Failed to generate Google Wallet pass." });
  }
}
module.exports = generateWalletPass;