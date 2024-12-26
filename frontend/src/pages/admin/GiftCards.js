import React, { useState } from "react";
import "./GiftCards.css";

const GiftCards = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <h1 className="heading">GiftCards</h1>
      <div>
        <div className="main-content">
          <div className="actions">
            <button className="create-giftcard cbtn green" onClick={handleOpenModal}>
              Create Giftcard
            </button>
            <input type="text" id="search-giftcards" className="search-box" placeholder="Search Giftcards" />
          </div>
          <table className="giftcards-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Value</th>
                <th>Discount</th>
                <th>Deadline</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Amazon Gift Card</td>
                <td>$50</td>
                <td>10%</td>
                <td>2024-12-31</td>
                <td>
                  <button className="cbtn view">View Image</button>
                </td>
                <td>
                  <button className="cbtn edit">Edit</button>
                  <button className="cbtn delete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Flipkart Gift Card</td>
                <td>₹1000</td>
                <td>15%</td>
                <td>2025-01-15</td>
                <td>
                  <button className="cbtn view">View Image</button>
                </td>
                <td>
                  <button className="cbtn edit">Edit</button>
                  <button className="cbtn delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="creategiftcard-modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Create a Gift Card</h2>
            <form className="giftcard-form">
              <div className="form-group">
                <label htmlFor="giftCardName">Gift Card Name</label>
                <input type="text" id="giftCardName" name="giftCardName" required />
              </div>
              <div className="form-group">
                <label htmlFor="giftCardTag">Gift Card Tag</label>
                <select id="giftCardTag" name="giftCardTag" required>
                  <option value="birthday">Birthday Bliss Gift Card</option>
                  <option value="anniversary">Anniversary Celebration Card</option>
                  <option value="festive">Festive Feast Gift Card</option>
                  <option value="cheers">Cheers to You! Gift Card</option>
                  <option value="special-day">Special Day Delight</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="4" required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input type="number" id="amount" name="amount" required />
              </div>
              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input type="number" id="discount" name="discount" min="0" max="100" required />
              </div>
              <div className="form-group">
                <label htmlFor="expirationDate">Expiration Date</label>
                <input type="date" id="expirationDate" name="expirationDate" required />
              </div>
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCards;
