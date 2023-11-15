// places.js

// Replace 'YOUR_API_KEY_HERE' with your Google Places API key
const googleapiKey = '';

// Function to get the user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Call the function to fetch nearby restaurants with the obtained location
                fetchNearbyRestaurants(location);
            },
            (error) => {
                console.error('Error getting current location:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Function to fetch nearby restaurants using Google Places API
async function fetchNearbyRestaurants(location) {
    const radius = 5000; // 5000 meters (5 km) radius
    const type = 'restaurant';

    // Dynamically create a script element to load the Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleapiKey}&libraries=places&callback=initMap`;

    // Append the script element to the document body
    document.body.appendChild(script);

    // Callback function to be called after the Google Maps JavaScript API is loaded
    window.initMap = function () {
        // Now you can use the Google Maps API safely
        const service = new google.maps.places.PlacesService(map);
        const request = {
            location: location,
            radius: radius,
            type: type,
        };

        service.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Process the data (e.g., display a list of nearby restaurants)
                displayNearbyRestaurants(results);
            } else {
                console.error('Error fetching nearby restaurants:', status);
            }
        });
    };
}

// Function to display a list of nearby restaurants
function displayNearbyRestaurants(restaurants) {
    // Get the HTML element where you want to display the list
    const restaurantList = document.getElementById('restaurantList');

    // Clear previous content
    restaurantList.innerHTML = '';

    // Iterate through the restaurants and create list items
    restaurants.forEach((restaurant) => {
        const listItem = document.createElement('li');
        listItem.textContent = restaurant.name;
        restaurantList.appendChild(listItem);
    });
}

// Example usage:
// Call the getCurrentLocation function to initiate the process
getCurrentLocation();
