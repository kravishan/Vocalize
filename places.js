// places.js

let map; // Declare map globally

// Replace 'YOUR_API_KEY_HERE' with your Google Places API key
const googleApiKey = 'AIzaSyB5Cmjq8we6WvcQBuhllozxOTNQeK3N2I8';

// Function to initialize the map
function initMap() {
    // Your map initialization code here
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

    // Call the function to fetch nearby restaurants
    getCurrentLocation();
}

// Function to fetch nearby restaurants using Google Places API
async function fetchNearbyRestaurants(location) {
    const radius = 5000; // 5000 meters (5 km) radius
    const type = 'restaurant';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${googleApiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Process the data and display a list of nearby restaurants
        displayNearbyRestaurants(data.results);
    } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
    }
}

// Function to display a list of nearby restaurants
function displayNearbyRestaurants(restaurants) {
    const restaurantList = document.getElementById('restaurantList');

    // Clear existing list
    restaurantList.innerHTML = '';

    // Iterate through the restaurants and add them to the list
    restaurants.forEach(restaurant => {
        const listItem = document.createElement('li');
        listItem.textContent = restaurant.name;
        restaurantList.appendChild(listItem);
    });
}

// Function to get the current location
function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const location = `${position.coords.latitude},${position.coords.longitude}`;
            fetchNearbyRestaurants(location);
        },
        error => console.error('Error getting location:', error)
    );
}
