import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSys1qOfPXktRo1LyoZggtHZhj3b3GjDw",
  authDomain: "barangay-buddy.firebaseapp.com",
  projectId: "barangay-buddy",
  storageBucket: "barangay-buddy.appspot.com",
  messagingSenderId: "390005278798",
  appId: "1:390005278798:web:92c084dce55ba9fa3ddb1f",
  measurementId: "G-D8P70Y4RJ3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function renderEventPost(container, text, imageBase64, barangay, timestamp) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post-box1");
  postDiv.style.width = "90%";
  postDiv.style.height = "auto";
  postDiv.style.display = "flex";
  postDiv.style.flexDirection = "column";
  postDiv.style.fontSize = "20px";
  postDiv.style.gap = "10px";
  postDiv.style.padding = "15px";
  postDiv.style.backgroundColor = "#fff";
  postDiv.style.borderRadius = "8px";
  postDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

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

  const contentDiv = document.createElement("div");
  contentDiv.style.display = "flex";
  contentDiv.style.gap = "15px";
  contentDiv.style.alignItems = "flex-start";

  if (imageBase64) {
    const img = document.createElement("img");
    img.src = imageBase64;
    img.style.maxWidth = "30%";
    img.style.borderRadius = "4px";
    img.alt = "Event Image";
    contentDiv.appendChild(img);
  }

  if (text) {
    const postText = document.createElement("p");
    postText.textContent = text;
    postText.style.margin = "0";
    postText.style.color = "#333";
    contentDiv.appendChild(postText);
  }

  postDiv.appendChild(contentDiv);
  container.appendChild(postDiv);
}

document.addEventListener("DOMContentLoaded", () => {
  const eventSections = document.querySelectorAll(".event-section-box");

  if (eventSections.length > 0) {
    const postsQuery = query(
      collection(db, "eventsPosts"),
      orderBy("timestamp", "desc")
    );

    onSnapshot(postsQuery, (snapshot) => {
      eventSections.forEach((container) => {
        container.innerHTML = "";
        snapshot.forEach((doc) => {
          const data = doc.data();
          renderEventPost(
            container,
            data.text,
            data.imageBase64,
            data.barangay,
            data.timestamp
          );
        });
      });
    });
  }
});
