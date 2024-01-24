var express = require("express");
var router = express.Router();
const { Kafka } = require("kafkajs");
const KafkaItem = require("../models/kafkaitem");
const User = require("../models/user");
require("dotenv").config();

var firebase = require("firebase/compat/app");
require("firebase/compat/database");

const firebaseConfig = {
  apiKey: process.env.apiKey,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// this.$firebase
//   .database()
//   .ref("/kafkaitems/1/")
//   .once("value")
//   .then((snapshot) => {
//     console.log(snapshot.val());
//     for (var i in snapshot.val()) {
//       console.log(snapshot.val()[i]);
//       console.log(snapshot.val()[i].grade);
//     }
//   });

const kafka = new Kafka({
  clientId: "apc-item",
  brokers: process.env.BROKER_URI.split(","),
});

const consumer = kafka.consumer({ groupId: "item-group" });

const initKafka = async () => {
  console.log("start subscribe");
  await consumer.connect();
  await consumer.subscribe({
    topic: "apc-item",
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      var item = {
        item: JSON.parse(message.value)["item"].toString(),
        kind: JSON.parse(message.value)["kind"].toString(),
        weight: JSON.parse(message.value)["weight"],
        row: JSON.parse(message.value)["row"],
        col: JSON.parse(message.value)["col"],
        ratio: JSON.parse(message.value)["ratio"],
        hardness: JSON.parse(message.value)["hardness"],
        brix: JSON.parse(message.value)["brix"],
        acidity: JSON.parse(message.value)["acidity"],
        color: JSON.parse(message.value)["color"],
        grade: JSON.parse(message.value)["grade"].toString(),
      };
      console.log(1);
      firebase
        .database()
        .ref("/kafkaitems/" + "apple")
        .push(item);
      item.user_id = JSON.parse(message.value)["user_id"].toString();
      const newKafkaItem = new KafkaItem({
        user_id: item.user_id,
        item: item.item,
        kind: item.kind,
        weight: item.weight,
        row: item.row,
        col: item.col,
        ratio: item.ratio,
        hardness: item.hardness,
        brix: item.brix,
        acidity: item.acidity,
        color: item.color,
        grade: item.grade,
      });
      await newKafkaItem.save();
    },
  });
};

initKafka();

router.get("/api/check", async (req, res) => {
  try {
    apples = await KafkaItem.find({});
    var apple_data = {
      user_id: apples[apples.length - 1]["user_id"],
    };
    res.json({ apple_data: apple_data });
  } catch (err) {
    res.send(err);
  }
});

router.get("/api/view", async (req, res) => {
  try {
    var weight = 0;
    var row = 0;
    var col = 0;
    var ratio = 0;
    var hardness = 0;
    var brix = 0;
    var acidity = 0;
    var color = 0;
    var apples = [];
    var A_grade = 0;
    var B_grade = 0;
    var C_grade = 0;
    var D_grade = 0;
    var E_grade = 0;
    apples = await KafkaItem.find({});
    await apples.forEach((element) => {
      weight += element["weight"] / 10;
      row += element["row"];
      col += element["col"];
      ratio += element["ratio"] * 100;
      hardness += element["hardness"];
      brix += element["brix"];
      acidity += element["acidity"] * 100;
      color += element["color"];
      if (element["grade"] == "A") {
        A_grade += 1;
      } else if (element["grade"] == "B") {
        B_grade += 1;
      } else if (element["grade"] == "C") {
        C_grade += 1;
      } else if (element["grade"] == "D") {
        D_grade += 1;
      } else if (element["grade"] == "E") {
        E_grade += 1;
      }
    });
    var grade_data = {
      A_grade: A_grade,
      B_grade: B_grade,
      C_grade: C_grade,
      D_grade: D_grade,
      E_grade: E_grade,
    };

    var apple_data = {
      user_id: apples[apples.length - 1]["user_id"],
      all_weight: weight,
      weight: weight / apples.length,
      row: row / apples.length,
      col: col / apples.length,
      ratio: ratio / apples.length,
      hardness: hardness / apples.length,
      brix: brix / apples.length,
      acidity: acidity / apples.length,
      color: color / apples.length,
    };
    res.json({ apple_data: apple_data, grade_data: grade_data });
  } catch (err) {
    res.send(err+"api view");
  }
});

function formatDate(date) {
  var d = new Date(date);
  var month = "" + (d.getMonth() + 1);
  var day = "" + d.getDate();
  var year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  var date_1 = [year, month, day].join("-");

  var hour = d.getHours().toString();
  var minute = d.getMinutes().toString();
  var second = d.getSeconds().toString();

  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;
  if (second.length < 2) second = "0" + second;

  date_2 = [hour, minute, second].join(":");
  return date_1 + " " + date_2;
}

router.post("/api/delete", async (req, res) => {
  try {
    if (req.body.user_id == "init_id") {
      res.json({ message: "fail" });
    } else {
      var weight = 0;
      var row = 0;
      var col = 0;
      var ratio = 0;
      var hardness = 0;
      var brix = 0;
      var acidity = 0;
      var color = 0;
      var apples = [];
      var A_grade = 0;
      var B_grade = 0;
      var C_grade = 0;
      var D_grade = 0;
      var E_grade = 0;
      apples = await KafkaItem.find({ user_id: req.body.user_id });
      const users = await User.findOne({ user_id: req.body.user_id });
      await KafkaItem.deleteMany({ user_id: req.body.user_id });
      await apples.forEach((element) => {
        weight += element["weight"] / 10;
        row += element["row"];
        col += element["col"];
        ratio += element["ratio"] * 100;
        hardness += element["hardness"];
        brix += element["brix"];
        acidity += element["acidity"] * 100;
        color += element["color"];
        if (element["grade"] == "A") {
          A_grade += 1;
        } else if (element["grade"] == "B") {
          B_grade += 1;
        } else if (element["grade"] == "C") {
          C_grade += 1;
        } else if (element["grade"] == "D") {
          D_grade += 1;
        } else if (element["grade"] == "E") {
          E_grade += 1;
        }
      });
      var grade_data = {
        A_grade: A_grade,
        B_grade: B_grade,
        C_grade: C_grade,
        D_grade: D_grade,
        E_grade: E_grade,
      };

      var apple_data = {
        all_weight: Math.floor(weight / 100),
        date: formatDate(new Date()),
      };

      await users.import_history.push({
        item: apples[0].item,
        kind: apples[0].kind,
        weight: ((weight * 10) / apples.length).toFixed(2),
        row: (row / apples.length).toFixed(2),
        col: (col / apples.length).toFixed(2),
        ratio: (ratio / 100 / apples.length).toFixed(2),
        hardness: (hardness / apples.length).toFixed(2),
        brix: (brix / apples.length).toFixed(2),
        acidity: (acidity / 100 / apples.length).toFixed(2),
        color: (color / apples.length).toFixed(2),
        grade_A: A_grade,
        grade_B: B_grade,
        grade_C: C_grade,
        grade_D: D_grade,
        grade_E: E_grade,
      });

      await users.save();

      res.json({ apple_data: apple_data, grade_data: grade_data });
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;