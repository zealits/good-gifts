import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGiftCard.css";

function CreateGiftCard({ addGiftCard }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    giftCardName: "",
    amount: "",
    currency: "",
    status: "Active",
    expirationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cardWithTimestamp = {
        ...form,
        createdAt: new Date().toISOString(), // Save as ISO string
      };
      addGiftCard(cardWithTimestamp);
      navigate("/dashboard");
  };

  const handleCreateGiftCard = () => {
    // Navigate to the dashboard after creation
    navigate("/dashboard");
  };

  return (
    <div className="create-gift-card-container">
      <h1>Create a New Gift Card</h1>
      <form className="gift-card-form" onSubmit={handleSubmit}>
        <label>
          Gift Card Name:
          <input
            type="text"
            name="giftCardName"
            value={form.giftCardName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Currency:
          <select name="currency" value={form.currency} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
          </select>
        </label>

        <label>
          Status:
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <label>
          Expiration Date:
          <input
            type="date"
            name="expirationDate"
            value={form.expirationDate}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="submit-gift-card-button">
          Create Gift Card
        </button>
        <button className= "dashboard-button" onClick={handleCreateGiftCard}>Go to Dashboard</button>
      </form>
    </div>
  );
}

export default CreateGiftCard;
