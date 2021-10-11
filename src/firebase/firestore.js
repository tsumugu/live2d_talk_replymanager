import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore/lite'
const firebaseConfig = {
  apiKey: "AIzaSyChVdRIHkz6R5lPOH1tttIB0Aoaydq_N0g",
  authDomain: "csderf-1352.firebaseapp.com",
  databaseURL: "https://csderf-1352-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "csderf-1352",
  storageBucket: "csderf-1352.appspot.com",
  messagingSenderId: "936872253266",
  appId: "1:936872253266:web:43a38183e8f0b0ba244c8b"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
export default db