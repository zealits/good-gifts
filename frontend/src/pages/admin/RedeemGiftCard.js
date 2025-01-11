import React, { useState } from 'react';
import axios from 'axios';
import QRScanner from './QRScanner';

const RedeemGiftCard = () => {
  const [giftCard, setGiftCard] = useState(null);

  const handleQRScan = (code) => {
    if (!code || code.trim() === '') {
      console.error('Invalid QR Code detected');
      alert('Invalid QR Code. Please scan again.');
      return;
    }
    console.log('QR Code Scanned:', code);
    fetchGiftCard(code);
  };

  const fetchGiftCard = async (data) => {
    try {
      let cardId;

      // Check if data is a URL or plain text
      if (data.startsWith('http')) {
        const url = new URL(data);
        cardId = url.pathname.split('/').pop(); // Extract ID from URL path
      } else {
        cardId = data.trim(); // Treat it as plain text
      }

      if (!cardId) {
        console.error('Invalid QR code data.');
        alert('Invalid QR code data.');
        return;
      }

      console.log('Fetching Gift Card for ID:', cardId);

      // API Call
      const { data: giftCard } = await axios.get(`/api/v1/admin/scan-giftcard/${cardId}`);
      setGiftCard(giftCard);
      console.log('Gift Card Details:', giftCard);
    } catch (error) {
      console.error('Error fetching gift card:', error);
      const errorMessage = error.response?.data?.message || 'Gift card not found.';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h2>Scan QR Code to Fetch Gift Card</h2>
      <QRScanner onScan={handleQRScan} />
      {giftCard && (
        <div>
          <h3>Gift Card Details</h3>
          <form>
            <label>
              Card ID:
              <input type="text" value={giftCard._id} readOnly />
            </label>
            <label>
              Gift Card Name:
              <input type="text" value={giftCard.giftCardName} readOnly />
            </label>
            <label>
              Tag:
              <input type="text" value={giftCard.giftCardTag} readOnly />
            </label>
            <label>
              Description:
              <textarea value={giftCard.description} readOnly />
            </label>
            <label>
              Balance:
              <input type="number" value={giftCard.amount} readOnly />
            </label>
            <label>
              Discount:
              <input type="text" value={`${giftCard.discount}%`} readOnly />
            </label>
            <label>
              Status:
              <input type="text" value={giftCard.status} readOnly />
            </label>
            <label>
              Expiration Date:
              <input type="text" value={new Date(giftCard.expirationDate).toLocaleDateString()} readOnly />
            </label>
            <label>
              Created At:
              <input type="text" value={new Date(giftCard.createdAt).toLocaleDateString()} readOnly />
            </label>
            <label>
              Updated At:
              <input type="text" value={new Date(giftCard.updatedAt).toLocaleDateString()} readOnly />
            </label>
          </form>
        </div>
      )}
    </div>
  );
};

export default RedeemGiftCard;
