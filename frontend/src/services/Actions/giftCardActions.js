// actions/giftCardActions.js
import axios from "axios";
import { CREATE_GIFTCARD_REQUEST, CREATE_GIFTCARD_SUCCESS, CREATE_GIFTCARD_FAIL, LIST_GIFTCARDS_REQUEST,
  LIST_GIFTCARDS_SUCCESS,
  LIST_GIFTCARDS_FAIL, } from "../Constants/giftCardConstants";

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


// Action to fetch all gift cards
export const listGiftCards = () => async (dispatch) => {
  try {
    dispatch({ type: LIST_GIFTCARDS_REQUEST }); // Dispatch request action

    // Fetch gift cards from the backend
    const { data } = await axios.get("/api/v1/admin/list"); // Adjust endpoint as needed

    dispatch({
      type: LIST_GIFTCARDS_SUCCESS,
      payload: data, // Send the fetched gift cards as payload
    });
  } catch (error) {
    dispatch({
      type: LIST_GIFTCARDS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};