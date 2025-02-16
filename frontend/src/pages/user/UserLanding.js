import React, { useState, useEffect } from "react";
import "./UserLanding.css";
import { useLocation } from "react-router-dom";

import { setLocation } from "../../services/Reducers/locationSlice";
import { listGiftCards } from "../../services/Actions/giftCardActions";
import { useDispatch, useSelector } from "react-redux";
import GiftCardForm from "./GiftCardForm";

const UserLanding = () => {
  const [modalDetails, setModalDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showGiftCardForm, setShowGiftCardForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value); // Update the state
    console.log(value); // Log the user's input
  };

  useEffect(() => {
    dispatch(listGiftCards(searchTerm)); // Pass searchTerm to the action
  }, [dispatch, searchTerm]); // Add searchTerm as a dependency

  const { giftCards, loading, error } = useSelector((state) => state.giftCardList);

  useEffect(() => {
    dispatch(setLocation(location.pathname));
  }, [location.pathname, dispatch]);

  const handleBuyNowClick = (details) => {
    setModalDetails(details);
    setModalVisible(true);
  };

  const handleClick = (giftCardName, amount, discount, id) => {
    setSelectedCard({ giftCardName, amount, discount, id });
    setShowGiftCardForm(true);
  };

  const handleCloseModal = () => {
    setShowGiftCardForm(false);
  };

  const closePopup = () => {
    setShowGiftCardForm(false);
  };

  const handleSavePersonalization = () => {
    const name = document.getElementById("recipient-name").value;
    const message = document.getElementById("personal-message").value;
    const occasion = document.getElementById("occasion").value;
    alert(`Personalization Saved:\nRecipient: ${name}\nMessage: ${message}\nOccasion: ${occasion}`);
  };

  return (
    
    <div className="body">
   
      <div className="header">
        <h1>🍽️ Restaurant Gift Cards</h1>
        <p>Choose a gift card to share unforgettable dining experiences!</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Gift Cards..."
          className="search-bar"
          value={searchTerm}
          onChange={handleInputChange} // Attach the onChange handler
        />
        <select className="filter-dropdown-user">
          <option value="">Filter by Category</option>
          <option value="Fine Dining">Fine Dining</option>
          <option value="Casual Dining">Casual Dining</option>
          <option value="Gourmet">Gourmet</option>
        </select>
      </div>

      <div className="purchase-card-container">
        {giftCards?.map?.((card) => (
          <div className="purchase-card" key={card.id}>
            <div className="purchase-card-image">
              {/* <img src={`data:image/jpeg;base64,${card.giftCardImg}`} alt="Gift Card" loading="lazy"/> */}
              <img src={card.giftCardImg} alt="Gift Card" loading="lazy" />
              {/* Display the gift card tag and icon */}
              <div className="purchase-card-tag">
                <i className={card.icon}></i> {card.giftCardTag}
              </div>
            </div>
            <div className="purchase-card-content">
              <h2 className="purchase-card-title">{card.giftCardName}</h2>
              <p className="purchase-card-description">{card.description}</p>
              <div className="purchase-card-info">
                <span className="purchase-card-price">$ {card.amount}</span>
                <span className="purchase-card-discount">{card.discount} % Off</span>
              </div>
              <button
                className="purchase-card-button"
                onClick={() => handleClick(card.giftCardName, card.amount, card.discount, card._id)}
              >
                Buy Now
              </button>
            </div>
          </div>
        )) || <p>No gift cards available</p>}
      </div>

      {showGiftCardForm && <GiftCardForm {...selectedCard} onClose={closePopup} />}

      {modalVisible && modalDetails && (
        <div id="modal" className="modal">
          <div className="modal-content">
            <span className="purchase-modal-close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2 id="modal-title">{modalDetails.title}</h2>
            <ul id="modal-details">
              <li>
                <strong>Terms:</strong> <span id="modal-terms">{modalDetails.terms}</span>
              </li>
              <li>
                <strong>Expiry Date:</strong>{" "}
                <span id="modal-expiry">{new Date(modalDetails.expiry).toLocaleDateString("en-GB")}</span>
              </li>
              <li>
                <strong>Applicable Restaurants:</strong> <span id="modal-restaurants">{modalDetails.restaurants}</span>
              </li>
            </ul>
            <div className="personalization">
              <h3>Personalize Your Gift Card</h3>
              <input type="text" placeholder="Recipient's Name" id="recipient-name" />
              <textarea placeholder="Add a personal message..." id="personal-message"></textarea>
              <input type="text" placeholder="Occasion (e.g., Birthday)" id="occasion" />
              <button id="save-personalization" onClick={handleSavePersonalization}>
                Send Gift Card
              </button>
            </div>
          </div>
        </div>
      )}

{/* Footer section moved outside the modal conditional rendering */}
<footer className="footer">
  <div className="footer-content">
    <div className="footer-section">
      <h3>About Us</h3>
      <ul>
        <li><a href="/about">Our Story</a></li>
        <li><a href="/how-it-works">How It Works</a></li>
        <li><a href="/careers">Careers</a></li>
        <li><a href="/press">Press</a></li>
      </ul>
    </div>
    
    <div className="footer-section">
      <h3>Support</h3>
      <ul>
        <li><a href="/help">Help Center</a></li>
        <li><a href="/contact">Contact Us</a></li>
        <li><a href="/faq">FAQs</a></li>
        <li><a href="/shipping">Shipping Info</a></li>
      </ul>
    </div>
    
    <div className="footer-section">
      <h3>Legal</h3>
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/refund">Refund Policy</a></li>
        <li><a href="/accessibility">Accessibility</a></li>
      </ul>
    </div>
    
    <div className="footer-section">
      <h3>Connect With Us</h3>
      <div className="social-links">
        <a href="https://facebook.com" className="social-icon">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="https://twitter.com" className="social-icon">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://instagram.com" className="social-icon">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://linkedin.com" className="social-icon">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
      <div className="newsletter">
        <input type="email" placeholder="Subscribe to our newsletter" />
        <button>Subscribe</button>
      </div>
    </div>
  </div>
  
  <div className="footer-bottom">
    <p>&copy; 2025 Restaurant Gift Cards. All rights reserved.</p>
    <div className="payment-methods">
      <i className="fab fa-cc-visa"></i>
      <i className="fab fa-cc-mastercard"></i>
      <i className="fab fa-cc-amex"></i>
      <i className="fab fa-cc-paypal"></i>
    </div>
  </div>
</footer>
</div>


  )}
  
  export default UserLanding;
  