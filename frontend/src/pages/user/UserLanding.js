import React, { useState, useEffect } from 'react';
 // Import the external CSS file
 import './UserLanding.css'

const UserLanding = () => {
  const [modalDetails, setModalDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBuyNowClick = (details) => {
    setModalDetails(details);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSavePersonalization = () => {
    const name = document.getElementById('recipient-name').value;
    const message = document.getElementById('personal-message').value;
    const occasion = document.getElementById('occasion').value;
    alert(`Personalization Saved:\nRecipient: ${name}\nMessage: ${message}\nOccasion: ${occasion}`);
  };

  return (
    <div className='body'>
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
        <div className="card">
          <div className="card-image">
            <img
              src="https://d3gzwr12tvi9b5.cloudfront.net/wp-content/uploads/2022/09/Open-Air-Romantic-Dinner-At-5-Star-Hotel-In-Bangalore-001.jpg"
              alt="Gift Card Image"
            />
            <div className="card-tag"><i className="fas fa-utensils"></i> Fine Dining</div>
          </div>
          <div className="card-content">
            <h2 className="card-title">Fine Dining Gift Card</h2>
            <p className="card-description">Treat yourself or a loved one to an unforgettable culinary journey.</p>
            <div className="card-info">
              <span className="card-price">₹1000</span>
              <span className="card-discount">20% Off</span>
            </div>
            <button
              className="card-button"
              onClick={() =>
                handleBuyNowClick({
                  title: 'Fine Dining Gift Card',
                  terms: 'Valid for 6 months',
                  expiry: '2024-12-31',
                  restaurants: 'Elite Restaurant, Gourmet Hub',
                })
              }
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-image">
            <img
              src="https://files.tvo.org/files/s3fs-public/styles/full_width_1280/public/article-thumbnails/shared%20meal.JPG?itok=FEqxtkYy"
              alt="Gift Card Image"
            />
            <div className="card-tag"><i className="fas fa-hamburger"></i> Casual Dining</div>
          </div>
          <div className="card-content">
            <h2 className="card-title">Casual Dining Gift Card</h2>
            <p className="card-description">Perfect for a casual outing with family and friends.</p>
            <div className="card-info">
              <span className="card-price">₹500</span>
              <span className="card-discount">10% Off</span>
            </div>
            <button
              className="card-button"
              onClick={() =>
                handleBuyNowClick({
                  title: 'Casual Dining Gift Card',
                  terms: 'Valid for 3 months',
                  expiry: '2024-09-30',
                  restaurants: 'Family Diner, Food Fiesta',
                })
              }
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-image">
            <img
              src="https://img.freepik.com/premium-photo/chef-garnishing-gourmet-dish-with-fresh-herbs-fine-dining-restaurant_1189127-2849.jpg?w=360"
              alt="Gift Card Image"
            />
            <div className="card-tag"><i className="fas fa-wine-glass"></i> Gourmet Experience</div>
          </div>
          <div className="card-content">
            <h2 className="card-title">Gourmet Experience Gift Card</h2>
            <p className="card-description">An exclusive treat for the gourmet food lover.</p>
            <div className="card-info">
              <span className="card-price">₹2000</span>
              <span className="card-discount">15% Off</span>
            </div>
            <button
              className="card-button"
              onClick={() =>
                handleBuyNowClick({
                  title: 'Gourmet Experience Gift Card',
                  terms: 'Valid for 1 year',
                  expiry: '2025-12-31',
                  restaurants: 'Luxury Gourmet, Chef\'s Special',
                })
              }
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {modalVisible && modalDetails && (
        <div id="modal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2 id="modal-title">{modalDetails.title}</h2>
            <ul id="modal-details">
              <li><strong>Terms:</strong> <span id="modal-terms">{modalDetails.terms}</span></li>
              <li><strong>Expiry Date:</strong> <span id="modal-expiry">{modalDetails.expiry}</span></li>
              <li><strong>Applicable Restaurants:</strong> <span id="modal-restaurants">{modalDetails.restaurants}</span></li>
            </ul>
            <div className="personalization">
              <h3>Personalize Your Gift Card</h3>
              <input type="text" placeholder="Recipient's Name" id="recipient-name" />
              <textarea placeholder="Add a personal message..." id="personal-message"></textarea>
              <input type="text" placeholder="Occasion (e.g., Birthday)" id="occasion" />
              <button id="save-personalization" onClick={handleSavePersonalization}>
                Save Personalization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLanding;