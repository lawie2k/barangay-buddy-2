// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSys1qOfPXktRo1LyoZggtHZhj3b3GjDw",
  authDomain: "barangay-buddy.firebaseapp.com",
  projectId: "barangay-buddy",
  storageBucket: "barangay-buddy.firebasestorage.app",
  messagingSenderId: "390005278798",
  appId: "1:390005278798:web:5fbb3f2534f45f803ddb1f",
  measurementId: "G-74NSKRNGWP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const hamburgerMenu = document.querySelector(".hamburger-menu");
const sidebar = document.querySelector(".sidebar");
const exitbutton = document.querySelector(".exit-btn");

hamburgerMenu.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

exitbutton.addEventListener("click", () => {
  sidebar.classList.remove("open");
});
