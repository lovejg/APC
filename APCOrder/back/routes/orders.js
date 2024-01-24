var express = require("express");
var router = express.Router();
const Order = require("../models/order");

router.post("/api/upload", async (req, res) => {
  if (
    req.body.order.order_item == "품목" ||
    req.body.order.order_quantity == "수량"
  ) {
    res.json({
      success: false,
      message: "항목을 다 입력해주세요.",
    });
  } else {
    const find_orders = await Order.findOne({
      order_number: req.body.user_id + Math.floor(new Date().getTime() / 1000),
    });
    if (find_orders) {
      res.json({
        success: false,
        message: "잠시후 시도하세요",
      });
    } else {
      const new_orders = new Order({
        order_id: req.body.user_id,
        order_number:
          req.body.user_id + Math.floor(new Date().getTime() / 1000),
        order_item: req.body.order.order_item,
        order_quantity: req.body.order.order_quantity,
        order_price: req.body.order.order_price,
        order_status: 0,
        order_others: req.body.order.order_others,
        order_product_number: req.body.order.order_product_number,
      });
      await new_orders.save();
      res.json({
        success: true,
        message: "입고 처리가 완료되었습니다.",
      });
    }
  }
});

router.post("/api/view", async (req, res) => {
  var order_list;
  if (req.body.login_user_role == 0) {
    order_list = await Order.find({});
  } else {
    order_list = await Order.find({ user_id: req.body.user_id });
  }
  res.json({ order_list: order_list });
});

router.get("/api/view/decline", async (req, res) => {
  try {
    const order_list = await Order.find({ order_request_cancel: true });
    res.json({ order_list: order_list });
  } catch (err) {
    res.json({ order_list: [] });
  }
});

router.post("/api/decline", async (req, res) => {
  await Order.findOneAndUpdate(
    { order_number: req.body.orderinfo.order_number },
    { order_request_cancel: true }
  );
  res.json({
    success: true,
    message: "취소 신청완료!",
  });
});

router.post("/api/decline/approve", async (req, res) => {
  try {
    await Order.deleteOne({
      order_number: req.body.order.order_number,
    });
    const order_list = await Order.find({ order_request_cancel: true });
    res.json({ order_list: order_list });
  } catch (err) {
    res.json({ order_list: [] });
  }
});

module.exports = router;
