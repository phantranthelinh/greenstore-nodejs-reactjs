import axios from "axios"
import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
} from "./../Constants/ProductConstants"

//PRODUCT LIST
export const listProduct = () => async (dispatch) => {
  try {
    dispatch({type: PRODUCT_LIST_REQUEST})
    const {data} = await axios.get("/api/products")
    dispatch({type: PRODUCT_LIST_SUCCESS, payload: data})
  } catch (err) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        err.respone && err.respone.data.message
          ? err.respone.data.message
          : err.message,
    })
  }
}

//SINGLE LIST
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({type: PRODUCT_DETAILS_REQUEST})
    const {data} = await axios.get(`/api/products/${id}`)
    dispatch({type: PRODUCT_DETAILS_SUCCESS, payload: data})
  } catch (err) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        err.respone && err.respone.data.message
          ? err.respone.data.message
          : err.message,
    })
  }
}