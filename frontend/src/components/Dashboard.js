import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGiftCards, deleteGiftCard } from "../Services/Actions/giftCardActions";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access gift cards and loading state from Redux store
  const { giftCards, loading, error } = useSelector((state) => state.giftCard);

  // Fetch gift cards from the server when the component mounts
  useEffect(() => {
    dispatch(fetchGiftCards());
  }, [dispatch]);

  // Function to handle delete operation
  const handleDelete = (id) => {
    dispatch(deleteGiftCard(id));
  };

  // Function to handle edit operation
  const handleEdit = (card) => {
    navigate("/create-gift-card", { state: { cardToEdit: card } }); // Navigate to create page with state
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
        {loading ? (
          <p>Loading gift cards...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : giftCards.length === 0 ? (
          <p>No gift cards available. Click "Create Gift Card" to add one.</p>
        ) : (
          giftCards.map((card) => (
            <div key={card._id} className="gift-card">
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
                <button className="edit-button" onClick={() => handleEdit(card)}>
                  Update
                </button>
                <button className="delete-button" onClick={() => handleDelete(card._id)}>
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
