import React, { useState, useEffect } from "react";
import "./GiftCards.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createGiftCard,
  listGiftCards,
  updateGiftCard,
  deleteGiftCard,
} from "../../services/Actions/giftCardActions";
import Modal from "../../components/Notification/Modal";

const GiftCards = () => {
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
  const { giftCards, loading, error } = useSelector(
    (state) => state.giftCardList
  );

  useEffect(() => {
    if (giftCardCreate.success || giftCardUpdate.success) {
      setModalMessage(
        giftCardCreate.success
          ? "Gift card created successfully!"
          : "Gift card updated successfully!"
      );
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
      giftCardIcon: card.icon,
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

  const viewImage = (imageData) => {
    if (!imageData) {
      alert("No image data found.");
      return;
    }
    setSelectedImage(`data:image/jpeg;base64,${imageData}`);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
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
            <button
              className="create-giftcard cbtn green"
              onClick={handleOpenModal}
            >
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
                    <td>
                      $ {card.amount - (card.amount * card.discount) / 100}
                    </td>

                    <td>
                      {new Date(card.expirationDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td>
                      <button
                        className="cbtn view"
                        onClick={() => viewImage(card.giftCardImg)}
                      >
                        View Image
                      </button>
                    </td>
                    <td>
                      <button
                        className="cbtn edit"
                        onClick={() => handleEdit(card)}
                      >
                        Edit
                      </button>
                      <button
                        className="cbtn delete"
                        onClick={() => handleDelete(card._id)}
                      >
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
                  <option
                    value="🎂 Birthday Special"
                    className="option-birthday"
                  >
                    <i className="react-icons">🎂</i> Birthday Special
                  </option>
                  <option
                    value="💍 Anniversary Delight"
                    className="option-anniversary"
                  >
                    <i className="react-icons">💍</i> Anniversary Delight
                  </option>
                  <option value="🎉 Festive Cheers" className="option-festive">
                    <i className="react-icons">🎉</i> Festive Cheers
                  </option>
                  <option value="🙏 Thank You" className="option-thank-you">
                    <i className="react-icons">🙏</i> Thank You
                  </option>
                  <option
                    value="🎉 Congratulations"
                    className="option-congratulations"
                  >
                    <i className="react-icons">🎉</i> Congratulations
                  </option>
                  <option
                    value="💐 Get Well Soon"
                    className="option-get-well-soon"
                  >
                    <i className="react-icons">💐</i> Get Well Soon
                  </option>
                  <option
                    value="🏠 Housewarming Gift"
                    className="option-housewarming"
                  >
                    <i className="react-icons">🏠</i> Housewarming Gift
                  </option>
                  <option value="🍽 Fine Dining" className="option-fine-dining">
                    <i className="react-icons">🍽</i> Fine Dining
                  </option>
                  <option
                    value="🍷 Romantic Dinner"
                    className="option-romantic-dinner"
                  >
                    <i className="react-icons">🍷</i> Romantic Dinner
                  </option>
                  <option
                    value="🥞 Weekend Brunch"
                    className="option-weekend-brunch"
                  >
                    <i className="react-icons">🥞</i> Weekend Brunch
                  </option>
                  <option
                    value="🍗 Family Feast"
                    className="option-family-feast"
                  >
                    <i className="react-icons">🍗</i> Family Feast
                  </option>
                  <option
                    value="🍳 Chef's Special"
                    className="option-chefs-special"
                  >
                    <i className="react-icons">🍳</i> Chef's Special
                  </option>
                  <option
                    value="🍴 All-You-Can-Eat Buffet"
                    className="option-buffet"
                  >
                    <i className="react-icons">🍴</i> All-You-Can-Eat Buffet
                  </option>
                  <option
                    value="🏖 Relaxing Staycation"
                    className="option-staycation"
                  >
                    <i className="react-icons">🏖</i> Relaxing Staycation
                  </option>
                  <option
                    value="💆‍♀ Spa & Dine Combo"
                    className="option-spa-combo"
                  >
                    <i className="react-icons">💆‍♀</i> Spa & Dine Combo
                  </option>
                  <option
                    value="🌴 Luxury Escape"
                    className="option-luxury-escape"
                  >
                    <i className="react-icons">🌴</i> Luxury Escape
                  </option>
                  <option
                    value="🍷 Gourmet Experience"
                    className="option-gourmet-experience"
                  >
                    <i className="react-icons">🍷</i> Gourmet Experience
                  </option>
                  <option value="🍇 Wine & Dine" className="option-wine-dine">
                    <i className="react-icons">🍇</i> Wine & Dine
                  </option>
                  <option
                    value="🏖 Beachside Bliss"
                    className="option-beachside-bliss"
                  >
                    <i className="react-icons">🏖</i> Beachside Bliss
                  </option>
                  <option
                    value="🏞 Mountain Retreat"
                    className="option-mountain-retreat"
                  >
                    <i className="react-icons">🏞</i> Mountain Retreat
                  </option>
                  <option
                    value="🌆 City Lights Dining"
                    className="option-city-lights"
                  >
                    <i className="react-icons">🌆</i> City Lights Dining
                  </option>
                  <option
                    value="🍛 Exotic Flavors"
                    className="option-exotic-flavors"
                  >
                    <i className="react-icons">🍛</i> Exotic Flavors
                  </option>
                  <option
                    value="👔 Employee Appreciation"
                    className="option-employee-appreciation"
                  >
                    <i className="react-icons">👔</i> Employee Appreciation
                  </option>
                  <option
                    value="🎁 Loyalty Rewards"
                    className="option-loyalty-rewards"
                  >
                    <i className="react-icons">🎁</i> Loyalty Rewards
                  </option>
                  <option
                    value="🧳 Client Gifting"
                    className="option-client-gifting"
                  >
                    <i className="react-icons">🧳</i> Client Gifting
                  </option>
                  <option
                    value="🏢 Corporate Thank You"
                    className="option-corporate-thank-you"
                  >
                    <i className="react-icons">🏢</i> Corporate Thank You
                  </option>
                  <option
                    value="💖 Just Because"
                    className="option-just-because"
                  >
                    <i className="react-icons">💖</i> Just Because
                  </option>
                  <option value="🍷 Date Night" className="option-date-night">
                    <i className="react-icons">🍷</i> Date Night
                  </option>
                  <option
                    value="☀ Summer Treats"
                    className="option-summer-treats"
                  >
                    <i className="react-icons">☀</i> Summer Treats
                  </option>
                  <option
                    value="❄ Winter Warmth"
                    className="option-winter-warmth"
                  >
                    <i className="react-icons">❄</i> Winter Warmth
                  </option>
                  <option
                    value="🌷 Spring Refresh"
                    className="option-spring-refresh"
                  >
                    <i className="react-icons">🌷</i> Spring Refresh
                  </option>
                  <option
                    value="🍂 Autumn Flavors"
                    className="option-autumn-flavors"
                  >
                    <i className="react-icons">🍂</i> Autumn Flavors
                  </option>
                  <option
                    value="🍽 For Food Lovers"
                    className="option-for-food-lovers"
                  >
                    <i className="react-icons">🍽</i> For Food Lovers
                  </option>
                  <option value="👨 For Him" className="option-for-him">
                    <i className="react-icons">👨</i> For Him
                  </option>
                  <option value="👩 For Her" className="option-for-her">
                    <i className="react-icons">👩</i> For Her
                  </option>
                  <option
                    value="👨‍👩‍👧‍👦 For the Family"
                    className="option-for-family"
                  >
                    <i className="react-icons">👨‍👩‍👧‍👦</i> For the Family
                  </option>
                  <option value="👥 For the Team" className="option-for-team">
                    <i className="react-icons">👥</i> For the Team
                  </option>
                  <option value="💝 For You" className="option-for-you">
                    <i className="react-icons">💝</i> For You
                  </option>
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
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                {isEditing ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
      {isImageModalOpen && (
        <div className="image-modal-overlay">
          <div className="image-modal">
            <button className="image-modal-close" onClick={closeImageModal}>
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Gift Card"
              className="image-modal-content"
            />
          </div>
        </div>
      )}

      {isMessageModalOpen && (
        <Modal message={modalMessage} onClose={closeModal} />
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
