require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 4000;

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "apc-storage",
  brokers: process.env.BROKER_URI.split(","),
});

const producer = kafka.producer();

const initKafka = async () => {
  await producer.connect();
};

app.post("/events/storage", async (req, res) => {
  await producer.send({
    topic: "apc-storage",
    messages: [
      {
        key: "storage_data",
        value: JSON.stringify({
          zone_number: req.body["zone_number"],
          temp: req.body["temp"],
          humid: req.body["humid"],
        }),
      },
    ],
  });
  console.log(JSON.stringify(req.body));
  res.send("successfully stored event !!" + "\n");
});

app.post("/events/item", async (req, res) => {
  await producer.send({
    topic: "apc-item",
    messages: [
      {
        key: "item_data",
        value: JSON.stringify({
          user_id: req.body["user_id"],
          item: req.body["item"],
          kind: req.body["kind"],
          weight: req.body["weight"],
          row: req.body["row"],
          col: req.body["col"],
          ratio: req.body["ratio"],
          hardness: req.body["hardness"],
          brix: req.body["brix"],
          acidity: req.body["acidity"],
          color: req.body["color"],
          grade: req.body["grade"],
        }),
      },
    ],
  });
  console.log(JSON.stringify(req.body));
  res.send("successfully stored event !!" + "\n");
});

app.listen(port, async () => {
  console.log(`kafka app listening on port ${port}`);
});

initKafka();
