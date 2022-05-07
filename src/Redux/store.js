import { createStore, combineReducers, applyMiddleware } from "redux";

import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";
import { userListReducer, userLoginReducer } from "./Reducers/UserReducers";
import { productDeleteReducer, productListReducer, productCreateReducer, productEditReducer, productUpdateReducer } from './Reducers/ProductReducers';
import { orderDeliveredReducer, orderDetailsReducer, orderListReducer } from './Reducers/OrderReducers';


const reducer = combineReducers({
  userLogin: userLoginReducer,
  userList: userListReducer,
  productList: productListReducer,
  productDelete: productDeleteReducer,
  productCreate :productCreateReducer,
  productEdit :productEditReducer,
  productUpdate :productUpdateReducer,
  orderList: orderListReducer,
  orderDetails:orderDetailsReducer,
  orderDelivered: orderDeliveredReducer,
});

//LOGIN
const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const middleware = [thunk];

const initialState = {
  userLogin: { userInfo: userInfoFromLocalStorage },
};
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
