import { configureStore } from "@reduxjs/toolkit";
import giftCardReducer from "./Services/Reducers/giftCardsReducer";

// Configure the store
const store = configureStore({
  reducer: {
    giftCard: giftCardReducer, // Add reducers here
  },
});

export default store;
