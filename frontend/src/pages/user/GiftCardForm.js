import React, { useState, useEffect } from "react";
import "./GiftCardForm.css"; // Import CSS for styling
import { purchaseGiftCard } from "../../services/Actions/giftCardActions";
import { useDispatch, useSelector } from "react-redux";
import SquarePaymentForm from "./SquarePaymentForm.js";

const GiftCardForm = ({ giftCardName, amount, discount, id }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [purchaseType, setPurchaseType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(true);
  // Initially set modal to closed

  const dispatch = useDispatch();
  const { paymentData } = useSelector((state) => state.payment);
  console.log("ser : ", paymentData?.payment);
  console.log("amount : ", paymentData?.payment?.amountMoney?.amount);
  console.log("receiptUrl : ", paymentData?.payment?.receiptUrl);
  console.log("receiptNumber : ", paymentData?.payment?.receiptNumber);
  console.log("transactionId : ", paymentData?.payment?.id);
  console.log("sourceType : ", paymentData?.payment?.sourceType);
  console.log("status : ", paymentData?.payment?.status);
  console.log("paymentTime : ", paymentData?.payment?.updatedAt);

  useEffect(() => {
    if (paymentData?.payment) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        paymentDetails: {
          transactionId: paymentData.payment.id || "",
          paymentMethod: paymentData.payment.sourceType || "",
          paymentamount: paymentData.payment.amountMoney?.amount || "",
          currency: paymentData.payment.amountMoney?.currency || "",
          status: paymentData.payment.status || "",
          receiptNumber: paymentData.payment.receiptNumber || "",
          receiptUrl: paymentData.payment.receiptUrl || "",
          paymentdAt: paymentData.payment.updatedAt || "",
        },
      }));
    }
  }, [paymentData]);

  console.log(id);

  const [formData, setFormData] = useState({
    id: id,
    purchaseType: "", // 'self' or 'gift'
    selfInfo: {
      name: "",
      email: "",
      phone: "",
    },
    giftInfo: {
      recipientName: "",
      recipientEmail: "",
      message: "",
      senderName: "",
      senderEmail: "",
      senderPhone: "",
    },
    paymentDetails: {
      transactionId: "",
      paymentMethod: "",
      paymentamount: "",
      currency: "",
      status: "",
      receiptNumber: "",
      receiptUrl: "",
      paymentdAt: "",
    },
  });

  const totalSteps = 3;

  const handlePurchaseTypeSelect = (type) => {
    setPurchaseType(type);
    setFormData((prev) => ({
      ...prev,
      purchaseType: type,
    }));
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handlePaymentChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        [field]: value,
      },
    }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidName = (name) => /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(name.trim());


const isValidPhone = (phone) => /^\d{10}$/.test(phone);

const validateStep = (step) => {
  let isValid = true;

  switch (step) {
    case 1:
      if (!purchaseType) {
        alert("Please select a purchase type");
        isValid = false;
      }
      break;

    case 2:
      if (purchaseType === "self") {
        const { name, email, phone } = formData.selfInfo;
        if (!isValidName(name) || !isValidEmail(email) || !isValidPhone(phone)) {
          alert("Please enter valid details: Name (letters only), Email (correct format), and Phone (10 digits).");
          isValid = false;
        }
      } else {
        const { recipientName, recipientEmail, senderName, senderEmail, senderPhone } = formData.giftInfo;
        if (
          !isValidName(recipientName) || 
          !isValidEmail(recipientEmail) || 
          !isValidName(senderName) || 
          !isValidEmail(senderEmail) || 
          !isValidPhone(senderPhone)
        ) {
          alert("Please enter valid details for all fields.");
          isValid = false;
        }
      }
      break;

    case 3:
      const cardNumber = document.getElementById("card-number")?.value;
      const expiryDate = document.getElementById("expiry-date")?.value;
      const cvv = document.getElementById("cvv")?.value;
      if (!cardNumber || !expiryDate || !cvv) {
        alert("Please enter valid payment details.");
        isValid = false;
      }
      break;

    default:
      break;
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      console.log("formdata : ", formData);
      // Step 1: Handle payment (assuming already implemented)
      dispatch(purchaseGiftCard(formData));

      // Step 2: Add gift card to Google Wallet
      const response = await fetch("/api/v1/admin/add-to-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.id,
          cardNumber: 456,
          balance: 500,
        }),
      });

      console.log(response);

      const data = await response.json();
      if (data.saveUrl) {
        window.location.href = data.saveUrl; // Redirect to Google Wallet
      } else {
        alert("Failed to add to Google Wallet");
      }

      setShowModal(true);
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  React.useEffect(() => {
    updateSteps();
  }, [currentStep]);

  const handleClose = () => {
    setShowForm(false)
  }
  
  if (!showForm) return null;
  return (
    
    <div className="gift-card-wrapper">
      <span className="gift-card-wrapper__close-btn" onClick={handleClose}>
        &times;
      </span>
      <h1 className="gift-card-wrapper__title">{giftCardName}</h1>

      <div className="gift-card-progress">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`gift-card-progress__step ${
              index + 1 === currentStep ? "gift-card-progress__step--active" : 
              index + 1 < currentStep ? "gift-card-progress__step--completed" : ""
            }`}
            data-step={index + 1}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <form id="gift-card-form" className="gift-card-form" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="gift-card-purchase-type">
            <h2 className="gift-card-purchase-type__heading">Select Purchase Type</h2>
            <div className="gift-card-purchase-type__options">
              <div
                className={`gift-card-purchase-type__option ${
                  purchaseType === "self" ? "gift-card-purchase-type__option--active" : ""
                }`}
                onClick={() => handlePurchaseTypeSelect("self")}
              >
                <div className="gift-card-purchase-type__icon">👤</div>
                <h3 className="gift-card-purchase-type__option-title">For Myself</h3>
                <p className="gift-card-purchase-type__option-desc">I want to purchase a gift card for my own use</p>
              </div>
              <div
                className={`gift-card-purchase-type__option ${
                  purchaseType === "gift" ? "gift-card-purchase-type__option--active" : ""
                }`}
                onClick={() => handlePurchaseTypeSelect("gift")}
              >
                <div className="gift-card-purchase-type__icon">🎁</div>
                <h3 className="gift-card-purchase-type__option-title">As a Gift</h3>
                <p className="gift-card-purchase-type__option-desc">I want to send this gift card to someone else</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="gift-card-info">
            {purchaseType === "self" && (
              <div className="gift-card-self-info">
                <h2 className="gift-card-self-info__heading">Your Information</h2>
                <div className="gift-card-self-info__field">
                  <label className="gift-card-self-info__label" htmlFor="self-name">Your Name</label>
                  <input
                    type="text"
                    id="self-name"
                    className="gift-card-self-info__input"
                    required
                    value={formData.selfInfo.name}
                    onChange={(e) => handleInputChange("selfInfo", "name", e.target.value)}
                  />
                </div>
                <div className="gift-card-self-info__field">
                  <label className="gift-card-self-info__label" htmlFor="self-email">Your Email</label>
                  <input
                    type="email"
                    id="self-email"
                    className="gift-card-self-info__input"
                    required
                    value={formData.selfInfo.email}
                    onChange={(e) => handleInputChange("selfInfo", "email", e.target.value)}
                  />
                </div>
                <div className="gift-card-self-info__field">
                  <label className="gift-card-self-info__label" htmlFor="self-phone">Your Phone Number</label>
                  <input
                    type="tel"
                    id="self-phone"
                    className="gift-card-self-info__input"
                    required
                    value={formData.selfInfo.phone}
                    onChange={(e) => handleInputChange("selfInfo", "phone", e.target.value)}
                  />
                </div>
              </div>
            )}

            {purchaseType === "gift" && (
              <div className="gift-card-recipient-info">
                <div className="gift-card-recipient-details">
                  <h2 className="gift-card-recipient-details__heading">Recipient Information</h2>
                  <div className="gift-card-recipient-details__field">
                    <label className="gift-card-recipient-details__label" htmlFor="recipient-name">Recipient's Name</label>
                    <input
                      type="text"
                      id="recipient-name"
                      className="gift-card-recipient-details__input"
                      required
                      value={formData.giftInfo.recipientName}
                      onChange={(e) => handleInputChange("giftInfo", "recipientName", e.target.value)}
                    />
                  </div>
                  <div className="gift-card-recipient-details__field">
                    <label className="gift-card-recipient-details__label" htmlFor="recipient-email">Recipient's Email</label>
                    <input
                      type="email"
                      id="recipient-email"
                      className="gift-card-recipient-details__input"
                      required
                      value={formData.giftInfo.recipientEmail}
                      onChange={(e) => handleInputChange("giftInfo", "recipientEmail", e.target.value)}
                    />
                  </div>
                  <div className="gift-card-recipient-details__field">
                    <label className="gift-card-recipient-details__label" htmlFor="message">Personal Message</label>
                    <textarea
                      id="message"
                      className="gift-card-recipient-details__message"
                      rows="4"
                      placeholder="Add a personal message for the recipient"
                      value={formData.giftInfo.message}
                      onChange={(e) => handleInputChange("giftInfo", "message", e.target.value)}
                    />
                  </div>
                </div>
                <div className="gift-card-sender-info">
                  <h2 className="gift-card-sender-info__heading">Your Information</h2>
                  <div className="gift-card-sender-info__field">
                    <label className="gift-card-sender-info__label" htmlFor="sender-name">Your Name</label>
                    <input
                      type="text"
                      id="sender-name"
                      className="gift-card-sender-info__input"
                      value={formData.giftInfo.senderName}
                      onChange={(e) => handleInputChange("giftInfo", "senderName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="gift-card-sender-info__field">
                    <label className="gift-card-sender-info__label" htmlFor="sender-email">Your Email</label>
                    <input
                      type="email"
                      id="sender-email"
                      className="gift-card-sender-info__input"
                      value={formData.giftInfo.senderEmail}
                      onChange={(e) => handleInputChange("giftInfo", "senderEmail", e.target.value)}
                      required
                    />
                  </div>
                  <div className="gift-card-sender-info__field">
                    <label className="gift-card-sender-info__label" htmlFor="sender-phone">Your Phone Number</label>
                    <input
                      type="tel"
                      id="sender-phone"
                      className="gift-card-sender-info__input"
                      value={formData.giftInfo.senderPhone}
                      onChange={(e) => handleInputChange("giftInfo", "senderPhone", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="gift-card-payment">
            <SquarePaymentForm />
          </div>
        )}

        <div className="gift-card-navigation">
          {currentStep > 1 && (
            <button type="button" className="gift-card-navigation__btn gift-card-navigation__btn--secondary" onClick={handlePrev}>
              Previous
            </button>
          )}
          {currentStep < totalSteps && (
            <button type="button" className="gift-card-navigation__btn gift-card-navigation__btn--primary" onClick={handleNext}>
              Next
            </button>
          )}
          {currentStep === totalSteps && (
            <button type="submit" className="gift-card-navigation__btn gift-card-navigation__btn--submit">
              Complete Purchase
            </button>
          )}
        </div>
      </form>
      {showModal && (
        <div className="gift-card-modal">
          <div className="gift-card-modal__content">
            <h2 className="gift-card-modal__heading">Purchase Completed Successfully!</h2>
            <p className="gift-card-modal__message">Thank you for your purchase. A confirmation email has been sent to your inbox.</p>
            <button className="gift-card-modal__close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
};



export default GiftCardForm;