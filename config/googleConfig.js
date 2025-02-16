const { google } = require("googleapis");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/wallet_object.issuer"];

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "wallet-api-key.json"), // Ensure this matches your new JSON file
  scopes: SCOPES,
});

module.exports = auth;