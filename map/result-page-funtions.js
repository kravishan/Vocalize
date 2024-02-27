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

function checkReviews() {
    var review1 = document.getElementById("myRange").value;
    var userID = localStorage.getItem('stepperValue');

    // Check if the value is within the specified limits
    if (userID < 0 || userID > 99) {
        showToast('Please provide a value less than 100');
        return false; // Exit the function early if the value is out of bounds
    }

    // Check if any of the reviews are missing
    if (review1 === "0" ) {
        showToast('Please provide a rating for the question 1');
        return false;
    }

    return true;
}


// Modify the showToast function to display the error message with the icon
function showToast(message) {
    var toast = document.getElementById('toast-notification');
    var toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(function() {
        toast.classList.add('hidden');
    }, 2500); // Adjust the duration (in milliseconds) for how long the toast will be displayed
}


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
            window.location.href = './index.html';
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

        // Get the current date and time
        let currentDate = new Date();
        let currentDateTime = currentDate.toLocaleString();

        console.log('Saved Date and Time:', currentDateTime);

        // Function to generate star icons based on the rating
        // function getStarRating(rating) {
        //     const stars = '\u2605'; // Unicode character for a solid star
        //     return stars.repeat(parseInt(rating));
        // }

        document.getElementById('saveButton').addEventListener('click', saveToFirestore);

        // Function to save data to Firestore
        function saveToFirestore() {
            if (!checkReviews()) {
                return;
            }

            console.log('Inside saveToFirestore function');
            // Get the result data
            const resultData = {
                Transcribe_Text: whisperText,
                Overall_Rating: overallStarCount,
                Food_Rating: foodRating,
                Service_Rating: serviceRating,
                Atmosphere_Rating: atmosphereRating,
                Date_Time: currentDateTime,
                Feedback_Align: document.getElementById("myRange").value,
                User_Location: JSON.parse(storedCoordinates),
                Selected_Restaurant: JSON.parse(selectedRestaurantData)
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

                // Get the current time from the currentDateTime variable
                let currentTime = currentDate.toLocaleTimeString(); // Extracts the time portion from the current date


                console.log('docName:', restaurantName);
        
                // Save data with combined docName, restaurantName, and coordinates as the ID
                db.collection('Results Voice')
                    .doc(`${docName}_${restaurantName}_${currentTime}`)
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

            goToInitialStageWithDelay();
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
        // document.getElementById('dateandtimeOutput').innerHTML = `<strong>Generated Date and Time:</strong> ${generatedDateTime}`;

        // Function to generate star icons based on the rating
        function generateStarIcons(rating) {
            const stars = '\u2605'; // Unicode character for a solid star
            return stars.repeat(parseInt(rating));
        }

        // // Display ratings
        // document.getElementById('ratingStarsOutputText').innerHTML = `
        // <p class="category">Overall: <span class="star">${generateStarIcons(overallStarCount)}</span></p>
        // <p class="category">Food: <span class="star">${generateStarIcons(foodRating)}</span></p>
        // <p class="category">Service: <span class="star">${generateStarIcons(serviceRating)}</span></p>
        // <p class="category">Atmosphere: <span class="star">${generateStarIcons(atmosphereRating)}</span></p>
        // `;


    })
    .catch(error => {
        console.error('Error fetching Firebase configuration:', error);
        // Handle error as needed
    });



    /// Function to update the value label when the slider is moved
    function updateSliderValue() {
        var slider = document.getElementById("myRange");
        var output = document.getElementById("sliderValue");
        var alignmentLabels = ["1 - Not at all willing", "2 - Slightly willing", "3 - Moderately willing", 
                            "4 - Somewhat willing", "5 - Considerably willing", "6 - Very willing", "7 - Extremely willing"];
        
        // Update the output only if the slider has been moved
        if (slider.value !== "0") {
            output.innerHTML = alignmentLabels[slider.value - 1];
            localStorage.setItem("sliderValue", slider.value - 1); // Save the number 0 to 6 in localStorage
        } else {
            output.innerHTML = "Please select a value";
            localStorage.setItem("sliderValue", "0"); // Save 0 in localStorage when the slider is at 0 position
        }
    }

    // Function to retrieve the stepper value from localStorage
    function updateStepperValue(inputElement) {
        let value = parseInt(inputElement.value);

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








 


      