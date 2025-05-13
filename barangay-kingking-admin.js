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
  updateDoc,
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

// Function to show snackbar notification
function showSnackbar(message, type = 'success') {
  const snackbar = document.createElement('div');
  snackbar.className = `snackbar ${type}`;
  snackbar.textContent = message;
  document.body.appendChild(snackbar);

  // Add show class after a small delay to trigger animation
  setTimeout(() => {
    snackbar.classList.add('show');
  }, 100);

  // Remove snackbar after 3 seconds
  setTimeout(() => {
    snackbar.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(snackbar);
    }, 300);
  }, 3000);
}

// Function to send email using EmailJS
async function sendEmail(email, name) {
  try {
    const serviceID = "service_qhp2e0j";  // Your service ID
    const templateID = "template_kdtwkdr";  // Your template ID
    const publicKey = "8AeJWflF2cbrTW3gA";  // Your public key

    const templateParams = {
      to_email: email,
      to_name: name,
      message: `Hello ${name}, your submission has been received. Thank you!`
    };

    // Make sure EmailJS is initialized
    emailjs.init(publicKey);

    // Send the email
    const response = await emailjs.send(serviceID, templateID, templateParams);
    console.log("Email sent successfully:", response);
    showSnackbar("Email sent successfully!", "success");
  } catch (error) {
    console.error("Error sending email:", error);
    showSnackbar("Failed to send email. Please try again.", "error");
    throw error;
  }
}

// Function to show toast notifications
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

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

  postDiv.appendChild(userName);
  postDiv.appendChild(postText);
  container.appendChild(postDiv);
}

function renderEventPost(
  container,
  text,
  imageBase64,
  barangay,
  timestamp,
  docId
) {
  /*-----------------------------events post------------------------------*/
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
        showToast("Event post deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting event post: ", error);
        showToast("Failed to delete event post. Please try again.", "error");
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
/*-----------------------------request and submission------------------------------*/
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
      }" data-doc-id="${doc.id}">Send Email</button>
        <span class="accepted-msg" style="display:${
          data.emailSent ? "inline" : "none"
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
      const docId = btn.getAttribute("data-doc-id");
      const email = btn.getAttribute("data-email");
      const emailSent = btn.nextElementSibling.style.display === "inline";

      if (emailSent) {
        btn.disabled = true;
        btn.textContent = "Email Sent";
      }

      btn.addEventListener("click", async () => {
        const name = btn.getAttribute("data-name");
        try {
          // Send the email first
          await sendEmail(email, name);

          // Only update Firestore if email was sent successfully
          await updateDoc(
            doc(db, `formSubmissions/${barangay}/submissions`, docId),
            {
              emailSent: true,
            }
          );

          // Update UI only after successful email send and Firestore update
          btn.disabled = true;
          btn.textContent = "Email Sent";
          btn.nextElementSibling.style.display = "inline";
        } catch (error) {
          console.error("Error sending email:", error);
          alert("Failed to send email. Please try again.");
          // Don't update Firestore or UI if email failed
        }
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
/*-----------------------------authentication------------------------------*/
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
/*---------------------------side bar and content display--------------------------------*/
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

const freedomWallContainers = document.querySelectorAll(
  ".freedomWallContainer"
);
const freedomWallDashboard = document.querySelectorAll(".freedomWallDashboard");

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

/*-----------------------------resident records------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
  const residentRecordsContainer = document.querySelector(
    ".resident-rec-kingking"
  );
  const firstnameInput = document.getElementById("firstname");
  const lastnameInput = document.getElementById("lastname");
  const addressInput = document.getElementById("address");
  const genderInput = document.getElementById("gender");
  const registeredVotersInput = document.getElementById("registeredVoters");
  const addRecordButton = document.getElementById("addResidentRecord");
  const recordsList = document.querySelector(".records-list");
  const recordTemplate = document.getElementById("record-template");

  // Function to add a new resident record
  async function addResidentRecord() {
    const firstname = firstnameInput.value.trim();
    const lastname = lastnameInput.value.trim();
    const address = addressInput.value.trim();
    const gender = genderInput.value.trim();
    const registeredVoters = registeredVotersInput.value.trim();

    if (!firstname || !lastname || !address || !gender) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    try {
      // Add the new record to Firestore
      const docRef = await addDoc(collection(db, `residentRecords/${barangay}/records`), {
        firstname,
        lastname,
        address,
        gender,
        registeredVoters: registeredVoters === "yes" || registeredVoters === "Yes",
        timestamp: new Date()
      });

      // Create and append the new record to the list immediately
      const recordClone = recordTemplate.content.cloneNode(true);
      
      // Fill in the record data
      recordClone.querySelector(".record-name").textContent = `${firstname} ${lastname}`;
      recordClone.querySelector(".record-address").textContent = address;
      recordClone.querySelector(".record-gender").textContent = gender;
      recordClone.querySelector(".record-voter").textContent = registeredVoters === "yes" || registeredVoters === "Yes" ? "Yes" : "No";
      recordClone.querySelector(".record-date").textContent = new Date().toLocaleString();

      // Add delete functionality
      const deleteButton = recordClone.querySelector(".delete-record");
      deleteButton.dataset.id = docRef.id;
      deleteButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this record?")) {
          try {
            const docRef = doc(db, `residentRecords/${barangay}/records`, docRef.id);
            await deleteDoc(docRef);
            deleteButton.closest(".record-item").remove();
            showSnackbar("Record deleted successfully!", "success");
          } catch (error) {
            console.error("Error deleting record:", error);
            showSnackbar("Failed to delete record. Please try again.", "error");
          }
        }
      });

      recordsList.appendChild(recordClone);

      // Clear inputs after successful submission
      firstnameInput.value = "";
      lastnameInput.value = "";
      addressInput.value = "";
      genderInput.value = "";
      registeredVotersInput.value = "";

      showSnackbar("Resident record added successfully!", "success");
    } catch (error) {
      console.error("Error adding resident record:", error);
      showSnackbar("Failed to add resident record. Please try again.", "error");
    }
  }

  // Add event listener to the add record button
  addRecordButton.addEventListener("click", addResidentRecord);

  // Add event listener to the form inputs
  const formInputs = document.querySelectorAll(".resident-rec-inputs input");
  formInputs.forEach((input) => {
    input.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        await addResidentRecord();
      }
    });
  });

  // Load and display existing resident records
  try {
    const snapshot = await getDocs(collection(db, `residentRecords/${barangay}/records`));

    if (snapshot.empty) {
      residentRecordsContainer.innerHTML = "<p>No resident records found.</p>";
      return;
    }

    residentRecordsContainer.innerHTML = "";

    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const recordClone = recordTemplate.content.cloneNode(true);
      
      // Fill in the record data
      recordClone.querySelector(".record-name").textContent = `${data.firstname} ${data.lastname}`;
      recordClone.querySelector(".record-address").textContent = data.address;
      recordClone.querySelector(".record-gender").textContent = data.gender;
      recordClone.querySelector(".record-voter").textContent = data.registeredVoters ? "Yes" : "No";
      recordClone.querySelector(".record-date").textContent = new Date(data.timestamp.seconds * 1000).toLocaleString();
      
      // Add delete functionality
      const deleteButton = recordClone.querySelector(".delete-record");
      deleteButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this record?")) {
          try {
            const docRef = doc(db, `residentRecords/${barangay}/records`, docSnapshot.id);
            await deleteDoc(docRef);
            deleteButton.closest(".record-item").remove();
            showSnackbar("Record deleted successfully!", "success");
          } catch (error) {
            console.error("Error deleting record:", error);
            showSnackbar("Failed to delete record. Please try again.", "error");
          }
        }
      });

      recordsList.appendChild(recordClone);
    });
  } catch (error) {
    console.error("Error loading resident records:", error);
    residentRecordsContainer.innerHTML = "<p>Failed to load resident records.</p>";
  }
});

// Function to update resident record summary in dashboard
async function updateResidentSummary() {
  try {
    const snapshot = await getDocs(
      collection(db, `residentRecords/KingKing/records`)
    );

    let totalResidents = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let voterCount = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalResidents++;

      // Count by gender
      if (data.gender.toLowerCase() === "male") {
        maleCount++;
      } else if (data.gender.toLowerCase() === "female") {
        femaleCount++;
      }

      // Count registered voters
      if (
        data.registeredVoters === true ||
        data.registeredVoters === "yes" ||
        data.registeredVoters === "Yes"
      ) {
        voterCount++;
      }
    });

    // Calculate percentages
    const malePercentage =
      totalResidents > 0 ? Math.round((maleCount / totalResidents) * 100) : 0;
    const femalePercentage =
      totalResidents > 0 ? Math.round((femaleCount / totalResidents) * 100) : 0;
    const voterPercentage =
      totalResidents > 0 ? Math.round((voterCount / totalResidents) * 100) : 0;
    const populationPercentage = 100; // This is always 100% as it represents the total

    // Update the dashboard elements
    document.querySelector(
      ".resident-items:nth-child(1) .circle h3"
    ).textContent = `${populationPercentage}%`;
    document.querySelector(
      ".resident-items:nth-child(2) .circle h3"
    ).textContent = `${malePercentage}%`;
    document.querySelector(
      ".resident-items:nth-child(3) .circle h3"
    ).textContent = `${voterPercentage}%`;
    document.querySelector(
      ".resident-items:nth-child(4) .circle h3"
    ).textContent = `${femalePercentage}%`;
  } catch (error) {
    console.error("Error updating resident summary:", error);
  }
}

// Add event listener for dashboard tab
document.addEventListener("DOMContentLoaded", () => {
  const dashboardTab = document.querySelector(
    'button[data-target="dashboard"]'
  );
  if (dashboardTab) {
    dashboardTab.addEventListener("click", updateResidentSummary);
  }

  // Initial update if on dashboard
  if (document.querySelector(".dashboard").style.display !== "none") {
    updateResidentSummary();
  }
});
