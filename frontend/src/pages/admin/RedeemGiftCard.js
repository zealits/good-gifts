import React, { useState } from "react";
import axios from "axios";
import QRScanner from "./QRScanner.js";
import "./RedeemGiftCard.css";

const RedeemGiftCard = () => {
  // Define state for originalAmount and updatedBalance
  const [giftCard, setGiftCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [updatedBalance, setUpdatedBalance] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [qrUniqueCode, setqrUniqueCode] = useState(null);

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

  const fetchGiftCard = async (data) => {
    try {
      let cardId;
      console.log("data :", data);
      setqrUniqueCode(data);

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

      // Open modal to display card details
      setIsModalOpen(true);

      // Search for the buyer matching the scanned QR code
      const scannedBuyer = giftCard.buyers.find((buyer) => buyer.qrCode.uniqueCode === data);

      if (scannedBuyer) {
        setSelectedBuyer(scannedBuyer);
        setUpdatedBalance(scannedBuyer.remainingBalance || giftCard.amount); // Set balance to remaining balance
      } else {
        alert("No buyer found for the scanned QR code.");
      }

      console.log("Gift Card Details:", giftCard);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gift card not found.";
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
      console.log(qrUniqueCode);
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

      console.log("Sending OTP to:", emailToSendOtp, "with redeem amount:", redeemAmount);

      // Make API call to the backend to send OTP
      const response = await axios.post("/api/v1/admin/send-otp-redeem", {
        email: emailToSendOtp,
        redeemAmount,
        qrUniqueCode,
        // Assuming selectedBuyer has the giftCardId
      });

      console.log("Server response:", response.data);

      if (response.data.success) {
        setIsOtpSent(true);
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage = error.response?.data?.message || "Failed to send OTP.";
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
      // Add the giftCardId

      const emailToVerifyOtp = recipientEmail || buyerEmail;

      if (!emailToVerifyOtp) {
        alert("Email is missing. Cannot verify OTP.");
        return;
      }

      const response = await axios.post("/api/v1/admin/verify-otp-redeem", {
        email: emailToVerifyOtp,
        qrUniqueCode,
        // Include giftCardId in the request
        otp,
      });

      console.log(response);
      if (response.data.success) {
        console.log(response.data.success);
        setIsOtpVerified(true);
        console.log("asdfadsf : ", isOtpVerified);
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to verify OTP.";
      alert(errorMessage);
    }
  };

  const handleRedeemGiftCard = async (qrCode, amount) => {
    try {
      if (!qrCode || !amount || amount <= 0) {
        throw new Error("Invalid QR code or redeem amount.");
      }
  
      // Send the QR code and amount to the backend for redemption
      const response = await axios.post("/api/v1/admin/redeem", {
        qrCode,
        amount,
      });
  
      console.log("Redemption successful:", response.data);
  
      const { buyer } = response.data;
  
      // Update the selected buyer's state
      setSelectedBuyer((prevBuyer) => ({
        ...prevBuyer,
        ...buyer,
        remainingBalance: buyer.remainingBalance,
        redemptionHistory: buyer.redemptionHistory, // Update redemption history
      }));
  
      // Update the gift card state with the updated buyer data
      setGiftCard((prevCard) => {
        const updatedBuyers = prevCard.buyers.map((b) =>
          b.qrCode.uniqueCode === qrCode
            ? { ...b, ...buyer, redemptionHistory: buyer.redemptionHistory }
            : b
        );
  
        return {
          ...prevCard,
          buyers: updatedBuyers,
        };
      });
  
      setRedeemAmount(""); // Clear redeem amount field
      alert("Redeem successful!");
  
      handleCloseModal(); // Close the modal after successful redemption
    } catch (error) {
      console.error("Error during redemption:", error);
      const errorMessage = error.response?.data?.message || "Redemption failed.";
      alert(errorMessage);
    }
  };
  
  return (
    <div>
      <h1 className="heading">Redeem GiftCard</h1>
      <QRScanner onScan={handleQRScan} />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h3>Gift Card Details</h3>
            <div className="form-container">
            <form className="redeem-form">
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
                <input type="number" value={giftCard.amount} readOnly /> {/* Keep the original amount */}
              </label>
              <label>
                Remaining Balance:
                <input type="number" value={selectedBuyer.remainingBalance || giftCard.amount} readOnly />
                {/* Update balance */}
              </label>
              <label>
                Status:
                <input type="text" value={giftCard.status} readOnly />
              </label>
              <label>
                Expiration Date:
                <input type="text" value={new Date(giftCard.expirationDate).toLocaleDateString()} readOnly />
              </label>
              <h4>{selectedBuyer?.giftInfo?.recipientEmail ? "Recipient Details" : "Buyer Details"}</h4>

              {/* Display buyer or recipient details */}
              <label>
                {selectedBuyer?.giftInfo?.recipientEmail ? "Recipient Name" : "Buyer Name"}
                :
                <input
                  type="text"
                  value={selectedBuyer?.giftInfo?.recipientName || selectedBuyer?.selfInfo?.name || ""}
                  readOnly
                />
              </label>

              <label>
                {selectedBuyer?.giftInfo?.recipientEmail ? "Recipient Email" : "Buyer Email"}
                :
                <input
                  type="text"
                  value={selectedBuyer?.giftInfo?.recipientEmail || selectedBuyer?.selfInfo?.email || ""}
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
                    const availableBalance = selectedBuyer?.remainingBalance ?? giftCard.amount; // Fallback to original amount if remainingBalance is undefined

                    if (enteredAmount > 0 && enteredAmount <= availableBalance) {
                      setRedeemAmount(enteredAmount);
                    } else if (enteredAmount > availableBalance) {
                      alert("Redeem amount exceeds the available balance.");
                    } else {
                      setRedeemAmount(""); // Clear invalid input
                    }
                  }}
                />
              </label>

              {/* Send OTP */}
              <button type="button" className="send-otp-btn"
               onClick={handleSendOTP}>
                Send OTP
              </button>
              {isOtpSent && (
                <div>
                  <label>
                    Enter OTP:
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  </label>
                  <button type="button" className="verify-otp-btn" onClick={handleVerifyOTP}>
                    Verify OTP
                  </button>
                </div>
              )}

              {isOtpVerified && <p>OTP verified successfully!</p>}

              {/* Redeem Button only after OTP is verified */}
              {isOtpVerified && (
                <button
                  type="button"
                  className="redeem-btn"
                  onClick={() => handleRedeemGiftCard(selectedBuyer?.qrCode?.uniqueCode, redeemAmount)}
                >
                  Redeem Gift Card
                </button>
              )}
            </form>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemGiftCard;

// const handleRedeemGiftCard = async (qrCode, amount) => {
//   try {
//     if (!qrCode || !amount || amount <= 0) {
//       throw new Error("Invalid QR code or redeem amount.");
//     }

//     const response = await axios.post("/api/v1/admin/redeem", {
//       qrCode,
//       amount,
//     });

//     console.log("Redemption successful:", response.data);

//     // Update local gift card data, only update the balance, not the amount
//     setGiftCard((prevCard) => ({
//       ...prevCard,
//       redemptionHistory: response.data.redemptionHistory,
//     }));

//     setUpdatedBalance((prev) => prev - amount); // Update only the balance
//     setRedeemAmount(""); // Clear redeem amount field
//     alert("Redeem successful!");

//     handleCloseModal();
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message || "Redemption failed.";
//     alert(errorMessage);
//   }
// };

// const handleRedeemGiftCard = async (qrCode, amount) => {
//   try {
//     if (!qrCode || !amount || amount <= 0) {
//       throw new Error("Invalid QR code or redeem amount.");
//     }

//     const response = await axios.post("/api/v1/admin/redeem", {
//       qrCode,
//       amount,
//     });

//     console.log("Redemption successful:", response.data);

//     // Assuming the backend returns the updated balance and redemption history
//     const { updatedBalance, redemptionHistory } = response.data;

//     // Update local state to reflect the new balance and redemption history
//     setGiftCard((prevCard) => ({
//       ...prevCard,
//       redemptionHistory, // Update redemption history
//       balance: updatedBalance, // Update the balance, not the original amount
//     }));

//     setUpdatedBalance(updatedBalance); // Update balance for UI
//     setRedeemAmount(""); // Clear redeem amount field
//     alert("Redeem successful!");

//     handleCloseModal();
//   } catch (error) {
//     console.error("Error during redemption:", error);
//     const errorMessage =
//       error.response?.data?.message || "Redemption failed.";
//     alert(errorMessage);
//   }
// };
// const handleRedeemGiftCard = async (qrCode, amount) => {
//   try {
//     if (!qrCode || !amount || amount <= 0) {
//       throw new Error("Invalid QR code or redeem amount.");
//     }

//     // Send the QR code and amount to the backend for redemption
//     const response = await axios.post("/api/v1/admin/redeem", {
//       qrCode,
//       amount,
//     });

//     console.log("Redemption successful:", response.data);

//     // Assuming the backend returns updated buyer data and redemption history
//     const { buyer, redemptionHistory } = response.data;

//     // Update local state to reflect the new buyer data and redemption history
//     setGiftCard((prevCard) => {
//       const updatedBuyers = prevCard.buyers.map((b) =>
//         b.qrCode.uniqueCode === qrCode ? { ...b, ...buyer } : b
//       );

//       return {
//         ...prevCard,
//         buyers: updatedBuyers, // Update the specific buyer's data
//         redemptionHistory, // Update redemption history
//       };
//     });

//     setRedeemAmount(""); // Clear redeem amount field
//     alert("Redeem successful!");

//     handleCloseModal();
//   } catch (error) {
//     console.error("Error during redemption:", error);
//     const errorMessage =
//       error.response?.data?.message || "Redemption failed.";
//     alert(errorMessage);
//   }
// };

// const handleRedeemGiftCard = async (qrCode, userAmount) => {
//   try {
//     if (!qrCode || !userAmount || userAmount <= 0) {
//       throw new Error("Invalid QR code or redeem amount.");
//     }

//     const response = await axios.post("/api/v1/admin/redeem", {
//       qrCode,
//       redeemAmount, // Rename the argument to redeemAmount
//     });

//     console.log("Redemption successful:", response.data);

//     // Assuming the backend returns the updated balance and redemption history
//     const { updatedBalance, redemptionHistory } = response.data;

//     // Update local state to reflect the new balance and redemption history
//     setGiftCard((prevCard) => ({
//       ...prevCard,
//       redemptionHistory, // Update redemption history
//       balance: updatedBalance, // Update the balance with the updated value
//     }));

//     setUpdatedBalance(updatedBalance); // Update balance for UI
//     setRedeemAmount(""); // Clear redeem amount field
//     alert("Redeem successful!");

//     handleCloseModal();
//   } catch (error) {
//     console.error("Error during redemption:", error);
//     const errorMessage =
//       error.response?.data?.message || "Redemption failed.";
//     alert(errorMessage);
//   }
// };

// Fetch the gift card by scanning the QR code
// const fetchGiftCard = async (data) => {
//   try {
//     let cardId;

//     // Check if data is a URL or plain text
//     if (data.startsWith("http")) {
//       const url = new URL(data);
//       cardId = url.pathname.split("/").pop();
//     } else {
//       cardId = data.trim();
//     }

//     if (!cardId) {
//       alert("Invalid QR code data.");
//       return;
//     }

//     console.log("Fetching Gift Card for ID:", cardId);

//     const { data: giftCard } = await axios.get(`/api/v1/admin/scan-giftcard/${cardId}`);
//     setGiftCard(giftCard);

//      // Set the balance to the original amount
//     setIsModalOpen(true);

//     // Search for the buyer matching the scanned QR code
//     const scannedBuyer = giftCard.buyers.find(buyer => buyer.qrCode.uniqueCode === data);

//     if (scannedBuyer) {
//       setSelectedBuyer(scannedBuyer);
//       setUpdatedBalance(scannedBuyer.usedAmount || 0);
//     } else {
//       alert("No buyer found for the scanned QR code.");
//     }

//     console.log("Gift Card Details:", giftCard);
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message || "Gift card not found.";
//     alert(`Error: ${errorMessage}`);
//   }
// };
