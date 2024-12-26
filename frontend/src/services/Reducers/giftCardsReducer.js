// reducers/giftCardReducer.js
import {
  CREATE_GIFTCARD_REQUEST,
  CREATE_GIFTCARD_SUCCESS,
  CREATE_GIFTCARD_FAIL,
  CREATE_GIFTCARD_RESET,
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
