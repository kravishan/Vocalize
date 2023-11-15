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
    const marker = new google.maps.Marker({
      position: currentLocation,
      map: map,
      title: 'Your Location',
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
    results.forEach((place) => {
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
      });
  
      // You can add additional information to the marker's info window if needed
      const infowindow = new google.maps.InfoWindow({
        content: `<strong>${place.name}</strong><br>${place.vicinity}`,
      });
  
      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });
    });
  }

  // Function to display search results on the map
function displayResultsOnMap(map, results) {
    const descriptionContainer = document.getElementById('restaurant-description');
  
    results.forEach((place) => {
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
      });
  
      // You can add additional information to the marker's info window if needed
      const infowindow = new google.maps.InfoWindow({
        content: `<strong>${place.name}</strong><br>${place.vicinity}`,
      });
  
      marker.addListener('click', () => {
        // Display restaurant description in the designated HTML element
        descriptionContainer.innerHTML = `<strong>${place.name}</strong><br>${place.vicinity}`;
        
        // Open the info window
        infowindow.open(map, marker);
      });
    });
  }
  
  