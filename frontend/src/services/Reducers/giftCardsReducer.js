// reducers/giftCardReducer.js
import {
  CREATE_GIFTCARD_REQUEST,
  CREATE_GIFTCARD_SUCCESS,
  CREATE_GIFTCARD_FAIL,
  CREATE_GIFTCARD_RESET,
  LIST_GIFTCARDS_REQUEST,
  LIST_GIFTCARDS_SUCCESS,
  LIST_GIFTCARDS_FAIL,
} from "../Constants/giftCardConstants";


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

const initialState = {
  loading: false,
  giftCards: [],
  error: null,
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
