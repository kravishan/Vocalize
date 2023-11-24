// Import necessary modules
const express = require('express');
const app = express();

// Define your Google Maps API key
const googleMapsApiKey = 'AIzaSyAsSEtd2cKGE9m9StqSl-epk8HbToAA1NM';

// Middleware to handle CORS (Cross-Origin Resource Sharing) - adjust as needed
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Endpoint to serve the Google Maps API script
app.get('/google-maps-script', (req, res) => {
  const script = `
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places';
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    document.head.appendChild(googleMapsScript);
  `;
  res.send(script);
});

// Your existing endpoint for fetching and forwarding data to Google Maps API
app.post('/google-maps-endpoint', async (req, res) => {
  // Your existing logic to fetch and forward data to Google Maps API
  // ...
});

// Start the server
const port = 3000; // Choose a port for your server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
