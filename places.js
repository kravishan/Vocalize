// Initialize Google Maps
function initMap() {
    // Check if geolocation is supported
    if (navigator.geolocation) {
      // Get current location
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  
  // Callback function on successful geolocation
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
  
    // Create a LatLng object for the current location
    const currentLocation = new google.maps.LatLng(latitude, longitude);
  
    // Create a map centered at the current location
    const map = new google.maps.Map(document.getElementById('map'), {
      center: currentLocation,
      zoom: 15,  // You can adjust the zoom level as needed
    });
  
    // Add a marker for the current location
    const currentLocationMarker = new google.maps.Marker({
      position: currentLocation,
      map: map,
      title: 'Your Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Customize the marker icon
    });
  
    // Call the function to search for nearby restaurants and display them on the map
    searchNearbyRestaurants(map, currentLocation);
  }
  
  // Callback function on geolocation error
  function error() {
    console.error('Unable to retrieve your location.');
  }
  
  // Function to search for nearby restaurants using Places API
  function searchNearbyRestaurants(map, location) {
    const placesService = new google.maps.places.PlacesService(map);
  
    // Define search parameters
    const request = {
      location: location,
      radius: 500,  // You can adjust the radius as needed
      type: 'restaurant',  // Change the type as needed
    };
  
    // Perform the Places API search
    placesService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Display the results on the map
        displayResultsOnMap(map, results);
      } else {
        console.error('Places API search failed with status:', status);
      }
    });
  }
  
  // Function to display search results on the map
function displayResultsOnMap(map, results) {
    const infowindows = []; // Array to store info windows
  
    results.forEach((place) => {
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
      });
  
      // Create an info window with restaurant name and address
      const infowindow = new google.maps.InfoWindow({
        content: `<strong>${place.name}</strong><br>${place.vicinity}`,
      });
  
      marker.addListener('click', () => {
        // Close any open info windows
        closeInfoWindows(infowindows);
        // Open the current marker's info window
        infowindow.open(map, marker);
      });
  
      infowindows.push(infowindow); // Add infowindow to the array
    });
  }
  
  // Function to close all info windows
  function closeInfoWindows(infowindows) {
    infowindows.forEach((infowindow) => {
      infowindow.close();
    });
  }
  