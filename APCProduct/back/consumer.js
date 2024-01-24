// 반드시 kafka와 producer.py가 켜진 상태에서 실행하기
const { Kafka } = require('kafkajs'); // for consumer
const admin = require('firebase-admin'); // for firebase sdk

// firebase admin SDK 초기화
const serviceAccount = require('./key.json'); // firebase admin sdk key(json 파일)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://test-a8aa8-default-rtdb.asia-southeast1.firebasedatabase.app' // firebase realtime database URL
});

const db = admin.database(); // firebase realtime database

const kafka = new Kafka({ // kafka server
    clientId: 'from_ai',
    brokers: ['localhost:9094']
});

const consumer = kafka.consumer({ groupId: 'data-group' }); // consumer

const initKafka = async () => { // kafka ==> 비동기
    console.log("Start reading data from port 9094");
    await consumer.connect(); // connect kafka and consumer
    await consumer.subscribe({ topic: 'FROM_AI', fromBeginning: true }); // subscribe topic FROM_AI
    await consumer.run({ // start consumer
        eachMessage: async ({ topic, partition, message }) => {
            const messageValue = message.value.toString(); // 현재 여기 데이터 값이 들어있음

            // parsing data from ai
            const index = messageValue.substring(1, 4); // 순서(인덱스)
            const percent = messageValue.substring(4, 8); // 등급
            const fruit = messageValue.substring(8, messageValue.length - 1); // 과일이름
            console.log(index + ' ' + fruit + ' ' + percent + '%'); // 확인용 출력

            // firebase realtime database에 데이터 추가
            const data = { index, fruit, percent };
            const ref = db.ref('data').push();
            await ref.set(data);
        },
    });
}

initKafka();