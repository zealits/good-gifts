import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CreateGiftCard.css";
import { useDispatch } from "react-redux";
import { updateGiftCard } from "../Services/Actions/giftCardActions";

function CreateGiftCard({ addGiftCard }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    giftCardName: "",
    amount: "",
    currency: "",
    status: "Active",
    expirationDate: "",
  });

  useEffect(() => {
    if (location.state?.cardToEdit) {
      setForm(location.state.cardToEdit);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.state?.cardToEdit) {
      dispatch(updateGiftCard(location.state.cardToEdit._id, form));
    } else {
      const cardWithTimestamp = {
        ...form,
        createdAt: new Date().toISOString(),
      };
      addGiftCard(cardWithTimestamp);
    }
    navigate("/dashboard");
  };

  return (
    <div className="create-gift-card-container">
      <h1>{location.state?.cardToEdit ? "Update Gift Card" : "Create a New Gift Card"}</h1>
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
          {location.state?.cardToEdit ? "Update Gift Card" : "Create Gift Card"}
        </button>
        <button className="dashboard-button" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
      </form>
    </div>
  );
}

export default CreateGiftCard;
