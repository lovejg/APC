var express = require("express");
var router = express.Router();
const Sort = require("../models/sortsample");
const { be } = require("date-fns/locale");

router.get("/api/statistics/view", async (req, res) => {
    try {
        console.log("statics");

        const uniqueUsercodes = await Sort.distinct('usercode');
      
      res.json({
        success:true,
         message: "조회가 완료되었습니다.", user_info: uniqueUsercodes });
    } catch (err) {
      success: false,
      res.send(err);
    }
  });

  router.post("/api/statistics/select", async (req, res) => {
    try {
        console.log("req"+req.body.usercode);
        
        const documents = await Sort.find({usercode:req.body.usercode});
        let total=0;
        documents.forEach(doc => {
          console.log(doc);
          console.log(doc.get('price'));
          const price = parseFloat(doc.get('price'));
          const quantity = parseFloat(doc.get('quantity'));
          console.log("pri"+price);
          total += price*quantity;
        });
        console.log(total);
      
      res.json({
        success:true,
         message: "조회가 완료되었습니다.", totalPrice: total });
    } catch (err) {
      success: false,
      res.send(err);
    }
  });

  router.post("/api/statistics/salesview", async (req, res) => {
    try {
        console.log("req"+req.body.usercode);
        const startdate=req.body.startdate.replace(/-/g, '');
        const enddate=req.body.enddate.replace(/-/g, '');
        console.log("start"+startdate)
        console.log("end"+enddate)
        
        
        const documents = await Sort.find({
          usercode: req.body.usercode,
          importdate: {
            $gte: startdate, // 시작 날짜 이상
            $lte: enddate    // 종료 날짜 이하
          }
        });
        const totalMap=new Map();
        documents.forEach(doc => {
          const befordate = doc.get('importdate'); // 'date' 필드에서 날짜 값 가져오기
          const year = befordate.slice(0, 4);
  const month = befordate.slice(4, 6);
  const day = befordate.slice(6, 8);
          console.log("date1" +befordate);
           date = `${year}-${month}-${day}`;
          console.log("date" +date);
          const price = parseFloat(doc.get('price'));
          const quantity = parseFloat(doc.get('quantity'));
          salesPrice = price*quantity;
          if (totalMap.has(date)) {
            console.log("has" +date);
            // 이미 해당 날짜가 totalMap에 존재하면 기존 값에 더하기
            totalMap.set(date, totalMap.get(date) + salesPrice);
          } else {
            // 해당 날짜가 처음 등장하면 새로운 항목으로 추가
            totalMap.set(date, salesPrice);
          }
        }); 
        console.log("total"+totalMap); 
        for (const key of totalMap.keys()) {
          console.log(key);
          console.log(totalMap.get(key));
        }
        const keysArray = Array.from(totalMap.keys());
        keysArray.sort((a, b) => a.localeCompare(b)); 
        const valuesArray = keysArray.map(key => totalMap.get(key));
        console.log(keysArray); 
        keysArray.forEach(element => {
          console.log(element); 
         });
        valuesArray.forEach(element => {
          console.log(element); 
         });
      res.json({
        success:true,
         message: "조회가 완료되었습니다.", dateArray: keysArray,saleArray:valuesArray });
    } catch (err) {
      success: false,
      res.send(err);
    }
  });
  module.exports = router;