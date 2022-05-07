const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const asyncHandler = require("express-async-handler");

const OrderController = {
  // CREATE ORDER
  create: asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
      return;
    } else {
      const newOrder = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,

        shippingPrice,
        totalPrice,
      });

      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    }
  }),
  //ORDER DETAILS
  detail: asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  }),

  // ORDER IS PAID
  isPaid: asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
 

      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  }),

  adminGetAllOrder: asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .populate("user", "id name email");
    res.json(orders);
  }),

  userOrders: asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(orders);
  }),

  deleteAllOrder: asyncHandler(async (req, res) => {
    await Order.deleteMany({});
    res.status(200).json("Deleted successfully!");
  }),
  isDelivered: asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
};

module.exports = OrderController;
