var express = require("express");
var router = express.Router();
const Product = require("../models/product");
const Sort = require("../models/sortsample");

router.post("/api/register", async (req, res) => {
  try {
    const new_products = new Product({
      product_number: Math.floor(new Date().getTime() / 1000),
      product_item: req.body.product_item,
      product_detail: req.body.product_detail,
      product_price: req.body.product_price,
      product_made: req.body.product_made,
      product_image: req.files.file.data,
    });
    await new_products.save();
    res.json({ 
      success:true,
      message:"등록 완료" });
  } catch {
    res.json({ message: "fail" ,success:false,});
  }
});

router.get("/api/view", async (req, res) => {
  try {
    const product_list = await Product.find({});
    res.json({ product_list: product_list, message: "조회가 완료되었습니다.",success:true, });
  } catch {
    res.json({ message: "fail" ,success:false,});
  }
});

router.post("/api/detail/view", async (req, res) => {
  try {
    const product_info = await Product.findOne({
      product_number: req.body.product_number,
    });
    res.json({ product_info: product_info, 
      success:true,
      message:"등록 완료" });
  } catch {
    res.json({ success:false,message: "fail" });
  }
});


router.get("/api/admin/view", async (req, res) => {
  try {
    var product_list = [];
    const product_lists = await Product.find({});
    await product_lists.forEach(async (element) => {
      await product_list.push({
        product_item: element["product_item"],
        product_detail: element["product_detail"],
      });
    });
    res.json({ product_list: product_list, message: "success" ,success:true,});
  } catch {
    res.json({ message: "fail" ,success:false});
  }
});

router.post("/api/delete", async (req, res) => {
  try {
    var product_list = [];
    await Product.deleteOne({
      product_item: req.body.product_item,
      product_detail: req.body.product_detail,
    });
    const product_lists = await Product.find({});
    await product_lists.forEach(async (element) => {
      await product_list.push({
        product_item: element["product_item"],
        product_detail: element["product_detail"],
      });
    });
    res.send(product_list);
  } catch (err) {
    console.log(1);
    res.send(err);
  }
});

router.post("/api/upload/review", async (req, res) => {
  try {
    const product = await Product.findOne({
      product_number: req.body.product_number,
    });
    await product.review_list.push({
      review_title: req.body.review.review_title,
      review_item: req.body.review.review_item,
      review_content: req.body.review.review_content,
      review_quantity: req.body.review.review_quantity,
      review_user_id: req.body.review.review_user_id,
      review_order_date: req.body.review.review_order_date,
    });

    await product.save();
    res.json({ message: "리뷰가 등록되었습니다.",success:true });
  } catch (err) {

    res.send(err);
  }
});



module.exports = router;
