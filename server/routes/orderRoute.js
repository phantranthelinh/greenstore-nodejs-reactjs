const express = require("express");

const router = express.Router();
const orderController = require("../controllers/OrderController");
const { protect ,admin } = require("../middleware/AuthMiddleware");
router.post("/", protect, orderController.create);
router.get("/all", protect,admin, orderController.adminGetAllOrder);
router.get("/:id", protect, orderController.detail);
router.put("/:id/pay", protect, orderController.isPaid);
router.put("/:id/delivered", protect, orderController.isDelivered);

router.get("/", protect, orderController.userOrders);

router.delete("/", protect,admin, orderController.deleteAllOrder);

module.exports = router;
