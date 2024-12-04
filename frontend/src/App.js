import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateGiftCard from "./components/CreateGiftCard";

function App() {
  const [giftCards, setGiftCards] = useState([]);

  useEffect(() => {
    // Retrieve gift cards from localStorage when the component mounts
    const storedGiftCards = JSON.parse(localStorage.getItem("giftCards")) || [];
    setGiftCards(storedGiftCards);
  }, []);

  // Function to add a new gift card to localStorage
  const addGiftCard = (newGiftCard) => {
    const storedGiftCards = JSON.parse(localStorage.getItem("giftCards")) || [];
    storedGiftCards.push(newGiftCard);
    localStorage.setItem("giftCards", JSON.stringify(storedGiftCards));
    setGiftCards(storedGiftCards); // Update state to trigger re-render
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard giftCards={giftCards} />}
        />
        <Route
          path="/create-gift-card"
          element={<CreateGiftCard addGiftCard={addGiftCard} />}
        />
        <Route
          path="*"
          element={<Login />}
        />
      </Routes>
    </Router>
  );
}

export default App;
