import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, payOrder } from "../Redux/Actions/OrderActions";
import Loading from "./../components/LoadingError/Loading";
import Message from "./../components/LoadingError/Error";
import moment from "moment";

const OrderScreen = (props) => {
  window.scrollTo(0, 0);
  const { match } = props;

  const dispatch = useDispatch();
  const orderId = match.params.id;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay, loading: loadingPay } = orderPay;

  if (!loading) {
    const addDecimals = (num) => {
      return Math.round(num * 100) / 100;
    };
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => {
        return acc + item.price * item.qty;
      }, 0)
    );
  }

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, successPay]);
  const orderPayHandler = () => {
    const paymentResult = {
      id: orderId,
      status: true,
      email_address: order.user.email,
      update_time: Date.now(),
    };

    dispatch(payOrder(orderId, paymentResult));
  };
  return (
    <>
      <Header />

      <div className="container">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="row  order-detail">
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Th??ng tin kh??ch h??ng</strong>
                    </h5>
                    <p>T??n: {order?.user.name}</p>
                    <p>
                      Email:{" "}
                      <a href={`mailto:${order?.user.email}`}>
                        {order?.user.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {/* 2 */}
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-truck-moving"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Th??ng tin ?????t h??ng</strong>
                    </h5>
                    <p>H??nh th???c thanh to??n: {order?.paymentMethod}</p>
                    {order?.isPaid ? (
                      <div className="bg-info p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Ho??n th??nh ?????t h??ng v??o l??c{" "}
                          {moment(Date.now()).format("hh:mm DD/MM/YYYY")}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Ch??a ho??n th??nh ?????t h??ng
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* 3 */}
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>V???n chuy???n ?????n</strong>
                    </h5>
                    <p>
                      ?????a ch???:{" "}
                      {`${order?.shippingAddress.address}, ${order?.shippingAddress.city}, ${order?.shippingAddress.country}`}
                    </p>
                    {order.isDelivered ? (
                      <div className="bg-success p-1 col-12">
                        <p className="text-white text-center text-sm-start">
                          ???? v???n chuy???n l??c{" "}
                          {moment(order.deliveredAt).calendar()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-1 col-12">
                        <p className="text-white text-center text-sm-start">
                          Ch??a v???n chuy???n
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row order-products justify-content-between">
              <div className="col-lg-8">
                {order?.orderItems.length === 0 ? (
                  <Message variant="alert-info mt-5">
                    Th??ng tin ?????t h??ng hi???n ??ang tr???ng
                  </Message>
                ) : (
                  order?.orderItems.map((item, idx) => {
                    return (
                      <div key={idx} className="order-product row">
                        <div className="col-md-3 col-6">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="col-md-5 col-6 d-flex align-items-center">
                          <Link to={`/`}>
                            <h6>{item.name}</h6>
                          </Link>
                        </div>
                        <div className="mt-3 mt-md-0 col-6 col-md-2  d-flex align-items-center flex-column justify-content-center ">
                          <h4>S??? l?????ng</h4>
                          <h6>{item.qty}</h6>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center">
                          <h4>????n gi??</h4>
                          <h6 style={{ color: "red" }}>
                            {Intl.NumberFormat("VN", {
                              maximumSignificantDigits: 3,
                            }).format(item.price)}{" "}
                            VN??
                          </h6>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {/* total */}
              <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Gi??</strong>
                      </td>
                      <td>
                        {Intl.NumberFormat("VN", {
                          maximumSignificantDigits: 3,
                        }).format(order?.itemsPrice)}{" "}
                        VN??
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Chi ph?? v???n chuy???n</strong>
                      </td>
                      {order?.shippingPrice == 0 ? (
                        <td>Free</td>
                      ) : (
                        <td>
                          {Intl.NumberFormat("VN", {
                            maximumSignificantDigits: 3,
                          }).format(order?.shippingPrice)}{" "}
                          VN??
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td>
                        <strong>T???ng c???ng</strong>
                      </td>
                      <td>
                        {Intl.NumberFormat("VN", {
                          maximumSignificantDigits: 3,
                        }).format(order?.totalPrice)}{" "}
                        VN??
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="col-12">
                  {loadingPay && <Loading />}
                  <button onClick={orderPayHandler}>Thanh To??n</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderScreen;
