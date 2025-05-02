// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const filename = window.location.pathname.split("/").pop().split(".")[0];

document.addEventListener("DOMContentLoaded", () => {
  const submitbutton = document.getElementById("submit-btn");

  if (submitbutton) {
    submitbutton.addEventListener("click", async () => {
      const inputs = document.querySelectorAll(".input");
      const email = document.querySelector(".input-email").value;

      const data = {
        FormName: filename,
        firstName: inputs[0].value,
        middleName: inputs[1].value,
        lastName: inputs[2].value,
        barangay: inputs[3].value,
        age: inputs[4].value,
        status: inputs[5].value,
        mobileNumber: inputs[6].value,
        yearsOfStay: inputs[7].value,
        purpose: inputs[8].value,
        studentOrPatientName: inputs[9].value,
        address: inputs[10].value,
        relationship: inputs[11].value,
        email: email,
        timestamp: new Date(),
      };
      try {
        await addDoc(collection(db, "formSubmissions"), data);
        alert("Form submitted successfully!");
      } catch (error) {
        console.error("error saving form", error);
        alert("submission failed");
      }
    });
  }
});
