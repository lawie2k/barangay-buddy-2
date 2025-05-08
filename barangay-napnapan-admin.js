// Import necessary Firebase and EmailJS functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Your Firebase configuration
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
const auth = getAuth();
const storage = getStorage(app);

// The barangay name you're working with
const barangay = "Napnapan";

// Function to render event posts (from public view)
function renderEventPost(container, text, imageBase64, barangay, timestamp, docId) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post-box");
  postDiv.style.width = "90%";
  postDiv.style.height = "auto";
  postDiv.style.display = "flex";
  postDiv.style.flexDirection = "column";
  postDiv.style.fontSize = "14px";
  postDiv.style.gap = "10px";
  postDiv.style.padding = "15px";
  postDiv.style.paddingBottom = "50px"; // Add padding for delete button
  postDiv.style.backgroundColor = "#fff";
  postDiv.style.borderRadius = "8px";
  postDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
  postDiv.style.position = "relative"; // For delete button positioning

  // Add header with barangay and date
  const headerDiv = document.createElement("div");
  headerDiv.style.display = "flex";
  headerDiv.style.justifyContent = "space-between";
  headerDiv.style.alignItems = "center";
  headerDiv.style.marginBottom = "10px";
  headerDiv.style.borderBottom = "1px solid #eee";
  headerDiv.style.paddingBottom = "5px";

  const barangayText = document.createElement("span");
  barangayText.textContent = `Posted by: ${barangay}`;
  barangayText.style.fontWeight = "bold";
  barangayText.style.color = "#6ec207";

  const dateText = document.createElement("span");
  dateText.textContent = new Date(timestamp.seconds * 1000).toLocaleString();
  dateText.style.color = "#666";
  dateText.style.fontSize = "12px";

  headerDiv.appendChild(barangayText);
  headerDiv.appendChild(dateText);
  postDiv.appendChild(headerDiv);

  // Add content container
  const contentDiv = document.createElement("div");
  contentDiv.style.display = "flex";
  contentDiv.style.gap = "15px";
  contentDiv.style.alignItems = "flex-start";
  contentDiv.style.marginBottom = "10px";

  // Add image if available
  if (imageBase64) {
    const img = document.createElement("img");
    img.src = imageBase64;
    img.style.maxWidth = "30%";
    img.style.borderRadius = "4px";
    img.alt = "Event Image";
    contentDiv.appendChild(img);
  }

  // Add text
  if (text) {
    const postText = document.createElement("p");
    postText.textContent = text;
    postText.style.margin = "0";
    postText.style.color = "#333";
    contentDiv.appendChild(postText);
  }

  postDiv.appendChild(contentDiv);

  // Add delete button for admin view
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.style.backgroundColor = "#ff4444";
  deleteButton.style.color = "white";
  deleteButton.style.border = "none";
  deleteButton.style.padding = "8px 15px";
  deleteButton.style.borderRadius = "4px";
  deleteButton.style.cursor = "pointer";
  deleteButton.style.position = "absolute";
  deleteButton.style.bottom = "15px";
  deleteButton.style.right = "15px";
  deleteButton.style.fontSize = "14px";
  deleteButton.style.transition = "background-color 0.3s";

  deleteButton.addEventListener("mouseover", () => {
    deleteButton.style.backgroundColor = "#ff0000";
  });

  deleteButton.addEventListener("mouseout", () => {
    deleteButton.style.backgroundColor = "#ff4444";
  });

  deleteButton.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this event post?")) {
      try {
        await deleteDoc(doc(db, "eventsPosts", docId));
      } catch (error) {
        console.error("Error deleting event post: ", error);
        alert("Failed to delete event post. Please try again.");
      }
    }
  });

  postDiv.appendChild(deleteButton);
  container.appendChild(postDiv);
}

// Load and render event posts for public view
document.addEventListener("DOMContentLoaded", () => {
  const eventSections = document.querySelectorAll(".event-section-box");

  if (eventSections.length > 0) {
    const postsQuery = query(
      collection(db, "eventsPosts"),
      orderBy("timestamp", "desc")
    );

    onSnapshot(postsQuery, (snapshot) => {
      eventSections.forEach((container) => {
        container.innerHTML = ""; // Clear previous posts
        snapshot.forEach((doc) => {
          const data = doc.data();
          renderEventPost(
            container,
            data.text,
            data.imageBase64,
            data.barangay,
            data.timestamp,
            doc.id  // Add the document ID
          );
        });
      });
    });
  }
});

// Admin functionality
document.addEventListener("DOMContentLoaded", async () => {
  const submissionContainers = document.querySelectorAll(".submissions");
  const sectionContainers = document.querySelectorAll(".request-submissions");

  // Display loading message initially
  submissionContainers.forEach((container) => {
    container.innerHTML = "<p>Loading...</p>";
  });
  sectionContainers.forEach((container) => {
    container.innerHTML = "<p>Loading...</p>";
  });

  try {
    const snapshot = await getDocs(
      collection(db, `formSubmissions/${barangay}/submissions`)
    );

    if (snapshot.empty) {
      submissionContainers.forEach((container) => {
        container.innerHTML = "<p>No submissions found for Napnapan.</p>";
      });
      sectionContainers.forEach((container) => {
        container.innerHTML = "<p>No submissions found for Napnapan.</p>";
      });
      return;
    }

    // Clear out previous content
    submissionContainers.forEach((container) => {
      container.innerHTML = "";
    });
    sectionContainers.forEach((container) => {
      container.innerHTML = "";
    });

    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.padding = "10px";
      div.style.margin = "10px 0";
      const emailSent = localStorage.getItem(`emailSent-${data.email}`) === "true";
      div.innerHTML = `
        <strong>${data.firstName} ${data.lastName}</strong><br>
        Age: ${data.age}<br>
        Purpose: ${data.purpose}<br>
        Email: ${data.email}<br>
        Submitted on: ${new Date(data.timestamp.seconds * 1000).toLocaleString()}
        <button class="accept-btn" data-email="${data.email}" data-name="${data.firstName}">Send Email</button>
        <span class="accepted-msg" style="display:${emailSent ? "inline" : "none"}; color: green; font-weight: bold;">✔ Email Sent</span>
      `;

      submissionContainers.forEach((container) => {
        container.appendChild(div.cloneNode(true));
      });

      sectionContainers.forEach((container) => {
        container.appendChild(div.cloneNode(true));
      });
    });

    // Attach event listeners to accept buttons
    const acceptButtons = document.querySelectorAll(".accept-btn");
    acceptButtons.forEach((btn) => {
      const email = btn.getAttribute("data-email");
      const emailSent = localStorage.getItem(`emailSent-${email}`) === "true";

      if (emailSent) {
        btn.disabled = true;
        btn.textContent = "Email Sent";
        btn.nextElementSibling.style.display = "inline";
      }

      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        localStorage.setItem(`emailSent-${email}`, "true");
        sendEmail(email, name);
        btn.disabled = true;
        btn.textContent = "Email Sent";
        btn.nextElementSibling.style.display = "inline";
      });
    });
  } catch (error) {
    console.error("Error loading submissions:", error);
    submissionContainers.forEach((container) => {
      container.innerHTML = "<p>Failed to load submissions.</p>";
    });
    sectionContainers.forEach((container) => {
      container.innerHTML = "<p>Failed to load submissions.</p>";
    });
  }
});

// Authentication handling
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("login.html");
  }
});

const logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener("click", function () {
    signOut(auth);
    window.location.href = "login.html";
  });
}

// Sidebar and content display
const buttons = document.querySelectorAll(".side-text button");
const sections = document.querySelectorAll(".admin-items > div:not(.sideMenu)");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetClass = button.getAttribute("data-target");
    sections.forEach((section) => {
      section.style.display = "none";
    });
    const targetSection = document.querySelector(`.${targetClass}`);
    if (targetSection) {
      targetSection.style.display = targetClass === "dashboard" ? "flex" : "block";
    }
  });
});

// Initial display setup
document.querySelectorAll(".admin-items > div").forEach((div) => {
  if (div.classList.contains("dashboard")) {
    div.style.display = "flex";
  } else if (!div.classList.contains("sideMenu")) {
    div.style.display = "none";
  }
});
