// Get the element with the class "font-22"
const font22Element = document.querySelector('.font-22');
let userActions = []; // Declare userActions outside the event listeners

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
    var review2 = document.getElementById("myRangeExp").value;
    var review4 = document.getElementById("myRangeAgen").value;
    var userID = localStorage.getItem('stepperValue');

    // Check if the value is within the specified limits
    if (userID < 0 || userID > 99) {
        showToast('Please provide a value less than 100');
        return false; // Exit the function early if the value is out of bounds
    }

    // Check if question 3 needs to be answered
    if (userActions.includes('askedHelp') && lastSelectedOption == '') {
        showToast('Please provide an answer for question 3');
        return false;
    }

    // Check if question 4 needs to be answered
    if (userActions.includes('refine') && review4 == '0') {
        showToast('Please provide a rating for the question 4');
        return false;
    }

    // Check if any of the reviews are missing
    if (review1 === "0" ) {
        showToast('Please provide a rating for the question 1');
        return false;
    }

    if (review2 === "0") {
        showToast('Please provide a rating for the question 2');
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
        const userLocationString = urlParams.get('userLocation');
        const userLocation = JSON.parse(decodeURIComponent(userLocationString));
        const whisperText = urlParams.get('whisperText');
        const overallStarCount = urlParams.get('overallStarCount');
        const foodRating = urlParams.get('foodRating');
        const serviceRating = urlParams.get('serviceRating');
        const atmosphereRating = urlParams.get('atmosphereRating');
        // const improvedReview = localStorage.getItem('improvedReview');
        const improvedReviewWithStars = urlParams.get('improvedReviewWithStars');
        const selectedRestaurantData = localStorage.getItem("selectedRestaurant");



        // Get the current date and time
        let currentDate = new Date();
        let currentDateTime = currentDate.toLocaleString();

        console.log('Saved Date and Time:', currentDateTime);


        
        // Function to generate star icons based on the rating
        // function getStarRating(rating) {
        //     const stars = '\u2605'; // Unicode character for a solid star
        //     return stars.repeat(parseInt(rating));
        // }

        originalReview = decodeURIComponent(improvedReviewWithStars);

        // Array to store all versions of improvedReviewWithStars
        let improvedReviewVersions = [originalReview];
        // Initialize editCounter
        let editCounter = 0;

        // Event listener for the edit button
        document.getElementById('edit-button-review').addEventListener('click', toggleEditMode);

        // Function to toggle between view mode and edit mode
        function toggleEditMode() {
            const paragraph = document.getElementById('improvedReviewWithStarsText');
            const editButton = document.getElementById('edit-button-review');

            if (paragraph && editButton) {
                if (paragraph.tagName === 'TEXTAREA') {
                    // If already in edit mode, revert to the original paragraph
                    paragraph.outerHTML = `<p id="improvedReviewWithStarsText" class="edite-boxp boxp">${paragraph.value}</p>`;
                    editButton.innerHTML = '<i class="fa fa-edit"></i>';
                    editCounter++;
                    console.log(editCounter);

                    // Add 'edited' to userActions array
                    userActions.push('edited');
                } else {
                    // If not in edit mode, convert to a textarea
                    const textContent = paragraph.textContent.trim();
                    paragraph.outerHTML = `<textarea id="improvedReviewWithStarsText" class="edite-boxp" rows="15">${textContent}</textarea>`;
                    editButton.innerHTML = '<i class="fa fa-save"></i>';
                }

                // Only add the edited text to the array if it's different from the original text
                if (editCounter > 0 && paragraph.value && paragraph.value.trim() !== originalReview) {
                    improvedReviewVersions.push(paragraph.value.trim() || originalReview);
                }
            } else {
                console.error('Error: Unable to find necessary elements.');
            }
        }


        document.getElementById('saveButton').addEventListener('click', saveToFirestore);


        

        // Function to save data to Firestore
        function saveToFirestore() {
            if (!checkReviews()) {
                return;
            }

            // Get the refined data from local storage
            // Retrieve the data from local storage and parse it back into a JavaScript object
            const userRefineDataUpdatesData = localStorage.getItem('refinedataset');

            const userHelpDataTips = localStorage.getItem('helpTip');
            const userHelpDataActions = localStorage.getItem('helpSeekHelp');
            const userHelpDataSelectedOption = localStorage.getItem('helpSelectedOption');

            const helpData = {
                Tips: userHelpDataTips,
                Asked_Help: userHelpDataActions,
                Reaction: userHelpDataSelectedOption
            };

            const helpDataJson = JSON.stringify(helpData);


            





            console.log('Inside saveToFirestore function');
            // Get the result data
            const resultData = {
                Transcribe_Text: whisperText,
                Overall_Rating: overallStarCount,
                Food_Rating: foodRating,
                Service_Rating: serviceRating,
                Atmosphere_Rating: atmosphereRating,
                // improvedReview: improvedReview,
                Improved_Review: improvedReviewVersions,
                Date_Time: currentDateTime,
                Feedback_Align: document.getElementById("myRange").value,
                User_Location: userLocation,
                Selected_Restaurant: JSON.parse(selectedRestaurantData),
                Review_Expectation: document.getElementById("myRangeExp").value,
                AGENT_Expectation: document.getElementById("myRangeAgen").value,
                AI_Agent_Data: JSON.parse(userRefineDataUpdatesData),
                Help_Data: JSON.parse(helpDataJson),
                User_Actions: userActions
                
              
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
                db.collection('Results LLM')
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
                db.collection('Results LLM')
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

        // Function to navigate back to the previous page and reset data
        function goToInitialStageWithDelay() {
            // Clear local storage
            localStorage.clear();

            // Redirect to the initial stage after 3000 milliseconds (3 seconds)
            setTimeout(() => {
                window.location.href = './index.html';
            }, 3000);
        }



        // Function to show failure message
        function showFailedMessage() {
            const failedMsg = document.getElementById('failed-msg');
            failedMsg.style.display = 'block';
            setTimeout(() => {
                failedMsg.style.display = 'none';
            }, 3000);
        }

        // Display the data on the page
        document.getElementById('voiceReviewText').innerHTML = `${whisperText}`;
        document.getElementById('improvedReviewWithStarsText').innerHTML = `${decodeURIComponent(improvedReviewWithStars)}`;
        // document.getElementById('dateandtimeOutput').innerHTML = `<strong>Generated Date and Time:</strong> ${generatedDateTime}`;

        
    })
    .catch(error => {
        console.error('Error fetching Firebase configuration:', error);
        // Handle error as needed
    });



    // Function to update the value label when the slider is moved
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


    // Function to update the value label when the slider is moved
    function updateSliderValueExp() {
        var slider = document.getElementById("myRangeExp");
        var output = document.getElementById("sliderValueExp");
        var satisfactionLabels = ["1 - Not at all satisfied", "2 - Slightly satisfied", "3 - Moderately satisfied", 
                            "4 - Somewhat satisfied", "5 - Satisfied", "6 - Highly satisfied", "7 - Completely satisfied"];
        
        // Update the output only if the slider has been moved
        if (slider.value !== "0") {
            output.innerHTML = satisfactionLabels[slider.value - 1];
            localStorage.setItem("sliderValueExp", slider.value - 1); // Save the number 0 to 6 in localStorage
        } else {
            output.innerHTML = "Please select a value";
            localStorage.setItem("sliderValueExp", "0"); // Save 0 in localStorage when the slider is at 0 position
        }
    }


    // Function to update the value label when the slider is moved
    function updateSliderValueAgen() {
        var slider = document.getElementById("myRangeAgen");
        var output = document.getElementById("sliderValueAgen");
        var expectationLabels = ["1 - Not at all useful", "2 - Slightly useful", "3 - Moderately useful", 
                            "4 - Somewhat useful", "5 - Very useful", "6 - Highly useful", "7 - Extremely useful"];
        
        // Update the output only if the slider has been moved
        if (slider.value !== "0") {
            output.innerHTML = expectationLabels[slider.value - 1];
            localStorage.setItem("sliderValueAgen", slider.value - 1); // Save the number 0 to 6 in localStorage
        } else {
            output.innerHTML = "Please select a value";
            localStorage.setItem("sliderValueAgen", "0"); // Save 0 in localStorage when the slider is at 0 position
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

    // // Get all radio buttons
    // const radioButtons = document.querySelectorAll('input[name="expectations"]');

    // // Add click event listener to each radio button
    // radioButtons.forEach(function (radioButton) {
    //     radioButton.addEventListener('click', function () {
    //     // Get the selected value
    //     const selectedValue = this.value;

    //     // Save the selected value to Local Storage
    //     localStorage.setItem('selectedExpectation', selectedValue);
    //     });
    // });

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


document.addEventListener('DOMContentLoaded', function () {
    let isResetButtonTextUpdated = false;

    // Add an event listener to the form submit button
    document.getElementById('refineReviewForm').addEventListener('submit', function (event) {
        
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the generated text from the improvedReviewWithStarsText
        const generatedText = document.getElementById('improvedReviewWithStarsText').innerText;
        
        // Check if ResetButtonText has been updated
        if (!isResetButtonTextUpdated) {
            ResetButtonText = generatedText;
            isResetButtonTextUpdated = true;
        }
        
        // Get the instructions from the reviewRefineInput
        const refineInstructions = document.getElementById('reviewRefineInput').value;

        // Check if both the generated text and instructions are not empty
        if (generatedText.trim() !== '' && refineInstructions.trim() !== '') {
            // Send the data to the backend for processing using an API request
            sendToBackendToRefine(generatedText, refineInstructions);

            // Add 'reset' to userActions array
            userActions.push('refine');

            document.getElementById('resetButtonText').style.display = 'block';

            document.getElementById('agent-before-text').style.display = 'block';
            document.getElementById('agent-before-slider').style.display = 'block';

            document.getElementById('reset-button-review').style.display = 'block';

            document.getElementById('edit-button-review').style.display = 'none';

            // Replace improvedReviewWithStarsText with refinedReview
            document.getElementById('improvedReviewWithStarsText').style.color = 'transparent';

            // Show the loading animation
            document.getElementById('loadingAnimation').style.display = 'block';

            // Clear the refine instructions input
            document.getElementById('reviewRefineInput').value = '';
        } else {
            // Display an error message if either the generated text or instructions are empty
            showToast('Please provide your instructions to AI AGENT');
            // alert('Please provide your instructions');
        }
    });

    // Add an event listener to the reset button
    document.getElementById('reset-button-review').addEventListener('click', function () {
        // Set the generated text as the content of improvedReviewWithStarsText
        document.getElementById('improvedReviewWithStarsText').innerText = ResetButtonText;

        // Add 'reset' to userActions array
        userActions.push('reset');
    });
});

// Function to send data to the backend for processing
function sendToBackendToRefine(generatedText, refineInstructions) {
    // Here you would make an API request to your backend
    // You can use fetch or any other AJAX library to send the data
    // Example using fetch:
    fetch('https://vocalizer.dev/server/refine-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            generatedText: generatedText,
            refineInstructions: refineInstructions,
        }),
    })
    .then(response => {
        if (response.ok) {
            // Data successfully sent to the backend
            return response.json(); // Parse the response body as JSON
        } else {
            // Handle errors if any
            throw new Error('Failed to send data to the backend.');
        }
    })
    .then(data => {
        // Save the response data along with generatedText and refineInstructions
        saveDataToLocalStorage({
            generatedText: generatedText,
            refineInstructions: refineInstructions,
            apiResponse: data
        });  
        
        // Display the refined review in the console
        console.log('Refined Review:', data.refinedReview);

        // Replace improvedReviewWithStarsText with refinedReview
        document.getElementById('improvedReviewWithStarsText').innerText = data.refinedReview;

        // hide the loading animation
        document.getElementById('loadingAnimation').style.display = 'none';

        document.getElementById('edit-button-review').style.display = 'block';

        document.getElementById('improvedReviewWithStarsText').style.color = '';
    })
    .catch(error => {
        console.error('Error:', error);
        // Display an error message to the user
        alert('An error occurred while sending data to the backend.');
    });
}

// Function to save data as a JSON object to local storage
function saveDataToLocalStorage(data) {
    // Retrieve existing data from local storage or initialize an empty array
    let existingData = localStorage.getItem('refinedataset');
    let jsonDataArray = existingData ? JSON.parse(existingData) : [];

    // Ensure jsonDataArray is an array
    if (!Array.isArray(jsonDataArray)) {
        jsonDataArray = [];
    }

    // Combine the new data with existing data
    const newData = {
        Original_Review: data.generatedText,
        User_Instructions: data.refineInstructions,
        // AI_Agent: data.apiResponse,
        CleanUP_Review: data.apiResponse.refinedReview,
    };

    // Push the new data into the array
    jsonDataArray.push(newData);

    // Save the array to local storage
    localStorage.setItem('refinedataset', JSON.stringify(jsonDataArray));

    console.log('Data saved to local storage:', localStorage.getItem('refinedataset'));
}






////////////////////////////////////////////////////////////////////////////////////////////////////////




document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const reviewText = urlParams.get('improvedReviewWithStars');
    

    // Send the improved review text to the backend
    fetch('https://vocalizer.dev/server/analyze-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewText: reviewText }),
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('text-loadingbar-tips').style.display = 'none';
            return response.json(); // Parse the response body as JSON
        } else {
            throw new Error('Failed to send data to the backend.');
        }
    })
    .then(data => {
        // Once you receive the tips from the backend, update the HTML to display them
        const tips = data.tips; // Assuming the response contains a field named 'tips'
        document.getElementById('improveTipsText').innerText = tips; // Update the HTML element with the tips

        // Save the tips to local storage
        localStorage.setItem('helpTip', tips);

        
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors if any
    });
});


// Define a variable to track whether the user needs help
let userNeedHelp = false;

// Get the button element
const helpButton = document.getElementById('helpButton');

// Add a click event listener to the button
helpButton.addEventListener('click', function() {
    // Toggle the userNeedHelp variable
    userNeedHelp = !userNeedHelp;

    // Get the elements with the specified classes
    // const mainItem = document.querySelector('.main-item');
    const cardStyleTips = document.querySelector('.card-style-tips');

    // Check if userNeedHelp is true
    if (userNeedHelp) {
        // Set the display property of the elements to flex
        // mainItem.style.display = 'flex';
        cardStyleTips.style.display = 'flex';
        helpButton.style.display = 'none';
        document.getElementById('thumbs-hide-txt').style.display = 'block';
        document.getElementById('thumbs-hide-left').style.display = 'block';
        document.getElementById('thumbs-hide-right').style.display = 'block';

        // Add 'seekHelp' to userActions array
        userActions.push('askedHelp');

        localStorage.setItem('helpSeekHelp', "Asked");

        
    } else {
        // Set the display property of the elements to none
        // mainItem.style.display = 'none';
        cardStyleTips.style.display = 'none';

        localStorage.setItem('helpSeekHelp', "Not_Asked");
    }
});


// Get the thumbs-up and thumbs-down icons
const thumbsUpIcon = document.getElementById('thumbsUpEditIcon');
const thumbsDownIcon = document.getElementById('thumbsDownEditIcon');

// Variable to keep track of the last selected option
let lastSelectedOption = ''; // Initialize as empty

// Add click event listeners to the icons
thumbsUpIcon.addEventListener('click', function() {
    // Change the color of the thumbs-up icon to green
    thumbsUpIcon.style.color = '#28a745';

    // Revert the color of the thumbs-down icon to its initial state
    thumbsDownIcon.style.color = ''; // Empty string removes inline style

    // Update the last selected option
    lastSelectedOption = 'thumbsUp';

    localStorage.setItem('helpSelectedOption', lastSelectedOption);  
});

thumbsDownIcon.addEventListener('click', function() {
    // Change the color of the thumbs-down icon to red
    thumbsDownIcon.style.color = '#dc3545';
    thumbsDownIcon.style.transition = 'color 0.3s ease';

    // Revert the color of the thumbs-up icon to its initial state
    thumbsUpIcon.style.color = ''; // Empty string removes inline style

    // Update the last selected option
    lastSelectedOption = 'thumbsDown';

    localStorage.setItem('helpSelectedOption', lastSelectedOption); 
});



// need to create a json and save all of it if selected trumbs up or down and data they received from the server
// add when they click on seek help button













    
    





 


      