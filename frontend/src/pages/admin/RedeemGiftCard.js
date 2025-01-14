
import React, { useState } from "react";
import axios from "axios";
import QRScanner from "./QRScanner";
import "./RedeemGiftCard.css"; // Add a CSS file for styling the modal



const RedeemGiftCard = () => {
  // Define state for originalAmount and updatedBalance
  const [giftCard, setGiftCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [updatedBalance, setUpdatedBalance] = useState(""); 
  const [originalAmount, setOriginalAmount] = useState(""); // Store the original amount
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // Handle QR scan
  const handleQRScan = (code) => {
    if (!code || code.trim() === "") {
      console.error("Invalid QR Code detected");
      alert("Invalid QR Code. Please scan again.");
      return;
    }
    console.log("QR Code Scanned:", code);
    fetchGiftCard(code);
  };

  // Fetch the gift card by scanning the QR code
  const fetchGiftCard = async (data) => {
    try {
      let cardId;
  
      // Check if data is a URL or plain text
      if (data.startsWith("http")) {
        const url = new URL(data);
        cardId = url.pathname.split("/").pop();
      } else {
        cardId = data.trim();
      }
  
      if (!cardId) {
        alert("Invalid QR code data.");
        return;
      }
  
      console.log("Fetching Gift Card for ID:", cardId);
  
      const { data: giftCard } = await axios.get(`/api/v1/admin/scan-giftcard/${cardId}`);
      setGiftCard(giftCard);
      setOriginalAmount(giftCard.amount); // Set the original amount
      setUpdatedBalance(giftCard.amount); // Set the balance to the original amount
      setIsModalOpen(true);
  
      // Search for the buyer matching the scanned QR code
      const scannedBuyer = giftCard.buyers.find(buyer => buyer.qrCode.uniqueCode === data);
  
      if (scannedBuyer) {
        setSelectedBuyer(scannedBuyer);
      } else {
        alert("No buyer found for the scanned QR code.");
      }
  
      console.log("Gift Card Details:", giftCard);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gift card not found.";
      alert(`Error: ${errorMessage}`);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGiftCard(null);
    setRedeemAmount("");
    setIsOtpSent(false);
    setOtp("");
    setIsOtpVerified(false);
    setSelectedBuyer(null);
  };

  const handleSendOTP = async () => {
    try {
      const buyerEmail = selectedBuyer?.selfInfo?.email;
      const recipientEmail = selectedBuyer?.giftInfo?.recipientEmail;
  
      if (!buyerEmail && !recipientEmail) {
        alert("Buyer or recipient email is missing. Cannot send OTP.");
        return;
      }
  
      const emailToSendOtp = recipientEmail || buyerEmail;
  
      if (!redeemAmount || redeemAmount <= 0) {
        alert("Enter a valid redeem amount before sending OTP.");
        return;
      }
  
      const response = await axios.post("/api/v1/admin/send-otp", {
        email: emailToSendOtp,
        redeemAmount,
      });
  
      if (response.data.message) {
        setIsOtpSent(true);
        alert(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP.";
      alert(errorMessage);
    }
  };
  
  const handleVerifyOTP = async () => {
    try {
      if (!otp) {
        alert("OTP is missing.");
        return;
      }
  
      const buyerEmail = selectedBuyer?.selfInfo?.email;
      const recipientEmail = selectedBuyer?.giftInfo?.recipientEmail;
  
      const emailToVerifyOtp = recipientEmail || buyerEmail;
  
      if (!emailToVerifyOtp) {
        alert("Email is missing. Cannot verify OTP.");
        return;
      }
  
      const response = await axios.post("/api/v1/admin/verify-otp", {
        email: emailToVerifyOtp,
        otp,
      });
  
      if (response.data.message) {
        setIsOtpVerified(true);
        alert(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to verify OTP.";
      alert(errorMessage);
    }
  };

  const handleRedeemGiftCard = async (qrCode, amount) => {
    try {
      if (!qrCode || !amount || amount <= 0) {
        throw new Error("Invalid QR code or redeem amount.");
      }
  
      const response = await axios.post("/api/v1/admin/redeem", {
        qrCode,
        amount,
      });
  
      console.log("Redemption successful:", response.data);
  
      // Update local gift card data, only update the balance, not the amount
      setGiftCard((prevCard) => ({
        ...prevCard,
        redemptionHistory: response.data.redemptionHistory,
      }));
  
      setUpdatedBalance((prev) => prev - amount); // Update only the balance
      setRedeemAmount(""); // Clear redeem amount field
      alert("Redeem successful!");
  
      handleCloseModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Redemption failed.";
      alert(errorMessage);
    }
  };

  return (
    <div>
      <h2>Scan QR Code to Fetch Gift Card</h2>
      <QRScanner onScan={handleQRScan} />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={handleCloseModal}>
              &times;
            </button>
            <h3>Gift Card Details</h3>
            <form>
              <label>
                Gift Card Name:
                <input type="text" value={giftCard.giftCardName} readOnly />
              </label>
              <label>
                Tag:
                <input type="text" value={giftCard.giftCardTag} readOnly />
              </label>
              <label>
                Description:
                <textarea value={giftCard.description} readOnly />
              </label>
              <label>
                Amount:
                <input type="number" value={originalAmount} readOnly /> {/* Keep the original amount */}
              </label>
              <label>
                Balance:
                <input type="number" value={updatedBalance} readOnly /> {/* Update balance */}
              </label>
              <label>
                Status:
                <input type="text" value={giftCard.status} readOnly />
              </label>
              <label>
                Expiration Date:
                <input
                  type="text"
                  value={new Date(giftCard.expirationDate).toLocaleDateString()}
                  readOnly
                />
              </label>
              <h4>
                {selectedBuyer?.giftInfo?.recipientEmail
                  ? "Recipient Details"
                  : "Buyer Details"}
              </h4>

              {/* Display buyer or recipient details */}
              <label>
                {selectedBuyer?.giftInfo?.recipientEmail
                  ? "Recipient Name"
                  : "Buyer Name"}:
                <input
                  type="text"
                  value={selectedBuyer?.giftInfo?.recipientName ||
                    selectedBuyer?.selfInfo?.name ||
                    ""}
                  readOnly
                />
              </label>

              <label>
                {selectedBuyer?.giftInfo?.recipientEmail
                  ? "Recipient Email"
                  : "Buyer Email"}:
                <input
                  type="text"
                  value={selectedBuyer?.giftInfo?.recipientEmail ||
                    selectedBuyer?.selfInfo?.email ||
                    ""}
                  readOnly
                />
              </label>

              {/* Redeem Amount Section */}
              <label>
                Enter Amount to Redeem:
                <input
                  type="number"
                  value={redeemAmount}
                  onChange={(e) => {
                    const enteredAmount = Number(e.target.value);
                    if (enteredAmount > 0 && enteredAmount <= updatedBalance) {
                      setRedeemAmount(enteredAmount);
                    } else if (enteredAmount > updatedBalance) {
                      alert("Redeem amount exceeds the available balance.");
                    } else {
                      setRedeemAmount(""); // Clear invalid input
                    }
                  }}
                />
              </label>

              {/* Send OTP */}
              <button type="button" onClick={handleSendOTP}>
                Send OTP
              </button>
              {isOtpSent && (
                <div>
                  <label>
                    Enter OTP:
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </label>
                  <button type="button" onClick={handleVerifyOTP}>
                    Verify OTP
                  </button>
                </div>
              )}

              {isOtpVerified && <p>OTP verified successfully!</p>}

              {/* Redeem Button only after OTP is verified */}
              {isOtpVerified && (
                <button
                  type="button"
                  onClick={() =>
                    handleRedeemGiftCard(
                      giftCard.buyers[0]?.qrCode?.uniqueCode,
                      redeemAmount
                    )
                  }
                >
                  Redeem Gift Card
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemGiftCard;
