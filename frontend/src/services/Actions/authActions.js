import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
} from "../Constants/authConstants.js";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const res = await axios.post("/api/v1/admin/login", { email, password });

    const { token, user } = res.data;

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, // Assuming the response data contains user info or a token
    });

    // localStorage.setItem("token", token);

    console.log("Login Successful:", res.data);
    // Handle success logic (e.g., redirect or save user data)
  } catch (err) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: err.response ? err.response.data.message : "Failed to login",
    });

    console.error("Login Failed:", err.response?.data || err.message);
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });


    const { data } = await axios.get(`/api/v1/admin/me`);
 

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
  }
};
