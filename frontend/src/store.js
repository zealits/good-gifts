import { combineReducers, createStore, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk";
import { giftCardReducer } from './Services/Reducers/giftCardsReducer';

const rootReducer = combineReducers({
  giftCard: giftCardReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
