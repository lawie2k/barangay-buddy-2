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
      const email = document.querySelector(".input-email").value.trim();
      
      // Define field names for all inputs
      const fieldNames = [
        "First Name",
        "Middle Name",
        "Last Name",
        "Barangay",
        "Age",
        "Status",
        "Mobile Number",
        "Years of Stay",
        "Purpose",
        "Student/Patient Name",
        "Address",
        "Relationship"
      ];
      
      // Check all fields
      let hasEmptyFields = false;
      
      // Check regular inputs
      for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].value.trim()) {
          showToast(`Please enter ${fieldNames[i]}`, "error");
          hasEmptyFields = true;
          return; // Exit early after first empty field
        }
      }
      
      // Check email field separately
      if (!email) {
        showToast("Please enter your Email", "error");
        hasEmptyFields = true;
        return;
      }
      
      // If we got here, all fields are filled
      const data = {
        FormName: filename,
        firstName: inputs[0].value.trim(),
        middleName: inputs[1].value.trim(),
        lastName: inputs[2].value.trim(),
        barangay: inputs[3].value.trim(),
        age: inputs[4].value.trim(),
        status: inputs[5].value.trim(),
        mobileNumber: inputs[6].value.trim(),
        yearsOfStay: inputs[7].value.trim(),
        purpose: inputs[8].value.trim(),
        studentOrPatientName: inputs[9].value.trim(),
        address: inputs[10].value.trim(),
        relationship: inputs[11].value.trim(),
        email: email,
        timestamp: new Date(),
      };

      try {
        // Save the form data to Firestore
        await addDoc(
          collection(db, `formSubmissions/${data.barangay}/submissions`),
          data
        );
        showToast("Form submitted successfully!", "success");
        
        // Clear all fields after successful submission
        inputs.forEach(input => {
          input.value = "";
        });
        document.querySelector(".input-email").value = "";
        
      } catch (error) {
        console.error("Error saving form", error);
        showToast("Submission failed", "error");
      }
    });
  }
});
