import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
const Orders = (props) => {
  const { orders } = props;


  
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Total</th>
          <th scope="col">Date</th>
          <th>Status</th>
          <th scope="col" className="text-end">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          return (
            <>
              <tr key={order._id}>
                <td>
                  <b>{order.user.name}</b>
                </td>
                <td>{order.user.email}</td>
                <td style={{color: 'red'}}>{Intl.NumberFormat('VN', {maximumSignificantDigits: 3}).format(order.totalPrice)} VNĐ</td>
                <td>
                  <span className="badge rounded-pill alert-success">
                    {moment(order.createdAt).format("llll")}
                  </span>
                </td>
               
                <td>
                  <span className={`badge btn-${order.isDelivered? "success":"danger"}`}>{`${order.isDelivered? 'Delivered' :"Not Delivered"}`}</span>
                </td>
                <td className="d-flex justify-content-end align-item-center">
                  <Link to={`/order/${order._id}`} className="text-success">
                    <i className="fas fa-eye"></i>
                  </Link>
                </td>
              </tr>
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default Orders;
