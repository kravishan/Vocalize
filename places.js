// places.js

// Replace 'YOUR_API_KEY_HERE' with your Google Places API key
const apiKey = 'AIzaSyB5Cmjq8we6WvcQBuhllozxOTNQeK3N2I8';

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

    // Load the Google Maps JavaScript API with async and defer attributes
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Set a global callback function to be called after the Google Maps JavaScript API is loaded
    window.initMap = function () {
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

    // Append the script tag to the document
    document.head.appendChild(script);
}

// Function to display a list of nearby restaurants
function displayNearbyRestaurants(restaurants) {
    // You can customize this function based on how you want to display the restaurant information on your page
    console.log('Nearby Restaurants:', restaurants);
}

// Example usage:
// Call the getCurrentLocation function to initiate the process
getCurrentLocation();
