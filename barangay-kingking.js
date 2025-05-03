import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
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

const barangay = "KingKing";

document.addEventListener("DOMContentLoaded", async () => {
  const submissionsContainer = document.getElementById("submissions");
  submissionsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const snapshot = await getDocs(
      collection(db, `formSubmissions/${barangay}/submissions`)
    );

    if (snapshot.empty) {
      submissionsContainer.innerHTML =
        "<p>No submissions found for Kingking.</p>";
      return;
    }

    submissionsContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.padding = "10px";
      div.style.margin = "10px 0";
      div.innerHTML = `
          <strong>${data.firstName} ${data.lastName}</strong><br>
          Age: ${data.age}<br>
          Purpose: ${data.purpose}<br>
          Email: ${data.email}<br>
          Submitted on: ${new Date(
            data.timestamp.seconds * 1000
          ).toLocaleString()}
        `;
      submissionsContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading submissions:", error);
    submissionsContainer.innerHTML = "<p>Failed to load submissions.</p>";
  }
});
