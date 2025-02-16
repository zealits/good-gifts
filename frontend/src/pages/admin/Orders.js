import React, { useState } from "react";
import axios from "axios";
import "./Orders.css"; // Import the CSS file

const Orders = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [view, setView] = useState("giftCards"); // Default view to 'giftCards'
  const [modalName, setModalName] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [giftCardSearch, setGiftCardSearch] = useState(""); // Search state for gift cards
  const [buyerSearch, setBuyerSearch] = useState(""); // Search state for buyers

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
        `api/v1/admin/giftcards/${cardId}/buyers` // Fixed template literal syntax
      );
      setBuyers(response.data.buyers);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  const fetchUserBuyers = async () => {
    try {
      const response = await axios.get("api/v1/admin/buyers");
      setBuyers(response.data.buyers);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  const handleGiftCardView = () => {
    setView("giftCards");
    fetchGiftCards();
  };

  const handleUserView = () => {
    setView("users");
    fetchUserBuyers();
  };


  const closeModal = () => {
    if (modalName === "redemptionHistoryModal") {
      if (view === "users") {
        setModalName(""); // Directly close the Redemption History Modal if in User View
      } else {
        setModalName("buyersModal"); // Close the Redemption History Modal and show the Buyers Modal in Gift Card View
      }
      setSelectedBuyer(null); // Clear selected buyer
      setRedemptionHistory([]); // Clear redemption history
    } else {
      setModalName(""); // Close any modal
    }
  };

  const filteredGiftCards = giftCards.filter((card) =>
    card.name?.toLowerCase().includes(giftCardSearch.toLowerCase())
  );

  const filteredBuyers = Array.isArray(buyers)
  ? buyers.filter((buyer) => {
      const nameMatch = buyer.buyerName?.toLowerCase()?.includes(buyerSearch.toLowerCase()) ?? false;
      const emailMatch = buyer.email?.toLowerCase()?.includes(buyerSearch.toLowerCase()) ?? false;
      return nameMatch || emailMatch;
    })
  : [];


  const handleViewBuyers = (cardId) => {
    fetchBuyers(cardId);
    setModalName("buyersModal"); // Fetch buyers when clicking on the "View Buyers" button
  };
  const handleViewRedemptionHistory = (buyer) => {
    setSelectedBuyer({}); // Temporary empty state to force re-render
    setTimeout(() => {
      setSelectedBuyer(buyer); // Set the selected buyer
      setRedemptionHistory(buyer.redemptionHistory || []); // Set the redemption history
      setModalName("redemptionHistoryModal"); // Open the modal
    }, 0);
  };
  
  return (
    <div className="orders-page-container">
    <div className="sticky-header">
      <h1 className="orders-page-header">Orders</h1>
      <div className="view-toggle-buttons">
        <button
          onClick={handleGiftCardView}
          className={
            view === "giftCards" ? "active-view-button" : "view-button"
          }
        >
          Gift Card Orders
        </button>
        <button
          onClick={handleUserView}
          className={view === "users" ? "active-view-button" : "view-button"}
        >
          Customer Orders
        </button>
      </div>

      {view === "giftCards" && (
        <>
          <div className="giftcard-search-container">
            <input
              type="text"
              placeholder="Search gift cards..."
              value={giftCardSearch}
              onChange={(e) => setGiftCardSearch(e.target.value)}
              className="giftcard-search-input"
            />
          </div>

          <div className="giftcards-container">
            {filteredGiftCards.length > 0 ? (
              filteredGiftCards.map((card) => (
                <div key={card.id} className="giftcard-item">
                  <h3 className="giftcard-name">{card.name}</h3>
                  <p className="giftcard-tag">Tag: {card.tag}</p>
                  <p className="giftcard-description">{card.description}</p>
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
              ))
            ) : (
              <div className="no-results">No matching gift cards found</div>
            )}
          </div>
        </>
      )}
      {/* User View */}
      {view === "users" && (
        <div className="users-container">
          <h2 className="orders-page-header">All Buyers</h2>
          <div className="user-search-container">
            <input
              type="search"
              placeholder="Search buyers by name or email..."
              value={buyerSearch}
              onChange={(e) => setBuyerSearch(e.target.value)}
              className="user-search-input"
            />
          </div>
          {filteredBuyers.length > 0 ? (
            <table className="buyers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gift Card</th>
                  <th>Redemption Progress</th>
                  <th>Purchase Date</th>
                  <th>Redemption History</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuyers.map((buyer, index) => {
                  const totalAmount = buyer.remainingBalance + buyer.usedAmount || 1000;
                  const usedAmount = buyer.usedAmount || 0;
                  const remainingBalance = totalAmount - usedAmount;
                  const fillPercentage = (usedAmount / totalAmount) * 100;

                  return (
                    <tr key={index}>
                      <td>{buyer.buyerName}</td> 
                      <td>{buyer.email}</td>
                      <td>{buyer.giftCardName}</td>
                      <td>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar"
                            style={{ width: `${fillPercentage}%` }}
                            title={`Used: ${usedAmount}`}
                          ></div>
                          <div
                            className="progress-bar-empty"
                            style={{ width: `${100 - fillPercentage}%` }}
                            title={`Remaining: ${remainingBalance}`}
                          ></div>
                        </div>
                      </td>
                      <td>{new Date(buyer.purchaseDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleViewRedemptionHistory(buyer)}
                          className="user-page-redemption-history"
                        >
                          View Redemption History
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No matching buyers found.</p>
          )}
        </div>
      )}

      {/* Buyers Modal */}
      {modalName === "buyersModal" && (
        <div className="buyers-modal">
          <div className="buyers-modal-content">
            <button className="buyers-close-btn" onClick={closeModal}>
              &times;
            </button>
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
                    <span className="purchase-time">
                      <br />
                      <em>Purchased at:</em>{" "}
                      {new Date(buyer.returnTime).toLocaleTimeString()}
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
          </div>
        </div>
      )}

     
       {/* Redemption History Modal */}
       {modalName === "redemptionHistoryModal" && selectedBuyer && (
        <div className="redemption-history-modal">
          <div className="redemption-history-modal-content">
            <h3 className="redemption-history-title">
              Redemption History for {selectedBuyer.name || "Unknown Buyer"}
            </h3>
            {selectedBuyer.redemptionHistory?.length > 0 ? (
              <ul className="redemption-history-list">
                {selectedBuyer.redemptionHistory.map((entry, index) => (
                  <li key={index} className="redemption-history-entry">
                    <strong className="entry-number">#{index + 1}</strong>
                    <p className="redeemed-amount">
                      <strong>Redeemed Amount:</strong> ₹{entry.redeemedAmount}
                    </p>
                    <p className="remaining-amount">
                      <strong>Remaining Amount:</strong> ₹{entry.remainingAmount}
                    </p>
                    <p className="redemption-date">
                      <strong>Date:</strong> {new Date(entry.redemptionDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-redemption-history">No redemption history available.</p>
            )}
            <button className="close-modal-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Orders;
