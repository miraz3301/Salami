import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAkRmEtQTGwhEv8dhGyiH1Jzamwlog",
    authDomain: "salami-dice.firebaseapp.com",
    projectId: "salami-dice",
    storageBucket: "salami-dice.firebasestorage.app",
    messagingSenderId: "128420284829",
    appId: "1:128420284829:web:ecb576bc38c4e64a5bc774",
};

// Init
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
        rolled: false,
        rollCount: 0 // 👈 INITIAL COUNT
    });

    currentPhone = phone;

    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";

    document.getElementById("count").innerText = "Rolls: 0";
}

// DICE
async function rollDice() {
    if (!currentPhone) {
        alert("Login first!");
        return;
    }

    const dice = document.getElementById("dice");
    const result = document.getElementById("result");
    const btn = document.getElementById("rollBtn");
    const countDisplay = document.getElementById("count");

    btn.disabled = true;
    result.innerText = "🎲 Rolling...";

    dice.classList.add("roll-animation");

    const interval = setInterval(() => {
        dice.innerText = getDiceFace(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(async () => {
        clearInterval(interval);

        const finalValue = Math.floor(Math.random() * 6) + 1;

        dice.innerText = getDiceFace(finalValue);
        dice.classList.remove("roll-animation");

        try {
            const ref = doc(db, "users", currentPhone);

            // ✅ increment roll count
            await updateDoc(ref, {
                rollCount: increment(1),
                result: finalValue,
                rolled: true
            });

            
            const snap = await getDoc(ref);
            const data = snap.data();

            countDisplay.innerText = "Rolls: " + (data.rollCount || 0);

            result.innerText = "🎉 You got Salami: " + finalValue + " Taka";
        } catch (err) {
            result.innerText = "❌ Error saving result.";
        }

        btn.disabled = false;
    }, 3000);
}

// Dice faces
function getDiceFace(v) {
    const faces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return faces[v];
}

// EVENTS
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("enterBtn").addEventListener("click", login);
    document.getElementById("rollBtn").addEventListener("click", rollDice);
});
