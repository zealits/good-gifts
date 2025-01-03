import { configureStore } from "@reduxjs/toolkit";
import {
  giftCardCreateReducer,
  giftCardListReducer,
  giftCardUpdateReducer,
  giftCardDeleteReducer,
} from "./services/Reducers/giftCardsReducer";
import authReducer from "./services/Reducers/authReducer.js";
import locationReducer from "./services/Reducers/locationSlice";


// Configure the store
const store = configureStore({
  reducer: {
    giftCardCreate: giftCardCreateReducer,
    giftCardList: giftCardListReducer,
    giftCardUpdate: giftCardUpdateReducer,
    giftCardDelete: giftCardDeleteReducer,
    auth: authReducer,
    location: locationReducer,
    
  },
});

export default store;
