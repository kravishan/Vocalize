import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// Function to initialize Firebase with configuration fetched from the server
async function initializeFirebase() {
  try {
    // Fetch Firebase configuration from the server
    const response = await fetch('https://vocalizer.dev/server/firebase-config');
    const firebaseConfig = await response.json();

    // Initialize Firebase with the received configuration
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const resultsCollection = collection(db, 'results');

    // Return the Firestore collection
    return resultsCollection;
  } catch (error) {
    console.error('Error fetching Firebase configuration:', error);
    // Handle error as needed
    return null;
  }
}

// Function to redirect to details page with document ID
function redirectToDetailsPage(documentId) {
  window.location.href = `details.html?id=${documentId}`;
}

async function fetchDataFromFirestore() {
  const tableBody = document.getElementById('table-body');
  const totalRecordsCount = document.getElementById('total-records-count');

  // Clear previous data
  tableBody.innerHTML = '';

  try {
    // Initialize Firebase and get the Firestore collection
    const resultsCollection = await initializeFirebase();

    if (resultsCollection) {
      // Fetch data from Firestore
      const querySnapshot = await getDocs(resultsCollection);

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
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch and display data when the page loads
window.addEventListener('load', () => {
  console.log("Window loaded. Fetching data from Firestore...");
  fetchDataFromFirestore();
});
