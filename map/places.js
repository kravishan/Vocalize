// places.js (Client-side code)

// Fetch the Google Maps API script from your server
fetch('https://vocalizer.dev/server/google-maps-script')
  .then(response => response.text())
  .then(script => {
    // Execute the retrieved script
    eval(script);

    // Call the fetchAndDisplayNearbyRestaurants function when the page loads
    window.onload = function () {
      console.log("Page loaded. Fetching and displaying nearby restaurants.");
      fetchAndDisplayNearbyRestaurants();
    };
  })
  .catch(error => console.error('Error fetching Google Maps script:', error));

// Function to fetch user's location and display nearby restaurants
function fetchAndDisplayNearbyRestaurants() {
  // Check if the browser supports geolocation
  if (navigator.geolocation) {
    // Get the user's current location
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log("User's location:", userLocation.lat(), userLocation.lng());
        localStorage.setItem("userLocation", JSON.stringify(userLocation));

        // Create a PlacesService object to interact with the Places API
        const placesService = new google.maps.places.PlacesService(document.createElement("div"));

        // Define the request to fetch nearby restaurants
        const request = {
          location: userLocation,
          radius: 200,
          types: ["restaurant"],
        };

        // Fetch nearby restaurants and handle the response
        placesService.nearbySearch(request, handleResults);
      },
      function (error) {
        console.error("Error getting user's location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Function to calculate the distance between two sets of coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Function to convert degrees to radians
function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}


// Function to handle the results of the nearby search
function handleResults(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log("Restaurant results:", results);

    // Display the list of restaurants
    const restaurantList = document.getElementById("restaurant-list");

    for (const result of results) {
      const restaurantName = result.name;
      console.log("Restaurant Name:", restaurantName);

      // Create a list item for each restaurant
      const listItem = document.createElement("li");
      listItem.textContent = restaurantName;

      // Add a click event listener to each list item
      listItem.addEventListener("click", function () {
        // Save the entire result object to localStorage
        localStorage.setItem("selectedRestaurant", JSON.stringify(result));
        console.log("Selected:", result);
        showMicrophoneButton();
      });

      // Append the list item to the restaurant list
      restaurantList.appendChild(listItem);

      // Check if the user has not reviewed this restaurant yet
      const reviewedRestaurants = JSON.parse(localStorage.getItem("reviewedRestaurants")) || [];
      if (!reviewedRestaurants.includes(result.place_id)) {
        // Check proximity and trigger notifications
        const userLocation = JSON.parse(localStorage.getItem("userLocation"));
        if (userLocation) {
          const isInProximity = checkProximity(userLocation, result);
          if (isInProximity) {
            triggerNotification(result);
          }
        }
      }
    }
  } else {
    console.error("Error fetching restaurants:", status);
  }
}

// Function to check proximity
function checkProximity(userLocation, restaurant) {
  // Use your existing calculateDistance function
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    restaurant.geometry.location.lat(),
    restaurant.geometry.location.lng()
  );

  // Set a suitable proximity threshold (e.g., 5 meters)
  const proximityThreshold = 200;

  return distance < proximityThreshold;
}

// Function to trigger notifications
function triggerNotification(restaurant) {
  // Use the Notification API to display a notification
  if (Notification.permission === 'granted') {
    const notification = new Notification('Review Reminder', {
      body: `You're near ${restaurant.name}. Leave a review and help others.`,
      icon: 'favicon.ico',
    });

    notification.onclick = function () {
      // Handle notification click (e.g., open the app or the restaurant's page)
    };

    // Add the reviewed restaurant to the local storage to avoid repeated notifications
    const reviewedRestaurants = JSON.parse(localStorage.getItem("reviewedRestaurants")) || [];
    reviewedRestaurants.push(restaurant.place_id);
    localStorage.setItem("reviewedRestaurants", JSON.stringify(reviewedRestaurants));
  }
}

// Call the fetchAndDisplayNearbyRestaurants function when the page loads
window.onload = function () {
  console.log("Page loaded. Fetching and displaying nearby restaurants.");
  fetchAndDisplayNearbyRestaurants();
};
