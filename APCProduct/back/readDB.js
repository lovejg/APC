const firebase = require('firebase/app');
const { getDatabase, ref, onValue } = require('firebase/database');

const firebaseConfig = { // 아래에 이제 APC에서 쓰는 firebase 프로젝트의 setting 값들을 넣어주면 됨
    apiKey: "AIzaSyDea5LTDfgoq4yV2mhKPS4BnmhzGqsaLg8",
    authDomain: "test-a8aa8.firebaseapp.com",
    databaseURL: "https://test-a8aa8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test-a8aa8",
    storageBucket: "test-a8aa8.appspot.com",
    messagingSenderId: "772663523372",
    appId: "1:772663523372:web:1b5722f5d10f4f26a27989"
};

// Firebase 초기화
const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);

const dataRef = ref(database, 'data'); // 여기 students를 원하는 태그 값으로 바꿔주기

console.log("Start reading data from Firebase DB")
console.log("Print data every 1 second")

let keydub = new Set(); // 이미 완료된 key 저장 set

let debounce; // 출력 여러번 되는 것을 방지

// 실시간으로 데이터 변경 감지(추가 삭제 모두 가능) => 초당 한개씩 출력으로 변경
onValue(dataRef, (snapshot) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
        const fireDBdata = snapshot.val();
        if (fireDBdata) {
            const keys = Object.keys(fireDBdata);

            keys.forEach((key, index) => {
                if (!keydub.has(key)) {
                    setTimeout(() => {
                        console.log("등급 판별 완료: " + JSON.stringify(fireDBdata[key]));
                        keydub.add(key);
                    }, 1000 * index) // 1초 간격 출력(1 second delay)
                }
            });
        }
        else {
            console.log("No data found in DB yet")
        }
    }, 500); // 500ms debounce time
}, (error) => { // 에러 처리
    console.error(error);
});