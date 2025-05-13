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
const backbtn = document.getElementById("back-btn");

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
const loaderWrapper = document.querySelector(".loader-wrapper");

// Function to show loader
function showLoader() {
  loaderWrapper.style.display = "flex";
  loaderWrapper.style.opacity = "1";
  loaderWrapper.style.pointerEvents = "auto";
}

// Function to hide loader
function hideLoader() {
  loaderWrapper.style.opacity = "0";
  loaderWrapper.style.pointerEvents = "none";
  setTimeout(() => {
    loaderWrapper.style.display = "none";
  }, 500);
}

loginBtn.addEventListener("click", function (event) {
  event.preventDefault();
  
  // Show loader immediately
  showLoader();

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
            let redirectUrl = "";

            // Set redirect URL based on barangay
            if (barangay === "kingking") {
              redirectUrl = "barangay-kingking-admin.html";
            } else if (barangay === "magnaga") {
              redirectUrl = "barangay-magnaga-admin.html";
            } else if (barangay === "napnapan") {
              redirectUrl = "barangay-napnapan-admin.html";
            } else if (barangay === "fuentes") {
              redirectUrl = "barangay-fuentes-admin.html";
            }

            if (redirectUrl) {
              // Add a small delay before redirecting to ensure loader is visible
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 1000);
            } else {
              hideLoader();
              alert("No specific landing page for barangay: " + barangay);
            }
          } else {
            hideLoader();
            alert("No user data found.");
          }
        })
        .catch((error) => {
          hideLoader();
          console.error("Error fetching user data:", error);
        });
    })
    .catch((error) => {
      hideLoader();
      alert("Login failed: " + error.message);
    });
});
