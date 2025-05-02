// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSys1qOfPXktRo1LyoZggtHZhj3b3GjDw",
  authDomain: "barangay-buddy.firebaseapp.com",
  databaseURL:
    "https://barangay-buddy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "barangay-buddy",
  storageBucket: "barangay-buddy.firebasestorage.app",
  messagingSenderId: "390005278798",
  appId: "1:390005278798:web:92c084dce55ba9fa3ddb1f",
  measurementId: "G-D8P70Y4RJ3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const signupForm = document.getElementById("signupform");
const loginForm = document.getElementById("loginform");
const addbtn = document.getElementById("add-acc");
const backbtn = document.getElementById("back-btn");

addbtn.addEventListener("click", () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});

backbtn.addEventListener("click", () => {
  loginForm.style.display = "block";
  signupForm.style.display = "none";
});

/*-----------------------signup code---------------------------*/
const createButton = document.getElementById("create-button");

createButton.addEventListener("click", function (event) {
  event.preventDefault();

  const signupEmail = document.getElementById("signup-email").value;
  const signupBarangay = document.getElementById("signup-barangay").value;
  const signupPass = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, signupEmail, signupPass)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      set(ref(database, "users/" + user.uid), {
        email: signupEmail,
        barangay: signupBarangay,
      });

      alert("creating account.......");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});
/*-----------------------signup code end---------------------------*/

const loginEmail = document.getElementById("email");
const loginPass = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", function (event) {
  event.preventDefault();

  signInWithEmailAndPassword(auth, loginEmail.value, loginPass.value)
    .then((userCredential) => {
      const user = userCredential.user;
      const db = getDatabase();
      const dbRef = ref(db);

      // Get user data from the Realtime Database
      get(child(dbRef, `users/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const barangay = snapshot.val().barangay;

            // Redirect based on barangay
            if (barangay === "kingking") {
              window.location.href = "barangay-kingking-admin.html";
            } else if (barangay === "magnaga") {
              window.location.href = "barangay-magnaga-admin.html";
            } else if (barangay === "napnapan") {
              window.location.href = "barangay-napnapan-admin.html";
            } else if (barangay === "fuentes") {
              window.location.href = "barangay-fuentes-admin.html";
            } else {
              alert("No specific landing page for barangay: " + barangay);
            }
          } else {
            alert("No user data found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});
