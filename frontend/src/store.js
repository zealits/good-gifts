import { configureStore } from "@reduxjs/toolkit";
import {
  giftCardCreateReducer,
  giftCardListReducer,
  giftCardUpdateReducer,
  giftCardDeleteReducer,
} from "./services/Reducers/giftCardsReducer";
import authReducer from "./services/Reducers/authReducer.js";
import locationReducer from "./services/Reducers/locationSlice";
import { paymentReducer } from "./services/Reducers/paymentReducer.js";


// Configure the store
const store = configureStore({
  reducer: {
    giftCardCreate: giftCardCreateReducer,
    giftCardList: giftCardListReducer,
    giftCardUpdate: giftCardUpdateReducer,
    giftCardDelete: giftCardDeleteReducer,
    auth: authReducer,
    location: locationReducer,
    payment: paymentReducer
    
  },
});

export default store;
