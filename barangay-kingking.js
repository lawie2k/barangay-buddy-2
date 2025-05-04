// Import necessary Firebase and EmailJS functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

// The barangay name you're working with
const barangay = "KingKing";

document.addEventListener("DOMContentLoaded", async () => {
  const submissionContainers = document.querySelectorAll(".submissions");

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
        Purpose: ${data.purpose}<br>
        Email: ${data.email}<br>
        Submitted on: ${new Date(
          data.timestamp.seconds * 1000
        ).toLocaleString()}
        <button class="accept-btn" data-email="${data.email}" data-name="${
        data.firstName
      }">Send Email</button>
        <span class="accepted-msg" style="display:none; color: green; font-weight: bold;">✔ Email Sent</span>
      `;

      // Append the new div element to all submission containers
      submissionContainers.forEach((container) => {
        container.appendChild(div.cloneNode(true));
      });
    });

    // Now that the elements are added to the DOM, attach the event listeners
    const acceptButtons = document.querySelectorAll(".accept-btn");

    acceptButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const email = btn.getAttribute("data-email");
        const name = btn.getAttribute("data-name");

        // Debugging: Let's log the email and name to see if they're being passed correctly
        console.log(`Email: ${email}, Name: ${name}`);

        // Send email when the admin clicks the button
        sendEmail(email, name);
        btn.disabled = true;
        btn.textContent = "Email Sent"; // Mark as sent
        btn.nextElementSibling.style.display = "inline"; // Show the "sent" message
      });
    });
  } catch (error) {
    console.error("Error loading submissions:", error);
    submissionContainers.forEach((container) => {
      container.innerHTML = "<p>Failed to load submissions.</p>";
    });
  }
});

// Function to send email to the user

// Log the email to ensure it's not empty
function sendEmail(email, name) {
  console.log(`Sending email to: ${email}`);

  if (!email || email.trim() === "") {
    alert("Failed to send email: Email address is missing.");
    return;
  }

  // Send email using EmailJS with the template
  emailjs
    .send("service_qhp2e0j", "template_kdtwkdr", {
      to_email: email, // Recipient's email
      to_name: name, // Recipient's name (for the template)
    })
    .then((response) => {
      console.log("Email sent successfully:", response); // Log response if successful
      alert(`Email sent to ${email}`);
    })
    .catch((error) => {
      console.error("Email failed to send:", error); // Log the error details
      alert(`Failed to send email: ${JSON.stringify(error)}`);
    });
}

/*--------------------------sidebar and content display-----------------------------------*/
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
      if (targetClass === "dashboard") {
        targetSection.style.display = "flex";
      } else {
        targetSection.style.display = "block";
      }
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
