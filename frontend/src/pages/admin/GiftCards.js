import React from "react";
import "./GiftCards.css"

const GiftCards = () => {
  return (
    <div>
      <h1 className="heading">GiftCards</h1>
      <div>
      <div class="main-content">
            <div class="actions">
                <button class="create-giftcard cbtn green">Create Giftcard</button>
                <input type="text" id="search-giftcards" class="search-box" placeholder="Search Giftcards"/>
            </div>
            <table class="giftcards-table">
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
                        <td><button class="cbtn view">View Image</button></td>
                        <td>
                            <button class="cbtn edit">Edit</button>
                            <button class="cbtn delete">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Flipkart Gift Card</td>
                        <td>₹1000</td>
                        <td>15%</td>
                        <td>2025-01-15</td>
                        <td><button class="cbtn view">View Image</button></td>
                        <td>
                            <button class="cbtn edit">Edit</button>
                            <button class="cbtn delete">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
       
      </div>
    </div>
  );
};

export default GiftCards;
