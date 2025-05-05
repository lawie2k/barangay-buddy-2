import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
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

const hamburgerMenu = document.querySelector(".hamburger-menu");
const sidebar = document.querySelector(".sidebar");
const exitbutton = document.querySelector(".exit-btn");

hamburgerMenu.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

exitbutton.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

/*---------------------------------------------------------*/

// Select DOM elements for the Freedom Wall section
const freedomWallForm = document.getElementById("freedomWallForm");
const freedomWallInput = document.getElementById("freedomWallInput");
const freedomWallContainer = document.getElementById("freedomWallContainer"); // Container to display posts

// Track the newly submitted post to avoid duplicate rendering
let newlySubmittedPost = false;

// Listen for form submission
freedomWallForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the page from refreshing

  const feedbackText = freedomWallInput.value.trim(); // Get the value from the input field

  if (feedbackText !== "") {
    try {
      // Add feedback to Firestore
      const docRef = await addDoc(collection(db, "freedomWallPosts"), {
        text: feedbackText,
        timestamp: new Date(), // Store the timestamp for sorting/display
      });
      console.log("Document written with ID: ", docRef.id);

      // Clear the input field after submission
      freedomWallInput.value = "";

      // Mark that a post was newly submitted
      newlySubmittedPost = true;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  } else {
    alert("Please enter some feedback before submitting.");
  }
});

// Function to render the post in the container
function renderPost(text) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post-box");

  const userName = document.createElement("h4");
  userName.textContent = "Anonymous";
  userName.classList.add("post-username");

  const postText = document.createElement("p");
  postText.textContent = text;

  postDiv.appendChild(userName);
  postDiv.appendChild(postText);
  freedomWallContainer.appendChild(postDiv);
}

// Fetch and render posts from Firestore
async function fetchPosts() {
  try {
    const querySnapshot = await getDocs(collection(db, "freedomWallPosts"));
    console.log(querySnapshot); // Check if it's empty or contains documents
    if (querySnapshot.empty) {
      console.log("No posts available in the collection.");
    } else {
      querySnapshot.forEach((doc) => {
        renderPost(doc.data().text); // Render each post's text
      });
    }
  } catch (error) {
    console.error("Error fetching posts: ", error);
  }
}

// Fetch posts when the page loads
fetchPosts();

// Real-time listener for Firestore collection
const postsRef = collection(db, "freedomWallPosts");
const q = query(postsRef, orderBy("timestamp", "desc")); // Order by timestamp for latest posts first

// Real-time listener for Firestore collection
onSnapshot(q, (querySnapshot) => {
  if (!newlySubmittedPost) {
    freedomWallContainer.innerHTML = ""; // Clear the container before rendering the updated posts
    querySnapshot.forEach((doc) => {
      renderPost(doc.data().text); // Render each post in the container
    });
  } else {
    // Reset flag after rendering newly submitted post
    newlySubmittedPost = false;
  }
});
