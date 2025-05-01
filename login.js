// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

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
const database = getDatabase(app);

const loginBtn = document.getElementById("login-button");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  const userRef = ref(database, users);

  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        let loggedIn = false;

        for (const userId in usersData) {
          const user = usersData[userId];
          // Assuming each user object has 'email' and 'password' properties
          if (user.email === email && user.password === password) {
            loggedIn = true;
            alert("Login successful!");

            window.location.href = "admin.html";
            break;
          }
        }

        if (!loggedIn) {
          alert("Login failed. Invalid email or password.");
        }
      } else {
        alert("No user data found in the database.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      alert("An error occurred during login.");
    });
});
