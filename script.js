import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAkRmEtQTGwhEv8dhGyiH1Jzamwlog",
    authDomain: "salami-dice.firebaseapp.com",
    projectId: "salami-dice",
    storageBucket: "salami-dice.firebasestorage.app",
    messagingSenderId: "128420284829",
    appId: "1:128420284829:web:ecb576bc38c4e64a5bc774",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentPhone = null;

// LOGIN
async function login() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !phone) {
        alert("Fill all fields!");
        return;
    }

    const ref = doc(db, "users", phone);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        alert("❌ Number already used!");
        return;
    }

    await setDoc(ref, {
        name: name,
        rolled: false
    });

    currentPhone = phone;

    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";
}

// DICE
async function rollDice() {
    if (!currentPhone) {
        alert("Login first!");
        return;
    }

    const value = Math.floor(Math.random() * 6) + 1;

    const dice = document.getElementById("dice");
    const result = document.getElementById("result");
    const btn = document.getElementById("rollBtn");

    btn.disabled = true;
    result.innerText = "🎲 Rolling...";

    dice.classList.add("shake");

    setTimeout(() => {
        dice.classList.remove("shake");
        dice.innerText = getDiceFace(value);
    }, 500);

    try {
        const ref = doc(db, "users", currentPhone);

        await setDoc(ref, {
            rolled: true,
            result: value
        }, { merge: true });

        result.innerText = "🎉 You got: " + value;
    } catch (err) {
        result.innerText = "❌ Error saving result.";
    }

    btn.disabled = false;
}

// Dice faces
function getDiceFace(v) {
    const faces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return faces[v];
}

// Events
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("enterBtn").addEventListener("click", login);
    document.getElementById("rollBtn").addEventListener("click", rollDice);
});
