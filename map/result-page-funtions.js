// Get the element with the class "font-22"
const font22Element = document.querySelector('.font-22');

// Add an event listener for the scroll event
window.addEventListener('scroll', function() {
    // Check if font22Element is not null before accessing its style property
    if (font22Element) {
        // Check the scroll position (adjust the value as needed)
        if (window.scrollY > 90) {
            // If scroll position is greater than 50, add a class to hide the element
            font22Element.style.display = 'none';
        } else {
            // Otherwise, remove the class to show the element
            font22Element.style.display = 'block';
        }
    }
});


// Fetch Firebase configuration from the server
fetch('https://vocalizer.dev/server/firebase-config')
    .then(response => response.json())
    .then(firebaseConfig => {
        // Initialize Firebase with the received configuration
        firebase.initializeApp(firebaseConfig);

        // Get a reference to the Firestore database
        const db = firebase.firestore();

        // Function to navigate back to the previous page
        function goToInitialStage() {
            window.location.href = '/index.html';
        }

        // Add an event listener to the back button
        document.querySelector('.back-button').addEventListener('click', goToInitialStage);

        // Get parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        // const userLocationString = urlParams.get('userLocation');
        // const userLocation = JSON.parse(decodeURIComponent(userLocationString));
        const whisperText = urlParams.get('whisperText');
        const overallStarCount = urlParams.get('overallStarCount');
        const foodRating = urlParams.get('foodRating');
        const serviceRating = urlParams.get('serviceRating');
        const atmosphereRating = urlParams.get('atmosphereRating');
        const selectedRestaurantData = localStorage.getItem("selectedRestaurant");

        // Retrieve user coordinates from localStorage
        const storedCoordinates = localStorage.getItem('userCoordinates');

        console.log("Stored Coordinates:", storedCoordinates);

        console.log("Overall Star Count:", overallStarCount);
        console.log("Food Rating:", foodRating);
        console.log("Service Rating:", serviceRating);
        console.log("Atmosphere Rating:", atmosphereRating);

        // Get or set the generated date and time
        let generatedDateTime = localStorage.getItem('generatedDateTime');

        if (!generatedDateTime) {
            generatedDateTime = new Date().toLocaleString();
            localStorage.setItem('generatedDateTime', generatedDateTime);
        }

        // Function to generate star icons based on the rating
        // function getStarRating(rating) {
        //     const stars = '\u2605'; // Unicode character for a solid star
        //     return stars.repeat(parseInt(rating));
        // }

        document.getElementById('saveButton').addEventListener('click', saveToFirestore);

        // Function to save data to Firestore
        function saveToFirestore() {
            console.log('Inside saveToFirestore function');
            // Get the result data
            const resultData = {
                whisperText: whisperText,
                overallStarCount: overallStarCount,
                foodRating: foodRating,
                serviceRating: serviceRating,
                atmosphereRating: atmosphereRating,
                generatedDateTime: generatedDateTime,
                sliderValue: document.getElementById("myRange").value,
                userLocation: JSON.parse(storedCoordinates),
                selectedRestaurant: JSON.parse(selectedRestaurantData)
            };

            // Retrieve the stepperValue from localStorage
            const stepperValue = parseInt(localStorage.getItem('stepperValue'));

            if (stepperValue > 0) {
                // Use stepperValue as the document name
                const docName = stepperValue.toString();
        
                // Extract the restaurant name and coordinates from selectedRestaurant
                const selectedRestaurant = JSON.parse(localStorage.getItem("selectedRestaurant"));

                // Accessing the "name" field using bracket notation
                const restaurantName = selectedRestaurant['name'];


                console.log('docName:', restaurantName);
        
                // Save data with combined docName, restaurantName, and coordinates as the ID
                db.collection('Results Voice')
                    .doc(`${docName}_${restaurantName}`)
                    .set(resultData)
                    .then(() => {
                        console.log('Document written with ID:', docName);
                        document.cookie = `stepperValue=${stepperValue}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
                        showSuccessMessage();
                        
                    })
                    .catch((error) => {
                        console.error('Error adding document:', error);
                        showFailedMessage();                       
                    });
            } else {
                // Save data with a generated ID
                db.collection('Results Voice')
                    .add(resultData)
                    .then((docRef) => {
                        console.log('Document written with ID:', docRef.id);
                        document.cookie = `stepperValue=${stepperValue}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
                        showSuccessMessage();
                        
                    })
                    .catch((error) => {
                        console.error('Error adding document:', error);
                        showFailedMessage();
                    });
            }
        }

        // Function to show success message
        function showSuccessMessage() {
            const successMsg = document.getElementById('success-msg');
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 3000);

            // goToInitialStageWithDelay();
        }

        // Function to show failure message
        function showFailedMessage() {
            const failedMsg = document.getElementById('failed-msg');
            failedMsg.style.display = 'block';
            setTimeout(() => {
                failedMsg.style.display = 'none';
            }, 3000);
        }

        // Function to navigate back to the previous page and reset data
        function goToInitialStageWithDelay() {
            // Clear local storage
            localStorage.clear();

            // Redirect to the initial stage after 3000 milliseconds (3 seconds)
            setTimeout(() => {
                window.location.href = './index.html';
            }, 3000);
        }

        // Display the data on the page
        document.getElementById('voiceReviewText').innerHTML = `${whisperText}`;
        document.getElementById('dateandtimeOutput').innerHTML = `<strong>Generated Date and Time:</strong> ${generatedDateTime}`;

        // Function to generate star icons based on the rating
        function generateStarIcons(rating) {
            const stars = '\u2605'; // Unicode character for a solid star
            return stars.repeat(parseInt(rating));
        }

        // Display ratings
        document.getElementById('ratingStarsOutputText').innerHTML = `
        <p>Overall: ${generateStarIcons(overallStarCount)}</p>
        <p>Food: ${generateStarIcons(foodRating)}</p>
        <p>Service: ${generateStarIcons(serviceRating)}</p>
        <p>Atmosphere: ${generateStarIcons(atmosphereRating)}</p>
        `;


    })
    .catch(error => {
        console.error('Error fetching Firebase configuration:', error);
        // Handle error as needed
    });



    // Function to update the value label when the slider is moved
    function updateSliderValue() {
        var slider = document.getElementById("myRange");
        var output = document.getElementById("sliderValue");
        // output.innerHTML = slider.value;

        // Update the output only if the slider has been moved
        if (slider.value !== "0") {
            output.innerHTML = slider.value;
        }

        // Store the slider value in localStorage
        localStorage.setItem("sliderValue", slider.value);
    }

    // Function to retrieve the stepper value from localStorage
    function updateStepperValue(inputElement) {
        let value = parseInt(inputElement.value);

        // Ensure the value stays within the min and max limits
        value = Math.min(99, Math.max(0, value));

        // Update the input value
        inputElement.value = value;

        // Store the updated value in localStorage
        localStorage.setItem('stepperValue', value.toString());
    }


    // Function to read a specific cookie value by name
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if the cookie starts with the specified name
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }

    // Function to set stepper value from cookies to UI and call updateStepperValue
    function setStepperValueFromCookies() {
        const stepperValueCookie = getCookie('stepperValue');
        if (stepperValueCookie !== null) {
            const stepperInputElement = document.querySelector('.ios-stepper input[type="number"]');
            if (stepperInputElement) {
                stepperInputElement.value = stepperValueCookie;
                // Call updateStepperValue function with the retrieved value
                updateStepperValue(stepperInputElement);
            }
        }
    }

    // Call this function when the page is loaded
    window.addEventListener('load', setStepperValueFromCookies);








 


      