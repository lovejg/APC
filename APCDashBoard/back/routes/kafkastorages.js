var express = require("express");
var router = express.Router();
const { Kafka } = require("kafkajs");
const KafkaStorage = require("../models/kafkastorage");
require("dotenv").config();

const kafka = new Kafka({
  clientId: "apc-storage",
  brokers: process.env.BROKER_URI.split(","),
});

const consumer = kafka.consumer({ groupId: "storage-group" });

const initKafka = async () => {
  console.log("start subscribe");
  await consumer.connect();
  await consumer.subscribe({
    topic: "apc-storage",
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const newKafkaStorage = new KafkaStorage({
        zone_number: JSON.parse(message.value)["zone_number"],
        temp: JSON.parse(message.value)["temp"],
        humid: JSON.parse(message.value)["humid"],
      });
      await newKafkaStorage.save();
    },
  });
};

initKafka();

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

router.post("/api/view", async (req, res) => {
  try {
    console.log(req.body.zone_number);
    var temp_data = [];
    var humid_data = [];
    var temp_data_time = [];
    var humid_data_time = [];
    storages = await KafkaStorage.find({ zone_number: req.body.zone_number });
    await storages.reverse();
    delete_storages = await KafkaStorage.deleteMany({
      zone_number: req.body.zone_number,
    });

    for (var i = 10; i >= 0; i--) {
      temp_data.push(storages[i]["temp"]);
      temp_data_time.push(formatDate(storages[i]["createdAt"]));
      humid_data.push(storages[i]["humid"]);
      humid_data_time.push(formatDate(storages[i]["createdAt"]));

      const newKafkaStorage = new KafkaStorage({
        zone_number: req.body.zone_number,
        temp: storages[i]["temp"],
        humid: storages[i]["humid"],
        createdAt: storages[i]["createdAt"],
      });

      await newKafkaStorage.save();
    }

    res.json({
      temp_data_time: temp_data_time,
      humid_data_time: humid_data_time,
      temp_data: temp_data,
      humid_data: humid_data,
    });
  } catch (err) {
    res.send(err+'api+view');
  }
});

module.exports = router;
