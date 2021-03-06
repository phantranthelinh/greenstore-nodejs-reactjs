import React, { useEffect, useRef, useState } from "react";
import Header from "./../components/Header";
import Rating from "../components/homeComponents/Rating";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Message from "./../components/LoadingError/Error";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../Redux/Actions/ProductActions";
import Loading from "./../components/LoadingError/Loading";
import Toast from "../components/LoadingError/Toast";
import { PRODUCT_CREATE_REVIEW_RESET } from "../Redux/Constants/ProductConstants";
import moment from "moment";
import { createProductReview } from "./../Redux/Actions/ProductActions";
const SingleProduct = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const productId = match.params.id;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productReviews = useSelector((state) => state.productReviews);
  const {
    success: successCreateReview,
    loading: loadingCreateReview,
    error: errorCreateReview,
  } = productReviews;

  const HandleAddToCart = (e) => {
    e.preventDefault();

    history.push(`/cart/${productId}?qty=${qty}`);
  };

  const toastId = useRef(null);

  useEffect(() => {
    if (successCreateReview) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Add successful review");
      }
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    dispatch(listProductDetails(productId));
  }, [dispatch, productId, successCreateReview]);
  const review = {
    rating,
    comment,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(productId, review));
  };
  return (
    <>
      <Header />
      <Toast />
      <div className="container single-product">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            {" "}
            <div className="row">
              <div className="col-md-6">
                <div className="single-image">
                  <img src={product.image} alt={product.name} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="product-dtl">
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                  </div>
                  <p>{product.description}</p>

                  <div className="product-count col-lg-7 ">
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Gi??</h6>
                      <span style={{color: "red"}} >{ Intl.NumberFormat('VN', { maximumSignificantDigits: 3 }).format(product.price )} VN??</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Tr???ng th??i</h6>
                      {product.countInStock > 0 ? (
                        <span>S???n c??</span>
                      ) : (
                        <span>unavailable</span>
                      )}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>????nh gi??</h6>
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </div>
                    {product.countInStock > 0 ? (
                      <>
                        <div className="flex-box d-flex justify-content-between align-items-center">
                          <h6>S??? l?????ng</h6>
                          <select
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <button
                          onClick={HandleAddToCart}
                          className="round-black-btn"
                        >
                          Th??m v??o gi??? h??ng
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* RATING */}
        <div className="row my-5">
          <div className="col-md-6">
            <h6 className="mb-3">B??NH LU???N</h6>
            {product.reviews.length === 0 && (
              <Message variant={"alert-info mt-3"}>Kh??ng c?? ????nh gi??</Message>
            )}
            {product.reviews.map((review) => {
              return (
                <div
                  key={review._id}
                  className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                >
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <span>{moment(review.createdAt).calendar()}</span>
                  <div className="alert alert-info mt-3">{review.comment}</div>
                </div>
              );
            })}
          </div>
          <div className="col-md-6">
            <h5>TH??M ????NH GI??</h5>
            <div className="my-4"></div>
            {loadingCreateReview && <Loading />}
            {errorCreateReview && (
              <Message variant="alert-danger">{errorCreateReview}</Message>
            )}
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-4">
                  <strong>????nh gi??</strong>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="col-12 bg-light p-3 mt-2 border-0 rounded"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - R???t t???</option>
                    <option value="2">2 - T???</option>
                    <option value="3">3 - B??nh th?????ng</option>
                    <option value="4">4 - T???t</option>
                    <option value="5">5 - R???t t???t</option>
                  </select>
                </div>
                <div className="my-4">
                  <strong>B??nh lu???n</strong>
                  <textarea
                    row="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="col-12 bg-light p-3 mt-2 border-0 rounded"
                  ></textarea>
                </div>
                <div className="my-3">
                  <button
                    disabled={loadingCreateReview}
                    className="col-12 bg-black border-0 p-3 rounded text-white"
                  >
                    ????ng
                  </button>
                </div>
              </form>
            ) : (
              <div className="my-3">
                <Message variant={"alert-warning"}>
                  Vui l??ng{" "}
                  <Link to="/login">
                    " <strong>????ng nh???p</strong> "
                  </Link>{" "}
                  ????? th??m ????nh gi??{" "}
                </Message>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
