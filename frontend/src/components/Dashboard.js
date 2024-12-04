import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [giftCards, setGiftCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve gift cards from localStorage
    const storedGiftCards = JSON.parse(localStorage.getItem("giftCards")) || [];
    setGiftCards(storedGiftCards);
  }, []);

  // Function to handle delete operation
  const handleDelete = (index) => {
    const updatedGiftCards = giftCards.filter((_, i) => i !== index);
    setGiftCards(updatedGiftCards);
    localStorage.setItem("giftCards", JSON.stringify(updatedGiftCards)); // Update localStorage
  };

  // Function to handle edit operation
  const handleEdit = (index) => {
    const cardToEdit = giftCards[index];
    navigate("/create-gift-card", { state: { cardToEdit, index } }); // Navigate to create page with state
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <button
        className="create-gift-card-button"
        onClick={() => navigate("/create-gift-card")}
      >
        Create Gift Card
      </button>

      <div className="gift-cards-list">
        {giftCards.length === 0 ? (
          <p>No gift cards available. Click "Create Gift Card" to add one.</p>
        ) : (
          giftCards.map((card, index) => (
            <div key={index} className="gift-card">
              <h3>{card.giftCardName}</h3>
              <p>Amount: {card.amount}</p>
              <p>Currency: {card.currency}</p>
              <p>Status: {card.status}</p>
              <p>Expires on: {new Date(card.expirationDate).toDateString()}</p>
              <div className="gift-card-created-at">
                Created At: {new Date(card.createdAt).toLocaleString()}
              </div>

              {/* Action buttons */}
              <div className="gift-card-actions">
                <button className="edit-button" onClick={() => handleEdit(index)}>
                  Update
                </button>
                <button className="delete-button" onClick={() => handleDelete(index)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
