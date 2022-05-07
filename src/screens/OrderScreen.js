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
                      <strong>Thông tin khách hàng</strong>
                    </h5>
                    <p>Tên: {order?.user.name}</p>
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
                      <strong>Thông tin đặt hàng</strong>
                    </h5>
                    <p>Hình thức thanh toán: {order?.paymentMethod}</p>
                    {order?.isPaid ? (
                      <div className="bg-info p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Hoàn thành đặt hàng vào lúc{" "}
                          {moment(Date.now()).format("hh:mm DD/MM/YYYY")}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Chưa hoàn thành đặt hàng
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
                      <strong>Vận chuyển đến</strong>
                    </h5>
                    <p>
                      Địa chỉ:{" "}
                      {`${order?.shippingAddress.address}, ${order?.shippingAddress.city}, ${order?.shippingAddress.country}`}
                    </p>
                    {order.isDelivered ? (
                      <div className="bg-success p-1 col-12">
                        <p className="text-white text-center text-sm-start">
                          Đã vận chuyển lúc{" "}
                          {moment(order.deliveredAt).calendar()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-1 col-12">
                        <p className="text-white text-center text-sm-start">
                          Chưa vận chuyển
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
                    Thông tin đặt hàng hiện đang trống
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
                          <h4>Số lượng</h4>
                          <h6>{item.qty}</h6>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center">
                          <h4>Đơn giá</h4>
                          <h6 style={{ color: "red" }}>
                            {Intl.NumberFormat("VN", {
                              maximumSignificantDigits: 3,
                            }).format(item.price)}{" "}
                            VNĐ
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
                        <strong>Giá</strong>
                      </td>
                      <td>
                        {Intl.NumberFormat("VN", {
                          maximumSignificantDigits: 3,
                        }).format(order?.itemsPrice)}{" "}
                        VNĐ
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Chi phí vận chuyển</strong>
                      </td>
                      {order?.shippingPrice == 0 ? (
                        <td>Free</td>
                      ) : (
                        <td>
                          {Intl.NumberFormat("VN", {
                            maximumSignificantDigits: 3,
                          }).format(order?.shippingPrice)}{" "}
                          VNĐ
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td>
                        <strong>Tổng cộng</strong>
                      </td>
                      <td>
                        {Intl.NumberFormat("VN", {
                          maximumSignificantDigits: 3,
                        }).format(order?.totalPrice)}{" "}
                        VNĐ
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="col-12">
                  {loadingPay && <Loading />}
                  <button onClick={orderPayHandler}>Thanh Toán</button>
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
