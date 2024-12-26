// actions/giftCardActions.js
import axios from "axios";
import { CREATE_GIFTCARD_REQUEST, CREATE_GIFTCARD_SUCCESS, CREATE_GIFTCARD_FAIL } from "../Constants/giftCardConstants";

export const createGiftCard = (giftCardData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_GIFTCARD_REQUEST });

    // Make a POST request to your backend
    const { data } = await axios.post("/api/v1/admin/create-giftcard", giftCardData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch({
      type: CREATE_GIFTCARD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_GIFTCARD_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
