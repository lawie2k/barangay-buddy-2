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
  doc,
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

const barangay = "KingKing";

function renderEventPost(
  container,
  text,
  imageBase64,
  barangay,
  timestamp,
  docId
) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post-box");
  postDiv.style.width = "90%";
  postDiv.style.height = "auto";
  postDiv.style.display = "flex";
  postDiv.style.flexDirection = "column";
  postDiv.style.fontSize = "14px";
  postDiv.style.gap = "10px";
  postDiv.style.padding = "15px";
  postDiv.style.paddingBottom = "50px";
  postDiv.style.backgroundColor = "#fff";
  postDiv.style.borderRadius = "8px";
  postDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
  postDiv.style.position = "relative";

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
  contentDiv.style.marginBottom = "10px";

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
            data.timestamp,
            doc.id
          );
        });
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const submissionContainers = document.querySelectorAll(".submissions");
  const sectionContainers = document.querySelectorAll(".request-submissions");

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
        container.innerHTML = "<p>No submissions found for KingKing.</p>";
      });
      sectionContainers.forEach((container) => {
        container.innerHTML = "<p>No submissions found for KingKing.</p>";
      });
      return;
    }

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
      const emailSent =
        localStorage.getItem(`emailSent-${data.email}`) === "true";
      div.innerHTML = `
        <strong>${data.firstName} ${data.lastName}</strong><br>
        Age: ${data.age}<br>
        Purpose: ${data.purpose}<br>
        Email: ${data.email}<br>
        Submitted on: ${new Date(
          data.timestamp.seconds * 1000
        ).toLocaleString()}
        <button class="accept-btn" data-email="${data.email}" data-name="${
        data.firstName
      }">Send Email</button>
        <span class="accepted-msg" style="display:${
          emailSent ? "inline" : "none"
        }; color: green; font-weight: bold;">✔ Email Sent</span>
      `;

      submissionContainers.forEach((container) => {
        container.appendChild(div.cloneNode(true));
      });

      sectionContainers.forEach((container) => {
        container.appendChild(div.cloneNode(true));
      });
    });

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
      targetSection.style.display =
        targetClass === "dashboard" ? "flex" : "block";
    }
  });
});

document.querySelectorAll(".admin-items > div").forEach((div) => {
  if (div.classList.contains("dashboard")) {
    div.style.display = "flex";
  } else if (!div.classList.contains("sideMenu")) {
    div.style.display = "none";
  }
});

/*-----------------------------------------------------------------------------------------*/
/*--------------------------sidebar and content display-----------------------------------*/
/*----------------------------------------------------------------*/
document.querySelectorAll(".admin-items > div").forEach((div) => {
  if (div.classList.contains("dashboard")) {
    div.style.display = "flex";
  } else if (!div.classList.contains("sideMenu")) {
    div.style.display = "none";
  }
});

/*----------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
  const submissionContainers = document.querySelectorAll(`.${barangay}Records`);

  submissionContainers.forEach((container) => {
    container.innerHTML = "<p>Loading...</p>";
  });

  try {
    const snapshot = await getDocs(
      collection(db, `formSubmissions/${barangay}/submissions`)
    );

    if (snapshot.empty) {
      submissionContainers.forEach((container) => {
        container.innerHTML = "<p>No submissions found for KingKing.</p>";
      });
      return;
    }

    submissionContainers.forEach((container) => {
      container.innerHTML = "";
    });

    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.padding = "10px";
      div.style.margin = "10px 0";
      div.innerHTML = `
        <strong>${data.firstName} ${data.lastName}</strong><br>
        Age: ${data.age}<br>
        Email: ${data.email}<br>
      `;

      submissionContainers.forEach((container) => {
        container.appendChild(div.cloneNode(true));
      });
    });
  } catch (error) {
    console.error("Error loading submissions:", error);
    submissionContainers.forEach((container) => {
      container.innerHTML = "<p>Failed to load submissions.</p>";
    });
  }
});

/*-------------------------------------------------------------------*/

const freedomWallContainers = document.querySelectorAll(
  ".freedomWallContainer"
);
const freedomWallDashboard = document.querySelectorAll(".freedomWallDashboard");

function renderPost(container, text, docId) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post-box");
  postDiv.style.position = "relative";
  postDiv.style.padding = "15px";
  postDiv.style.margin = "10px 0";
  postDiv.style.border = "1px solid #ddd";
  postDiv.style.borderRadius = "5px";
  postDiv.style.backgroundColor = "#fff";

  const userName = document.createElement("h4");
  userName.textContent = "Anonymous";
  userName.classList.add("post-username");
  userName.style.margin = "0 0 10px 0";
  userName.style.color = "#333";

  const postText = document.createElement("p");
  postText.textContent = text;
  postText.style.margin = "0 0 10px 0";
  postText.style.color = "#666";

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
  deleteButton.style.top = "10px";
  deleteButton.style.right = "10px";
  deleteButton.style.fontSize = "14px";
  deleteButton.style.transition = "background-color 0.3s";

  deleteButton.addEventListener("mouseover", () => {
    deleteButton.style.backgroundColor = "#ff0000";
  });

  deleteButton.addEventListener("mouseout", () => {
    deleteButton.style.backgroundColor = "#ff4444";
  });

  deleteButton.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "freedomWallPosts", docId));
      } catch (error) {
        console.error("Error deleting post: ", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  });

  postDiv.appendChild(userName);
  postDiv.appendChild(postText);
  postDiv.appendChild(deleteButton);
  container.appendChild(postDiv);
}

const postsQuery = query(
  collection(db, "freedomWallPosts"),
  orderBy("timestamp", "desc")
);

onSnapshot(postsQuery, (snapshot) => {
  freedomWallContainers.forEach((container) => {
    container.innerHTML = "";
    snapshot.forEach((doc) => {
      renderPost(container, doc.data().text, doc.id);
    });
  });
  freedomWallDashboard.forEach((container) => {
    container.innerHTML = "";
    snapshot.forEach((doc) => {
      renderPost(container, doc.data().text, doc.id);
    });
  });
});

/*-----------------------------------------------------------*/

const submitEventButton = document.getElementById("submitEventsPost");
const eventTextArea = document.getElementById("text-area");
const eventImageInput = document.getElementById("eventsImage");

submitEventButton.addEventListener("click", async () => {
  const eventText = eventTextArea.value.trim();
  const eventImageFile = eventImageInput.files[0];

  if (!eventText && !eventImageFile) {
    alert("Please add either a description or an image for the event.");
    return;
  }

  try {
    let imageBase64 = null;

    if (eventImageFile) {
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(eventImageFile);
      });
    }

    await addDoc(collection(db, "eventsPosts"), {
      text: eventText,
      imageBase64: imageBase64 || null,
      barangay: barangay,
      timestamp: new Date(),
    });

    eventTextArea.value = "";
    eventImageInput.value = "";

    alert("Event posted successfully!");
  } catch (error) {
    console.error("Error posting event:", error);
    alert("Failed to post the event.");
  }
});
