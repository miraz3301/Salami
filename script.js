import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkRmEtQTGwhEv8dhGyiH1fB_9Jzamwlog",
    authDomain: "salami-dice.firebaseapp.com",
    projectId: "salami-dice",
    storageBucket: "salami-dice.firebasestorage.app",
    messagingSenderId: "128420284829",
    appId: "1:128420284829:web:ecb576bc38c4e64a5bc774",
    measurementId: "G-LLJKH3RK3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentPhone = null;

// --- LOGIN FUNCTION ---
async function login() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !phone) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        const ref = doc(db, "users", phone);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            alert("❌ This number has already been used!");
        } else {
            await setDoc(ref, {
                name: name,
                rolled: false,
                timestamp: new Date()
            });

            currentPhone = phone;

            // UI Transition
            document.getElementById("login").style.display = "none";
            document.getElementById("game").style.display = "block";
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Connection error. Check your Firestore rules.");
    }
}

// --- DICE ROLL FUNCTION ---
async function rollDice() {
    // Generate random number 1-10
    const value = Math.floor(Math.random() * 10) + 1;
    
    const resultDisplay = document.getElementById("result");
    const rollButton = document.getElementById("rollBtn");

    resultDisplay.innerText = "🎲 Rolling...";
    rollButton.disabled = true; // Prevent double clicking

    try {
        const ref = doc(db, "users", currentPhone);
        
        await setDoc(ref, {
            rolled: true,
            result: value
        }, { merge: true });

        resultDisplay.innerText = "🎉 You got: " + value;
    } catch (error) {
        console.error("Error saving roll:", error);
        resultDisplay.innerText = "❌ Error saving result.";
        rollButton.disabled = false;
    }
}

// --- EVENT LISTENERS ---
// This connects the HTML buttons to the JS functions safely
document.getElementById("enterBtn").addEventListener("click", login);
document.getElementById("rollBtn").addEventListener("click", rollDice);
