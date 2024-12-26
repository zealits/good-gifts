import { configureStore } from "@reduxjs/toolkit";
import { giftCardCreateReducer } from "./services/Reducers/giftCardsReducer";
import authReducer from "./services/Reducers/authReducer.js";
import locationReducer from "./services/Reducers/locationSlice";

// Configure the store
const store = configureStore({
  reducer: {
    giftCard: giftCardCreateReducer, // Add reducers here
    auth: authReducer,
    location: locationReducer,
  },
});

export default store;
