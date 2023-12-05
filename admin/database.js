// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9GNhQGsnfy85gM9u_dJuOKWAZqPUdk44",
            authDomain: "vocalize-dc445.firebaseapp.com",
            projectId: "vocalize-dc445",
            storageBucket: "vocalize-dc445.appspot.com",
            messagingSenderId: "50867328520",
            appId: "1:50867328520:web:81681fc6f1baaae8b823bd"
};

console.log("Initializing Firebase...");

// Load Firebase scripts
const script1 = document.createElement('script');
script1.src = 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
script1.async = true;
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js';
script2.async = true;
script2.onload = initializeFirebase; // Call initializeFirebase when scripts are loaded
document.head.appendChild(script2);

function initializeFirebase() {
  if (typeof firebase === 'undefined') {
    console.error("Firebase is not defined. Make sure Firebase scripts are loaded.");
  } else {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    function fetchDataFromFirebase() {
      const tableBody = document.getElementById('table-body');
      const tableHead = document.getElementById('table-head');
      const totalRecordsCountElement = document.getElementById('total-records-count');
    
      const firebaseRef = database.ref('/results');
    
      firebaseRef.on('value', (snapshot) => {
        console.log("Firebase data received:", snapshot.val());
    
        // Log the total number of records
        const totalCount = snapshot.numChildren();
        console.log("Total Records Count:", totalCount);
    
        tableBody.innerHTML = '';
        tableHead.innerHTML = '';
    
        const firstData = snapshot.val() ? Object.keys(snapshot.val())[0] : {};
        const headings = Object.keys(firstData);
    
        console.log("Table headings:", headings);
    
        headings.forEach((heading) => {
          const th = document.createElement('th');
          th.className = 'px-4 py-3';
          th.textContent = heading;
          tableHead.appendChild(th);
        });
    
        totalRecordsCountElement.textContent = totalCount;
    
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const row = document.createElement('tr');
          row.className = 'text-gray-700 dark:text-gray-400';
    
          headings.forEach((heading) => {
            const td = document.createElement('td');
            td.className = 'px-4 py-3';
            td.textContent = data[heading];
            row.appendChild(td);
          });
    
          tableBody.appendChild(row);
        });
      });
    }

    window.addEventListener('load', () => {
      console.log("Window loaded. Fetching data from Firebase...");
      fetchDataFromFirebase();
    });
  }
}
