// giftCardReducers.js

import {
  CREATE_GIFTCARD_REQUEST,
  CREATE_GIFTCARD_SUCCESS,
  CREATE_GIFTCARD_FAIL,
  CREATE_GIFTCARD_RESET,
  LIST_GIFTCARDS_REQUEST,
  LIST_GIFTCARDS_SUCCESS,
  LIST_GIFTCARDS_FAIL,
  UPDATE_GIFTCARD_REQUEST,
  UPDATE_GIFTCARD_SUCCESS,
  UPDATE_GIFTCARD_FAIL,
  DELETE_GIFTCARD_REQUEST,
  DELETE_GIFTCARD_SUCCESS,
  DELETE_GIFTCARD_FAIL,
  PURCHASE_GIFTCARD_REQUEST,
  PURCHASE_GIFTCARD_SUCCESS,
  PURCHASE_GIFTCARD_FAIL,
 
} from "../Constants/giftCardConstants";

// Initial state for listing, updating, and deleting gift cards
const initialState = {
  loading: false,
  giftCards: [],
  error: null,
};

// Reducer for creating a gift card
export const giftCardCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_GIFTCARD_REQUEST:
      return { loading: true };
    case CREATE_GIFTCARD_SUCCESS:
      return { loading: false, success: true, giftCard: action.payload };
    case CREATE_GIFTCARD_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_GIFTCARD_RESET:
      return {};
    default:
      return state;
  }
};

// Reducer for listing gift cards
export const giftCardListReducer = (state = initialState, action) => {
  switch (action.type) {
    case LIST_GIFTCARDS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LIST_GIFTCARDS_SUCCESS:
      return {
        ...state,
        loading: false,
        giftCards: action.payload,
      };

    case LIST_GIFTCARDS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};




// Reducer for updating a gift card
export const giftCardUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_GIFTCARD_REQUEST:
      return { loading: true };
    case UPDATE_GIFTCARD_SUCCESS:
      return { loading: false, success: true, updatedGiftCard: action.payload };
    case UPDATE_GIFTCARD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for deleting a gift card
export const giftCardDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_GIFTCARD_REQUEST:
      return { loading: true };
    case DELETE_GIFTCARD_SUCCESS:
      return { loading: false, success: true };
    case DELETE_GIFTCARD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for purchasing a gift card
export const purchaseGiftCardReducer = (state = {}, action) => {
  switch (action.type) {
    case PURCHASE_GIFTCARD_REQUEST:
      return { loading: true };
    case PURCHASE_GIFTCARD_SUCCESS:
      return { loading: false, success: true, giftCard: action.payload };
    case PURCHASE_GIFTCARD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
