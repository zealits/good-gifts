import axios from "axios";
import {
  CREATE_GIFTCARD_REQUEST,
  CREATE_GIFTCARD_SUCCESS,
  CREATE_GIFTCARD_FAIL,
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

// Create Gift Card Action
export const createGiftCard = (giftCardData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_GIFTCARD_REQUEST });

    // Make a POST request to your backend
    const { data } = await axios.post("/api/v1/admin/create-giftcard", giftCardData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);

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
export const listGiftCards = (keyword = "", page = 1) => async (dispatch) => {
  try {
    console.log("amit")
    dispatch({ type: LIST_GIFTCARDS_REQUEST }); // Dispatch request action

    // Construct the URL with query parameters
    const url = `/api/v1/admin/list?keyword=${keyword}&page=${page}`;
    //const url = `/api/v1/admin/list?keyword=${keyword}&page=${page}`;
    ///api/v1/admin/list?keyword=${keyword}${refreshAll ? "" : `&page=${page}}

    // Fetch gift cards from the backend
    const { data } = await axios.get(url);

    console.log(data);
    dispatch({
      type: LIST_GIFTCARDS_SUCCESS,
      payload: data.giftCards, // Send the fetched gift cards as payload
    });
  } catch (error) {
    dispatch({
      type: LIST_GIFTCARDS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Update Gift Card Action
export const updateGiftCard = (id, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_GIFTCARD_REQUEST });

    // Make a PUT request to your backend
    const { data } = await axios.put(`/api/v1/admin/update/${id}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch({
      type: UPDATE_GIFTCARD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_GIFTCARD_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Delete Gift Card Action
export const deleteGiftCard = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_GIFTCARD_REQUEST });
    console.log(id);

    // Make a DELETE request to your backend
    await axios.delete(`/api/v1/admin/remove/${id}`);

    dispatch({
      type: DELETE_GIFTCARD_SUCCESS,
      payload: id, // Optionally, return the deleted card's ID for frontend updates
    });
  } catch (error) {
    dispatch({
      type: DELETE_GIFTCARD_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Purchase Gift Card Action
export const purchaseGiftCard = (buyerData) => async (dispatch) => {
  try {
    dispatch({ type: PURCHASE_GIFTCARD_REQUEST }); // Dispatch request action

    // Make a POST request to purchase the gift card
    const { data } = await axios.put("/api/v1/admin/purchase", buyerData);

    dispatch({
      type: PURCHASE_GIFTCARD_SUCCESS,
      payload: data, // Send the response data as payload
    });
  } catch (error) {
    dispatch({
      type: PURCHASE_GIFTCARD_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};


