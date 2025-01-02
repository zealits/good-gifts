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
        {/* <select className="filter-dropdown">
          <option value="">Filter by Category</option>
          <option value="Fine Dining">Fine Dining</option>
          <option value="Casual Dining">Casual Dining</option>
          <option value="Gourmet">Gourmet</option>
        </select> */}
      </div>

      <div className="container">
        {giftCards?.map?.((card) => (
          <div className="card" key={card.id}>
            <div className="card-image">
              <img src={`data:image/jpeg;base64,${card.giftCardImg}`} alt="Gift Card" loading="lazy"/>
              {/* Display the gift card tag and icon */}
              <div className="card-tag">
                <i className={card.icon}></i> {card.giftCardTag}
              </div>
            </div>
            <div className="card-content">
              <h2 className="card-title">{card.giftCardName}</h2>
              <p className="card-description">{card.description}</p>
              <div className="card-info">
                <span className="card-price">$ {card.amount}</span>
                <span className="card-discount">{card.discount} % Off</span>
              </div>
              <button
                className="card-button"
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
            <span className="close" onClick={handleCloseModal}>
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
    </div>
  );
};

export default UserLanding;
