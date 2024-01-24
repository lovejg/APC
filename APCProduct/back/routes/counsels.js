var express = require("express");
var router = express.Router();
const Counsel = require("../models/counsel");

router.post("/api/counsel/upload", async (req, res) => {
  if (
    req.body.counsel.counsel_item == "대분류" ||
    req.body.counsel.counsel_title == "제목" ||
    req.body.counsel.counsel_content == "내용"
  ) {
    res.json({
      success: false,
      message: "항목을 다 입력해주세요.",
    });
  } else {
    const new_counsel = new Counsel({
      counsel_id: req.body.user_id,
      counsel_item: req.body.counsel.counsel_item,
      counsel_title: req.body.counsel.counsel_title,
      counsel_content: req.body.counsel.counsel_content,
    });
    await new_counsel.save();
    res.json({
      success: true,
      message: "문의사항 등록이 완료되었습니다.",
    });
  }
});

router.post("/api/counsel/view", async (req, res) => {
  var counsel_list;
  if (req.body.login_user_role == 0) {
    counsel_list = await Counsel.find({ counsel_check: false });
  } else {
    counsel_list = await Counsel.find({
      counsel_id: req.body.user_id,
    });
  }
  res.json({ counsel_list: counsel_list });
});

router.post("/api/counsel/check", async (req, res) => {
  console.log(req.body);
  await Counsel.findOneAndUpdate(
    {
      counsel_id: req.body.counsel_info.counsel_id,
      counsel_title: req.body.counsel_info.counsel_title,
      counsel_check: false,
    },
    { counsel_check: true }
  );
  if (req.body.login_user_role == 0) {
    counsel_list = await Counsel.find({ counsel_check: false });
  } else {
    counsel_list = await Counsel.find({
      counsel_id: req.body.counsel_info.counsel_id,
    });
  }
  res.json({ counsel_list: counsel_list });
});


router.post("/api/counsel/answer", async (req,res)=>{
  console.log(req.body.counsel_answer);
  await Counsel.findOneAndUpdate({
    _id: req.body.counsel_info._id
  },{counsel_answer:req.body.counsel_answer});
  
  
  res.json({counsel_list: counsel_list});
});

module.exports = router;
