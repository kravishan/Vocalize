import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9GNhQGsnfy85gM9u_dJuOKWAZqPUdk44",
  authDomain: "vocalize-dc445.firebaseapp.com",
  projectId: "vocalize-dc445",
  storageBucket: "vocalize-dc445.appspot.com",
  messagingSenderId: "50867328520",
  appId: "1:50867328520:web:20eb0824d6b727b8b823bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = getFirestore(app);

// Reference to your Firestore collection
const resultsCollection = collection(db, 'results');

// Function to redirect to details page with document ID
function redirectToDetailsPage(documentId) {
  window.location.href = `details.html?id=${documentId}`;
}

function fetchDataFromFirestore() {
  const tableBody = document.getElementById('table-body');
  const totalRecordsCount = document.getElementById('total-records-count');

  // Clear previous data
  tableBody.innerHTML = '';

  // Fetch data from Firestore
  getDocs(resultsCollection).then((querySnapshot) => {
    // Update total records count
    totalRecordsCount.textContent = querySnapshot.size;

    let incrementingNumber = 1;

    querySnapshot.forEach((doc) => {
      // Create a table row and append it to the table body
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-3 atmosphereRating">${incrementingNumber}</td>
        <td class="px-4 py-3 atmosphereRating">${doc.id}</td>
        <td class="px-4 py-3 atmosphereRating">
          <button class="bg-blue-500 text-white px-4 py-2 rounded" data-doc-id="${doc.id}">More Info</button>
        </td>
      `;
      tableBody.appendChild(row);

      // Add click event listener to the button
      const button = row.querySelector('button');
      button.addEventListener('click', () => {
        const documentId = button.getAttribute('data-doc-id');
        redirectToDetailsPage(documentId);
      });

      incrementingNumber++;
    });
  }).catch((error) => {
    console.error("Error fetching data:", error);
  });
}

// Fetch and display data when the page loads
window.addEventListener('load', () => {
  console.log("Window loaded. Fetching data from Firestore...");
  fetchDataFromFirestore();
});
