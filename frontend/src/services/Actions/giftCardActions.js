import axios from "axios";
import { listGiftCardsRequest, listGiftCardsSuccess, listGiftCardsFailure } from "../Reducers/giftCardsReducer";
import { createGiftCardRequest,
  createGiftCardSuccess,
  createGiftCardFailure,
} from "../Reducers/giftCardsReducer";


// Fetch gift cards
export const fetchGiftCards = () => async (dispatch) => {
  try {
    dispatch(listGiftCardsRequest());
    const { data } = await axios.get("/api/v1/admin/list"); // Adjust the endpoint as needed
    dispatch(listGiftCardsSuccess(data));
  } catch (error) {
    dispatch(
      listGiftCardsFailure(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const createGiftCard = (giftCardData) => async (dispatch) => {
  try {
    dispatch(createGiftCardRequest()); // Dispatch the request action
    const { data } = await axios.post("/api/v1/admin/create-giftcard", giftCardData); // Adjust the endpoint as needed
    dispatch(createGiftCardSuccess(data)); // Dispatch the success action with the created card
    dispatch(fetchGiftCards()); // Optionally refresh the gift card list
  } catch (error) {
    dispatch(
      createGiftCardFailure(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

// Update gift card
export const updateGiftCard = (id, updatedCard) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/v1/admin/update/${id}`, updatedCard); // Adjust the endpoint as needed
    dispatch(fetchGiftCards()); // Fetch updated list of gift cards
  } catch (error) {
    dispatch(
      listGiftCardsFailure(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

// Delete gift card
export const deleteGiftCard = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/v1/admin/gift-card/${id}`);
    dispatch(fetchGiftCards()); // Fetch updated list of gift cards
  } catch (error) {
    dispatch(
      listGiftCardsFailure(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};
