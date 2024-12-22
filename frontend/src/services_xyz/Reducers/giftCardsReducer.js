import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  giftCards: [],
  error: null,
};

const giftCardSlice = createSlice({
  name: "giftCard",
  initialState,
  reducers: {
    // Fetch gift cards
    listGiftCardsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    listGiftCardsSuccess(state, action) {
      state.loading = false;
      state.giftCards = action.payload;
      state.error = null;
    },
    listGiftCardsFailure(state, action) {
      state.loading = false;
      state.giftCards = [];
      state.error = action.payload;
    },

    // Create gift card
    createGiftCardRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createGiftCardSuccess(state, action) {
      state.loading = false;
      state.giftCards.push(action.payload); // Add new gift card to the list
      state.error = null;
    },
    createGiftCardFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Update gift card
    updateGiftCardRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateGiftCardSuccess(state, action) {
      state.loading = false;
      const { id, updatedData } = action.payload; // Extract ID and updated data
      state.giftCards = state.giftCards.map((card) =>
        card.id === id ? { ...card, ...updatedData } : card
      );
      state.error = null;
    },
    updateGiftCardFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  listGiftCardsRequest,
  listGiftCardsSuccess,
  listGiftCardsFailure,
  createGiftCardRequest,
  createGiftCardSuccess,
  createGiftCardFailure,
  updateGiftCardRequest,
  updateGiftCardSuccess,
  updateGiftCardFailure,
} = giftCardSlice.actions;

// Export reducer
export default giftCardSlice.reducer;
