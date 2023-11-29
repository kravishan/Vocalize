// places.js (Client-side code)

// Fetch the Google Maps API script from your server
fetch('/google-maps-script')
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
    }
  } else {
    console.error("Error fetching restaurants:", status);
  }
}

// Call the fetchAndDisplayNearbyRestaurants function when the page loads
window.onload = function () {
  console.log("Page loaded. Fetching and displaying nearby restaurants.");
  fetchAndDisplayNearbyRestaurants();
};




 
