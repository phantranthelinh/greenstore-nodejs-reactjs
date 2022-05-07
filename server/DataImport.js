const express = require("express")
const users = require("./data/Users")
const products = require("./data/Products")
const Product = require("./models/ProductModel")
const User = require("./models/UserModel")
const asyncHandler = require("express-async-handler")

const ImportData = express.Router()

ImportData.post(
  "/user",
  asyncHandler(async (req, res) => {
    await User.remove({})
    const importUser = await User.insertMany(users)
    res.send({importUser})
  })
)

ImportData.post(
  "/products",
  asyncHandler(async (req, res) => {
    await Product.remove({})
    const importProducts = await Product.insertMany(products)
    res.send({importProducts})
  })
)
module.exports = ImportData
