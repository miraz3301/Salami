import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyAkRmEtQTGwhEv8dhGyiH1fB_9Jzamwlog",
//   authDomain: "salami-dice.firebaseapp.com",
//   projectId: "salami-dice",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAkRmEtQTGwhEv8dhGyiH1fB_9Jzamwlog",
  authDomain: "salami-dice.firebaseapp.com",
  projectId: "salami-dice",
  storageBucket: "salami-dice.firebasestorage.app",
  messagingSenderId: "128420284829",
  appId: "1:128420284829:web:ecb576bc38c4e64a5bc774",
  measurementId: "G-LLJKH3RK3M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentPhone = null;

// LOGIN
window.login = async function () {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;

    if (!name || !phone) {
        alert("Fill all fields!");
        return;
    }

    const ref = doc(db, "users", phone);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        alert("❌ This number already used!");
    } else {
        await setDoc(ref, {
            name: name,
            rolled: false
        });

        currentPhone = phone;

        document.getElementById("login").style.display = "none";
        document.getElementById("game").style.display = "block";
    }
};

// DICE
window.rollDice = async function () {
    let value = Math.floor(Math.random() * 10) + 1;

    document.getElementById("result").innerText =
        "🎉 You got: " + value;

    const ref = doc(db, "users", currentPhone);

    await setDoc(ref, {
        rolled: true,
        result: value
    }, { merge: true });
};
