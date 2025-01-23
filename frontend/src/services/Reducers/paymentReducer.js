// reducers/paymentReducer.js
import {
    CREATE_PAYMENT_REQUEST,
    CREATE_PAYMENT_SUCCESS,
    CREATE_PAYMENT_FAILURE,
  } from "../Constants/paymentConstants";
  
  const initialState = {
    loading: false,
    paymentData: null,
    error: null,
  };
  
  export const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_PAYMENT_REQUEST:
        return { ...state, loading: true, error: null };
  
      case CREATE_PAYMENT_SUCCESS:
        return { ...state, loading: false, paymentData: action.payload, error: null };
  
      case CREATE_PAYMENT_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  