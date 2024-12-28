import React, { useState, useEffect } from "react";
import "./GiftCards.css";
import { useDispatch, useSelector } from "react-redux";
import { createGiftCard, listGiftCards, updateGiftCard, deleteGiftCard } from "../../services/Actions/giftCardActions";
import Modal from "../../components/Notification/Modal";

const GiftCards = () => {
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  //Add state to manage the delete confirmation modal.
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
const [cardToDelete, setCardToDelete] = useState(null);


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listGiftCards(searchTerm)); // Pass searchTerm to the action
  }, [dispatch, searchTerm]); // Add searchTerm as a dependency

  // Accessing state from the Redux store
  const giftCardCreate = useSelector((state) => state.giftCardCreate);
  const giftCardUpdate = useSelector((state) => state.giftCardUpdate);
  const giftCardDelete = useSelector((state) => state.giftCardDelete);
  const { giftCards, loading, error } = useSelector((state) => state.giftCardList);

  useEffect(() => {
    if (giftCardCreate.success || giftCardUpdate.success) {
      setModalMessage(giftCardCreate.success ? "Gift card created successfully!" : "Gift card updated successfully!");
      setMessageModalOpen(true);
      setModalOpen(false); // Close modal after successful action
      dispatch(listGiftCards()); // Refresh the list
    } else if (giftCardCreate.error || giftCardUpdate.error) {
      setModalMessage(`Error: ${giftCardCreate.error || giftCardUpdate.error}`);
      setMessageModalOpen(true);
    }
  }, [giftCardCreate, giftCardUpdate, dispatch]);

  useEffect(() => {
    if (giftCardDelete.success) {
      setModalMessage("Gift card deleted successfully!");
      setMessageModalOpen(true);
      dispatch(listGiftCards()); // Refresh the list
    } else if (giftCardDelete.error) {
      setModalMessage(`Error: ${giftCardDelete.error}`);
      setMessageModalOpen(true);
    }
  }, [giftCardDelete, dispatch]);

  const [formData, setFormData] = useState({
    giftCardName: "",
    giftCardTag: "birthday", // Default value matches the first option
    description: "",
    amount: "",
    discount: "",
    expirationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateGiftCard(editingCardId, formData));
    } else {
      dispatch(createGiftCard(formData));
    }
  };

  const handleOpenModal = () => {
    setFormData({
      giftCardName: "",
      giftCardTag: "birthday",
      description: "",
      amount: "",
      discount: "",
      expirationDate: "",
    });
    setIsEditing(false);
    setEditingCardId(null);
    setModalOpen(true);
  };

  const handleEdit = (card) => {
    setFormData({
      giftCardName: card.giftCardName,
      giftCardTag: card.giftCardTag,
      description: card.description,
      amount: card.amount,
      discount: card.discount,
      expirationDate: card.expirationDate.split("T")[0],
    });
    setIsEditing(true);
    setEditingCardId(card._id);
    setModalOpen(true);
  };

/*
  const handleDelete = (cardId) => {
    if (window.confirm("Are you sure you want to delete this gift card?")) {
      dispatch(deleteGiftCard(cardId));
    }
  };
*/

const handleDelete = (cardId) => {
  setCardToDelete(cardId); // Store the card ID for deletion
  setDeleteModalOpen(true); // Open the delete confirmation modal
};


const confirmDelete = () => {
  if (cardToDelete) {
    dispatch(deleteGiftCard(cardToDelete));
    setDeleteModalOpen(false); // Close the modal after confirming
    setCardToDelete(null); // Clear the stored card ID
  }
};


  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const closeModal = () => {
    setMessageModalOpen(false);
    setModalMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const viewImage = (buffer) => {
    // Ensure buffer.data is an array of bytes
    console.log(buffer);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value); // Update the state
    console.log(value); // Log the user's input
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
            <input
              type="text"
              id="search-giftcards"
              className="search-box"
              placeholder="Search Giftcards"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
          <table className="giftcards-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Sale Price</th>
                <th>Deadline</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7">Error: {error}</td>
                </tr>
              ) : giftCards && giftCards.length > 0 ? (
                giftCards.map((card) => (
                  <tr key={card._id}>
                    <td>{card.giftCardName}</td>
                    <td>$ {card.amount}</td>
                    <td>{card.discount}%</td>
                    <td>$ {card.amount - (card.amount * card.discount) / 100}</td>

                    <td>{new Date(card.expirationDate).toLocaleDateString("en-GB")}</td>
                    <td>
                      <button className="cbtn view">
                        {/* when click on this button image should be view it is in card.giftCardImg type:"Buffer" and data */}
                        <img
                          src={`data:image/jpeg;base64,${card.giftCardImg}`}
                          alt="Gift Card"
                          style={{ width: "100px", height: "auto" }}
                        />
                      </button>
                    </td>
                    <td>
                      <button className="cbtn edit" onClick={() => handleEdit(card)}>
                        Edit
                      </button>
                      <button className="cbtn delete" onClick={() => handleDelete(card._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No gift cards found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="creategiftcard-modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>{isEditing ? "Edit Gift Card" : "Create a Gift Card"}</h2>
            <form className="giftcard-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="giftCardName">Gift Card Name</label>
                <input
                  type="text"
                  id="giftCardName"
                  name="giftCardName"
                  value={formData.giftCardName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="giftCardTag">Gift Card Tag</label>
                <select
                  id="giftCardTag"
                  name="giftCardTag"
                  value={formData.giftCardTag}
                  onChange={handleChange}
                  required
                >
                  <option value="birthday">Birthday Bliss Gift Card</option>
                  <option value="anniversary">Anniversary Celebration Card</option>
                  <option value="festive">Festive Feast Gift Card</option>
                  <option value="cheers">Cheers to You! Gift Card</option>
                  <option value="special-day">Special Day Delight</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expirationDate">Expiration Date</label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Upload Image</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} required />
              </div>
              <button type="submit" className="submit-btn">
                {isEditing ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

{isDeleteModalOpen && (
  <Modal
    message="Are you sure you want to delete this gift card?"
    onClose={() => setDeleteModalOpen(false)}
    showCloseButton={false} // Do not show the Close button
  >
    <button onClick={confirmDelete}>Yes</button>
    <button onClick={() => setDeleteModalOpen(false)}>No</button>
  </Modal>
)}


      {isMessageModalOpen && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default GiftCards;
