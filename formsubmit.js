// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
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

function showToast(message, type = 'success') {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "show " + type;
  
  setTimeout(function(){
    toast.className = "";
    setTimeout(() => {
      toast.className = "";
    }, 500);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-btn");

  if (submitButton) {
    submitButton.addEventListener("click", async () => {
      const inputs = document.querySelectorAll(".input");
      const email = document.querySelector(".input-email").value;
      const selectedBarangay = inputs[3].value;

      if (!selectedBarangay) {
        showToast("Please select barangay", "error");
        return;
      }
      if (!inputs[8].value) {
        showToast("Please select purpose", "error");
        return;
      }

      const data = {
        FormName: filename,
        firstName: inputs[0].value,
        middleName: inputs[1].value,
        lastName: inputs[2].value,
        barangay: selectedBarangay,
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
        // Save the form data to Firestore
        await addDoc(
          collection(db, `formSubmissions/${selectedBarangay}/submissions`),
          data
        );
        showToast("Form submitted successfully!", "success");
      } catch (error) {
        console.error("Error saving form", error);
        showToast("Submission failed", "error");
      }
    });
  }
});
