const mongoose = require("mongoose");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");

const ProductController = {
  getAProduct: asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.json(product);
    } catch (err) {
      res.status(404);
      throw new Error("Product not found");
    }
  }),
  getAllProducts: asyncHandler(async (req, res) => {
    try {
      const pageSize = 6;
      const page = Number(req.query.pageNumber) || 1;
      const keyword = req.query.keyword
        ? {
            name: {
              $regex: req.query.keyword,
              $options: "i",
            },
          }
        : {};
      const count = await Product.countDocuments({ ...keyword });

      const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ _id: -1 });
      res
        .status(200)
        .json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (err) {
      res.status(500).json(err);
    }
  }),
  addReview: asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      // const alreadyReviewed = product.reviews.find(
      //   (r) => r.user.toString() === req.user._id.toString()
      // );
      // if (alreadyReviewed) {
      //   res.status(400);
      //   throw new Error("Product already reviewed");
      // }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(200).json({ Message: "Reviewed added" });
    } else {
      res.status(500).json("Product not found");
    }
  }),
  getAllProductsByAdmin: asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  }),
  deleteProduct: asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  }),
  addProduct: asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock } = req.body;
    const productExits = await Product.findOne({ name });

    if (productExits) {
      res.status(404);
      throw new Error("Product name already exist");
    } else {
      const product = new Product({
        name,
        price,
        description,
        image,
        countInStock,
        user: req.user._id,
      });
      if (product) {
        const createdProduct = await product.save();
        res.status(200).json(createdProduct);
      } else {
        res.status(400);
        throw new Error("Invalid product data");
      }
    }
  }),
  editProduct: asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {

     product.name= name || product.name;
     product.price=  price || product.price;
     product.description= description || product.description;
     product.image= image || product.description;
     product.countInStock= countInStock ||product.countInStock ;

     const updatedProduct = await product.save();
     res.status(200).json(updatedProduct);

    } else {
      res.status(400);
      throw new Error("Product not found");
    }
  }),
};

module.exports = ProductController;
