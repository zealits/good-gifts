import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "../Constants/authConstants.js";

const initialState = {
  loading: false,
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload, // Set the user or token returned by API
        error: null,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
