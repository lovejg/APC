import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import "firebase/database";
var firebaseConfig = {
  apiKey: "AIzaSyALsiOZq2xgrAiiDgrqBk5S_3Yi6zZ-Lqc",
  databaseURL: "https://unity-apc-default-rtdb.firebaseio.com",
  projectId: "unity-apc",
  storageBucket: "unity-apc.appspot.com",
  messagingSenderId: "473072708063",
  appId: "1:473072708063:ios:5c46bcfe8af8d31485bc6a",
};
// Initialize Firebase
initializeApp(firebaseConfig);
export default getDatabase();
