import React, { useState } from "react";
import "./GiftCardForm.css"; // Import CSS for styling

const GiftCardForm = ({ giftCardName, amount, discount, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [purchaseType, setPurchaseType] = useState(null);
  const totalSteps = 3;

  const handlePurchaseTypeSelect = (type) => {
    setPurchaseType(type);
  };

  const validateStep = (step) => {
    let isValid = true;

    switch (step) {
      case 1:
        if (!purchaseType) {
          isValid = false;
          alert("Please select a purchase type");
        }
        break;

      case 2:
        if (purchaseType === "self") {
          const selfName = document.getElementById("self-name").value;
          const selfEmail = document.getElementById("self-email").value;
          if (!selfName || !selfEmail) {
            isValid = false;
          }
        } else {
          const recipientName = document.getElementById("recipient-name").value;
          const recipientEmail = document.getElementById("recipient-email").value;
          const senderName = document.getElementById("sender-name").value;
          const senderEmail = document.getElementById("sender-email").value;
          if (!recipientName || !recipientEmail || !senderName || !senderEmail) {
            isValid = false;
          }
        }
        break;

      case 3:
        const cardNumber = document.getElementById("card-number").value;
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value;
        if (!cardNumber || !expiryDate || !cvv) {
          isValid = false;
        }
        break;

      default:
        break;
    }

    if (!isValid) {
      alert("Please fill in all required fields before proceeding.");
    }
    return isValid;
  };

  const updateSteps = () => {
    const selfPurchaseForm = document.getElementById("self-purchase-form");
    const giftPurchaseForm = document.getElementById("gift-purchase-form");

    if (currentStep === 2 && purchaseType === "self") {
      if (selfPurchaseForm) {
        selfPurchaseForm.style.display = "block";
      }
      if (giftPurchaseForm) {
        giftPurchaseForm.style.display = "none";
      }
    } else if (currentStep === 2 && purchaseType === "gift") {
      if (giftPurchaseForm) {
        giftPurchaseForm.style.display = "block";
      }
      if (selfPurchaseForm) {
        selfPurchaseForm.style.display = "none";
      }
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      alert("Thank you for your purchase! Your gift card will be sent via email shortly.");
    }
  };

  React.useEffect(() => {
    updateSteps();
  }, [currentStep]);

  return (
    <div className="giftCardContainer">
      
      <span className="close" onClick={onClose}>
              &times;
    </span>
      <h1>{giftCardName}</h1>

      <div className="progress-bar">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`progress-step ${
              index + 1 === currentStep ? "active" : index + 1 < currentStep ? "completed" : ""
            }`}
            data-step={index + 1}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <form id="gift-card-form" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="form-section">
            <h2>Select Purchase Type</h2>
            <div className="purchase-type-options">
              <div
                className={`purchase-option ${purchaseType === "self" ? "active" : ""}`}
                onClick={() => handlePurchaseTypeSelect("self")}
              >
                <div className="icon">👤</div>
                <h3>For Myself</h3>
                <p>I want to purchase a gift card for my own use</p>
              </div>
              <div
                className={`purchase-option ${purchaseType === "gift" ? "active" : ""}`}
                onClick={() => handlePurchaseTypeSelect("gift")}
              >
                <div className="icon">🎁</div>
                <h3>As a Gift</h3>
                <p>I want to send this gift card to someone else</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-section">
            {purchaseType === "self" && (
              <div id="self-purchase-form">
                <h2>Your Information</h2>
                <div className="form-group">
                  <label htmlFor="self-name">Your Name</label>
                  <input type="text" id="self-name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="self-email">Your Email</label>
                  <input type="email" id="self-email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="self-phone">Your Phone Number</label>
                  <input type="tel" id="self-phone" required />
                </div>
              </div>
            )}

            {purchaseType === "gift" && (
              <div id="gift-purchase-form">
              <div> 
                <h2>Recipient Information</h2>
                <div className="form-group">
                  <label htmlFor="recipient-name">Recipient's Name</label>
                  <input type="text" id="recipient-name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-email">Recipient's Email</label>
                  <input type="email" id="recipient-email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Personal Message</label>
                  <textarea id="message" rows="4" placeholder="Add a personal message for the recipient"></textarea>
                </div>
                </div>
                <div>
                <h2>Your Information</h2>
                <div className="form-group">
                  <label htmlFor="sender-name">Your Name</label>
                  <input type="text" id="sender-name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="sender-email">Your Email</label>
                  <input type="email" id="sender-email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="sender-phone">Your Phone Number</label>
                  <input type="tel" id="sender-phone" required />
                </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <div className="payment-method active" data-method="credit-card">
                <img src="/api/placeholder/150/40" alt="Credit Card" />
                <h3>Credit Card</h3>
              </div>
              <div className="payment-method " data-method="credit-card">
                <img src="/api/placeholder/150/40" alt="Credit Card" />
                <h3>Credit Card</h3>
              </div>
              <div className="payment-method " data-method="credit-card">
                <img src="/api/placeholder/150/40" alt="Credit Card" />
                <h3>Credit Card</h3>
              </div>
            </div>
            <div className="payment-details">
              <div className="form-group">
                <label htmlFor="card-number">Card Number</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-group">
                <label htmlFor="expiry-date">Expiry Date</label>
                <input type="month" id="expiry-date" />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="123" />
              </div>
            </div>
          </div>
        )}

        <div className="navigation-buttons">
          {currentStep > 1 && (
            <button type="button" className="giftFormBtn btn-secondary" onClick={handlePrev}>
              Previous
            </button>
          )}
          {currentStep < totalSteps && (
            <button type="button" className="giftFormBtn" onClick={handleNext}>
              Next
            </button>
          )}
          {currentStep === totalSteps && (
            <button type="submit" className="giftFormBtn">
              Complete Purchase
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GiftCardForm;
