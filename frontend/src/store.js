import { configureStore } from "@reduxjs/toolkit";
import giftCardReducer from "./Services/Reducers/giftCardsReducer";
import authReducer from "./services/Reducers/authReducer.js";

// Configure the store
const store = configureStore({
  reducer: {
    giftCard: giftCardReducer, // Add reducers here
    auth: authReducer,
  },
});

export default store;
