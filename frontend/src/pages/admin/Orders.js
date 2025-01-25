import React, { useState } from "react";
import axios from "axios";
import "./Orders.css"; // Import the CSS file

const Orders = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [view, setView] = useState("giftCards"); // Default view to 'giftCards'
  const [buyers, setBuyers] = useState([]);
  const [modalName, setModalName] = useState(""); 
  const [selectedBuyer, setSelectedBuyer] = useState(null); // State for the selected buyer
  const [redemptionHistory, setRedemptionHistory] = useState([]);

  const fetchGiftCards = async () => {
    try {
      const response = await axios.get("api/v1/admin/giftcards");
      setGiftCards(response.data.giftCards);
    } catch (error) {
      console.error("Error fetching gift cards:", error);
    }
  };

  const fetchBuyers = async (cardId) => {
    try {
      const response = await axios.get(
        `api/v1/admin/giftcards/${cardId}/buyers`
      );
      setBuyers(response.data.buyers);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  const fetchUserBuyers = async () => {
    try {
      const response = await fetch("api/v1/admin/buyers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch buyers");
      }

      const data = await response.json();
      if (data.success) {
        setBuyers(data.buyers);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching buyers:", error.message);
    }
  };

  const handleViewRedemptionHistory = (buyer) => {
    setSelectedBuyer(buyer); // Set the selected buyer
    setRedemptionHistory(buyer.redemptionHistory || []); // Set the redemption history
    setModalName("redemptionHistoryModal"); // Open the modal
  };

  const handleGiftCardView = () => {
    setView("giftCards");
    fetchGiftCards();
  };

  const handleUserView = () => {
    setView("users");
    fetchUserBuyers(); // Fetch buyers when switching to the "User" view
  };

  const handleViewBuyers = (cardId) => {
    fetchBuyers(cardId);
    setModalName("buyersModal"); // Fetch buyers when clicking on the "View Buyers" button
  };

  const closeModal = () => {
    if (modalName === "redemptionHistoryModal") {
      if (view === "users") {
        setModalName("");  // Directly close the Redemption History Modal if in User View
      } else {
        setModalName("buyersModal");  // Close the Redemption History Modal and show the Buyers Modal in Gift Card View
      }
      setSelectedBuyer(null); // Clear selected buyer
      setRedemptionHistory([]); // Clear redemption history
    } else {
      setModalName("");  // Close any modal
    }
  };
  
  

  return (
    <div className="orders-page-container">
      <h1 className="orders-page-header">Orders</h1>
      <div className="view-toggle-buttons">
        <button
          onClick={handleGiftCardView}
          className={view === "giftCards" ? "active-view-button" : "view-button"}
        >
          Gift Card
        </button>
        <button
          onClick={handleUserView}
          className={view === "users" ? "active-view-button" : "view-button"}
        >
          User
        </button>
      </div>

      {/* Gift Card View */}
      {view === "giftCards" && (
        <div className="giftcards-container">
          {giftCards.length > 0 ? (
            giftCards.map((card) => (
              <div className="giftcard-item" key={card.id}>
                <div className="giftcard-details">
                  <h3 className="giftcard-name">{card.name}</h3>
                  <p className="giftcard-tag">Tag: {card.tag}</p>
                  <p className="giftcard-description">
                    Description: {card.description}
                  </p>
                  <img
                    className="giftcard-image"
                    src={card.image}
                    alt={card.name}
                  />
                  <p className="total-buyers">
                    Total Buyers: {card.totalBuyers}
                  </p>
                  <button
                    onClick={() => handleViewBuyers(card.id)}
                    className="view-buyers-button"
                  >
                    View Buyers
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No gift cards found.</p>
          )}
        </div>
      )}

      {/* User View */}
      {view === "users" && (
        <div className="users-container">
          <h2>All Buyers</h2>
          {buyers.length > 0 ? (
            <table className="buyers-table">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gift Card</th>
                  <th>Remaining Balance</th>
                  <th>Used Amount</th>
                  <th>Purchase Date</th>
                  <th>Redemption History</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{buyer.buyerName}</td>
                    <td>{buyer.email}</td>
                    <td>{buyer.giftCardName}</td>
                    <td>{buyer.remainingBalance}</td>
                    <td>{buyer.usedAmount}</td>
                    <td>{new Date(buyer.purchaseDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleViewRedemptionHistory(buyer)}
                        className="view-redemption-history-button"
                      >
                        View Redemption History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No buyers found.</p>
          )}
        </div>
      )}

     {/* Buyers Modal */}
{modalName === "buyersModal" && (
  <div className="buyers-modal">
    <div className="buyers-modal-content">
      <h3>Buyers List</h3>
      <ul>
        {buyers.length > 0 ? (
          buyers.map((buyer, index) => (
            <li key={index} className="buyer-item">
              <span className="buyer-number">{index + 1}.</span>
              <span className="buyer-name">{buyer.name}</span>
              <span className="purchase-date">
                <br />
                <em>Purchased on:</em>{" "}
                {new Date(buyer.purchaseDate).toLocaleDateString()}
              </span>
              <br />
              <span className="remaining-balance">
                <strong>Remaining Balance:</strong>{" "}
                {buyer.remainingBalance}
              </span>
              <br />
              <button
                onClick={() => handleViewRedemptionHistory(buyer)}
                className="view-redemption-history-button"
              >
                View Redemption History
              </button>
            </li>
          ))
        ) : (
          <li className="no-buyers">No buyers found.</li>
        )}
      </ul>
      <button className="buyers-close-modal-button" onClick={closeModal}>Close</button>
    </div>
  </div>
)}


{modalName === "redemptionHistoryModal" && (
  <div className="redemption-history-modal">
    <div className="redemption-history-modal-content">
      <h3 className="redemption-history-title">
        Redemption History
      </h3>
      {redemptionHistory.length > 0 ? (
        <ul className="redemption-history-list">
          {redemptionHistory.map((entry, index) => (
            <li key={index} className="redemption-history-entry">
              <strong className="entry-number">#{index + 1}</strong>
              <p className="redeemed-amount">
                <strong>Redeemed Amount:</strong> {entry.redeemedAmount}
              </p>
              <p className="remaining-amount">
                <strong>Remaining Amount:</strong> {entry.remainingAmount}
              </p>
              <p className="redemption-date">
                <strong>Date:</strong>{" "}
                {new Date(entry.redemptionDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-redemption-history">No redemption history available.</p>
      )}
      <button className="close-modal-button" onClick={closeModal}>Close</button>
    </div>
  </div>
)}

    </div>
  );
};

export default Orders;
