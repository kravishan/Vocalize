// Add this at the beginning of your script.js file
function initMap() {
    // Create a map centered at a default location (e.g., your city)
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 37.7749, lng: -122.4194 }, // Example: San Francisco, CA
      zoom: 12, // Adjust the zoom level as needed
    });
  
    // Add a marker for the default location
    const marker = new google.maps.Marker({
      position: { lat: 37.7749, lng: -122.4194 }, // Example: San Francisco, CA
      map: map,
      title: 'Default Location',
    });
  
    // Uncomment the following line if you want to get the user's current location
    // getUserLocation(map);
  }
  
  // Function to get the user's current location
  function getUserLocation(map) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          // Center the map on the user's location
          map.setCenter(userLocation);
  
          // Add a marker for the user's location
          const userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'Your Location',
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  