import React, { useState, useEffect } from "react";
import "./UserLanding.css";
import { useLocation } from "react-router-dom";
import { setLocation } from "../../services/Reducers/locationSlice";
import { listGiftCards } from "../../services/Actions/giftCardActions";
import { useDispatch, useSelector } from "react-redux";

const UserLanding = () => {
  const [modalDetails, setModalDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listGiftCards());
  }, [dispatch]);

  const { giftCards, loading, error } = useSelector((state) => state.giftCardList);

  // console.log(giftCards);

  useEffect(() => {
    dispatch(setLocation(location.pathname));
  }, [location.pathname, dispatch]);


  const handleBuyNowClick = (details) => {
    setModalDetails(details);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
        <input type="text" placeholder="Search Gift Cards..." className="search-bar" />
        <select className="filter-dropdown">
          <option value="">Filter by Category</option>
          <option value="Fine Dining">Fine Dining</option>
          <option value="Casual Dining">Casual Dining</option>
          <option value="Gourmet">Gourmet</option>
        </select>
      </div>

      <div className="container">
        {giftCards.map((card) => (
          <div className="card" key={card.id}>
            <div className="card-image">
              <img src={`data:image/jpeg;base64,${card.giftCardImg}`} alt="Gift Card" />
              {/* <img src={card.giftCardImg} alt="Gift Card Image" /> */}
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
                onClick={() =>
                  handleBuyNowClick({
                    title: card.giftCardName,
                    terms: card.terms,
                    expiry: card.expirationDate,
                    restaurants: card.restaurants,
                  })
                }
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

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



  // const giftCards = [
  //   {
  //     id: 1,
  //     title: "Fine Dining Gift Card",
  //     description: "Treat yourself or a loved one to an unforgettable culinary journey.",
  //     price: "₹1000",
  //     discount: "20% Off",
  //     terms: "Valid for 6 months",
  //     expiry: "2024-12-31",
  //     restaurants: "Elite Restaurant, Gourmet Hub",
  //     image: "https://th.bing.com/th?id=ORMS.3bd55cbac2414360e1c25019ffdd6a47&pid=Wdp&w=612&h=304&qlt=90&c=1&rs=1&dpr=1.375&p=0",
  //     tag: "Fine Dining",
  //     icon: "fas fa-utensils",
  //   },
  //   {
  //     id: 2,
  //     title: "Casual Dining Gift Card",
  //     description: "Perfect for a casual outing with family and friends.",
  //     price: "₹500",
  //     discount: "10% Off",
  //     terms: "Valid for 3 months",
  //     expiry: "2024-09-30",
  //     restaurants: "Family Diner, Food Fiesta",
  //     image: "https://files.JPG?itok=FEqxtkYy",
  //     tag: "Casual Dining",
  //     icon: "fas fa-hamburger",
  //   },
  //   {
  //     id: 3,
  //     title: "Gourmet Experience Gift Card",
  //     description: "An exclusive treat for the gourmet food lover.",
  //     price: "₹2000",
  //     discount: "15% Off",
  //     terms: "Valid for 1 year",
  //     expiry: "2025-12-31",
  //     restaurants: "Luxury Gourmet, Chef's Special",
  //     image: "https://img.freepik.com/premium-1189127-2849.jpg?w=360",
  //     tag: "Gourmet Experience",
  //     icon: "fas fa-wine-glass",
  //   },
  // ];
