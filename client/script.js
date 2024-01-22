// Add service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

/////////////////////////   Star rating   ///////////////////////////

 // Star rating overall script
let selectedOverallStarCount = 0; 

function handleOverallRating(event) {
    const stars = document.querySelectorAll('.star');
    const clickedStar = event.target;

    if (clickedStar.classList.contains('star')) {
        const ratingValue = parseInt(clickedStar.getAttribute('data-value'));

        // Mark stars up to the clicked one as checked
        for (let i = 1; i <= ratingValue; i++) {
            const star = document.getElementById(`star${i}`);
            if (star) {
                star.classList.add('checked');
            }
        }

        // Unmark stars after the clicked one
        for (let i = ratingValue + 1; i <= stars.length; i++) {
            const star = document.getElementById(`star${i}`);
            if (star) {
                star.classList.remove('checked');
            }
        }

        // Update the selected star count
        selectedOverallStarCount = ratingValue;

        // Log or use the selected star count as needed
        console.log('Overall star count:', selectedOverallStarCount);
        hideRating();
        showRatingSets();
    }
}

// Star rating set script
let foodRating = 0;
let serviceRating = 0;
let atmosphereRating = 0;
let whisperTextReceived = 0;

function handleRating(event, set) {
    const stars = document.querySelectorAll(`.${set} .star`);
    const clickedStar = event.target;

    if (clickedStar.classList.contains('star')) {
        const ratingValue = parseInt(clickedStar.getAttribute('data-value'));

        // Reset all stars in the set
        stars.forEach(star => star.classList.remove('checked'));

        // Mark stars up to the clicked one as checked
        for (let i = 1; i <= ratingValue; i++) {
            const star = document.getElementById(`${set}_star${i}`);
            if (star) {
                star.classList.add('checked');
            }
        }

        // Log or use the selected star count as needed
        //console.log(`Selected Star Count for ${set}:`, ratingValue);

        // Save the rating value to the corresponding variable
        switch (set) {
            case 'set1':
                foodRating = ratingValue;
                console.log('Food rating:', foodRating);
                break;
            case 'set2':
                serviceRating = ratingValue;
                console.log('Service rating:', serviceRating);
                break;
            case 'set3':
                atmosphereRating = ratingValue;
                console.log('Atmosphere rating:', atmosphereRating);
                break;
            default:
                break;
                
        }
        checkAndShowSpinner();    
        waitForWhisperText();          
    }

}

function checkAndShowSpinner() {
    if (foodRating !== 0 && serviceRating !== 0 && atmosphereRating !== 0) {
        hideRatingSets();
        showSpinner();
    }
}


function waitUntilWhisperTextReceived() {
    return new Promise((resolve) => {
        function checkWhisperText() {
            if (whisperTextReceived === 1) {
                resolve();
            } else {
                setTimeout(checkWhisperText, 100); 
            }
        }

        checkWhisperText();
    });
}

// Call this function before the block of code to execute after whisperTextReceived becomes 1
async function waitForWhisperText() {
    await waitUntilWhisperTextReceived();

    // If whisperTextReceived is 1, execute the code below
    if (foodRating !== 0 && serviceRating !== 0 && atmosphereRating !== 0 && whisperTextReceived !== 0) {
        hideRatingSets();
        showSpinner();
        generateImprovedReviewWithStars(globalWhisperText, selectedOverallStarCount, foodRating, serviceRating, atmosphereRating);
    }
    else {
    }
}



/////////////////////////   Show BUTTONS   ///////////////////////////

// Function to show the overall rating
function showRating() {
    var rating = document.querySelector('.rating');
    var message = document.querySelector('.rating-message');
    if (rating && message) {
        rating.style.display = 'block';

        // Set your custom message
        message.innerHTML = "We value your feedback! Please rate your overall experience";
        message.style.display = 'block';
    }
}

// Function to show all rating sets
function showRatingSets() {
    var ratingpacks = document.querySelectorAll('.ratingpack');
    var message = document.querySelector('.rating-message');
    if (ratingpacks && message) {
        ratingpacks.forEach(ratingpack => {
            ratingpack.style.display = 'block';

        // Set your custom message
        message.innerHTML = "Please rate each experiences separately";
        message.style.display = 'block';    
        });
    }
}

// Function to show the spinner
function showSpinner() {
    var spinner = document.querySelector('.custom-loader');
    if (spinner) {
    spinner.style.display = 'block';
    }
}

function showStopButton() {
    var stopButton = document.querySelector('.stop');
    if (stopButton) {
        stopButton.style.display = 'block';
    }
}

// Function to show the microphone button
function showMicrophoneButton() {
    var microphoneButton = document.querySelector('.symbol');
    var selectedRestaurantData = localStorage.getItem("selectedRestaurant");
    if (selectedRestaurantData) {
      microphoneButton.style.display = 'block';
    }
  }


/////////////////////////   HIDE BUTTONS   ///////////////////////////

// Function to hide the overall rating
function hideRating() {
    var rating = document.querySelector('.rating');
    if (rating) {
        rating.style.display = 'none';
    }
}

// Funtion to hide the refresh button
function hideRefreshButton() {
    var refreshButton = document.querySelector('.refresh');
    if (refreshButton) {
        refreshButton.style.display = 'none';
    }
}


// Function to hide all rating sets
function hideRatingSets() {
    var ratingpacks = document.querySelectorAll('.ratingpack');
    var message = document.querySelector('.rating-message');
    if (ratingpacks && message) {
        ratingpacks.forEach(ratingpack => {
            ratingpack.style.display = 'none';

        message.style.display = 'none';      
        });
    }
}


// Function to hide the spinner
function hideSpinner() {
    var spinner = document.querySelector('.custom-loader');
    if (spinner) {
    spinner.style.display = 'none';
    }
}


// Function to hide the stop button
function hideStopButton() {
    var stopButton = document.querySelector('.stop');
    if (stopButton) {
        stopButton.style.display = 'none';
    }
}

// Function to hide the stop button info
function hideStopButtonInfo() {
    var stopButtonInfo = document.querySelector('.stop-button-info');
    if (stopButtonInfo) {
        stopButtonInfo.style.display = 'none';
    }
}

// Function to hide the Instructions texts
function hideInstructions() {
    var hideInstructions1 = document.querySelector('.info');
    var hideInstructions2 = document.querySelector('.heading');
    if (hideInstructions1 && hideInstructions2) {
        hideInstructions1.style.display = 'none';
        hideInstructions2.style.display = 'none';
    }
}

// Hide custom timmer message
function hideCustomTimerMessage() {
    const messageElement = document.getElementById('custom-message-timer');
    if (messageElement) {
        messageElement.style.display = 'none';
    }
}

function hideAndShowCustomTimerMessage(showDurationInSeconds) {
    const messageElement = document.getElementById('custom-message-timer');
    if (messageElement) {
        // Hide the message immediately
        messageElement.style.display = 'none';

        // Set a timeout to display the message again after the fixed show duration
        setTimeout(() => {
            messageElement.style.display = 'block';
        }, showDurationInSeconds * 1000); // Convert seconds to milliseconds
    }
}

/////////////////////////   POPUP   ///////////////////////////


// Popup script
document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById('popup');
    var stopButton = document.querySelector('.stop');
    var microphoneButton = document.querySelector('.symbol');
    let waveCanvas = document.querySelector('.wave-canvas');

    //var recognition;
    var mediaRecorder;
    var audioChunks = [];
    var audioContext;
    let analyser;
    let dataArray;
    
    function openPopup() {
        document.body.classList.add('popup-open');
        popup.style.display = 'block';
    }

    function closePopup() {
        localStorage.clear();
        stopRecording();
        location.reload();
    }

    // Function to show a toast message
    function showToast(message) {
        const toastElement = document.getElementById('toast');
        if (toastElement) {
            toastElement.textContent = message;
            toastElement.style.display = 'block';

            // Hide the toast after a certain duration (e.g., 3 seconds)
            setTimeout(() => {
                toastElement.style.display = 'none';
            }, 300);
        }
    }


    function refreshButtonClicked() {       
        showToast('Refreshing...');
        localStorage.clear();
        if (isRecording) {
            recorder
                .stop()
                .getMp3()
                .then(([buffer, blob]) => {
                    savedAudioData = blob;
                    transcribeAudio(blob);
                    audioChunks = [];
                    analyser.disconnect(); // Disconnect the analyser when recording stops
                })
                .catch((e) => console.error(e));

            isRecording = false;
        }

        stopTimer();
        hideAndShowCustomTimerMessage(270);

        timerDuration = 300;
         
        
        // resetStarRatings();
        startRecording();
        
    }

    function resetStarRatings() {
        // Reset star ratings to initial state
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => star.classList.remove('checked'));

        selectedOverallStarCount = 0;
        foodRating = 0;
        serviceRating = 0;
        atmosphereRating = 0;

        // Log or use the reset star ratings as needed
        console.log('Star ratings reset.');
    }

    // Function to draw the wave on the canvas
    function drawWave() {
        if (analyser && analyser.getFloatTimeDomainData) {
            analyser.getFloatTimeDomainData(dataArray);

            var canvasContext = waveCanvas.getContext('2d');
            var width = waveCanvas.width;
            var height = waveCanvas.height;

            canvasContext.clearRect(0, 0, width, height);
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = '#ffffff';
            canvasContext.beginPath();

            var sliceWidth = width / dataArray.length;
            var x = 0;

            for (var i = 0; i < dataArray.length; i++) {
                var value = (dataArray[i] + 1) / 2;
                var y = value * height;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasContext.stroke();
        }

        // Schedule the next frame
        requestAnimationFrame(drawWave);
    }
    
    // Optional: Function to update the wave canvas during recording
    function updateWave() {
        drawWave();
        if (isRecording) {
            requestAnimationFrame(updateWave);
        }
    }

    // Timer variables
    let timer;
    let timerDuration = 300; // 5 minutes in seconds

    // Function to update and display the custom message
    function updateTimer() {
        // Display a custom message when time is below 30 seconds
        if (timerDuration <= 30) {
            const messageElement = document.getElementById('custom-message-timer');
            if (messageElement) {
                const remainingTime = timerDuration > 0 ? `${timerDuration} seconds` : 'less than a second';
                messageElement.innerText = `Time is running out. Please finish the recording within ${remainingTime}`;
            }
        }

        if (timerDuration > 0) {
            timerDuration--;

            // Continue updating the timer every second
            timer = setTimeout(updateTimer, 1000);
        } else {
            stopRecording();
            console.log('Timer reached zero.');
            hideCustomTimerMessage();
        }
    }

    // Function to start the timer
    function startTimer() {
        updateTimer();
    }

    // Function to stop the timer
    function stopTimer() {
        clearTimeout(timer);
    }

    let recorder;
    let isRecording = false;


    // Function to start recording using mic-recorder-to-mp3
    function startRecording() {
        startTimer();
        hideSpinner();
        hideRating();
        hideRatingSets();
    
        const mp3Options = {
            bitRate: 128,
            encoder: 'mp3',
            sampleRate: 44100,
        };
    
        recorder = new MicRecorder(mp3Options);
    
        recorder.start()
            .then(function(stream) {
                isRecording = true;
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                var source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);

                dataArray = new Float32Array(analyser.fftSize);

                recorder.ondataavailable = function (event) {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
    
                        // Update the wave view
                        drawWave();
                    }
                };

            })
            .catch((e) => console.error(e));
    }
    

    function stopRecording() {
        hideCustomTimerMessage();
        stopTimer();
        // showSpinner();
        showRating();
        hideStopButton();
        hideInstructions();
        hideRefreshButton(); 
        hideStopButtonInfo();

        if (isRecording) {
            recorder
                .stop()
                .getMp3()
                .then(([buffer, blob]) => {
                    savedAudioData = blob;
                    transcribeAudio(blob);
                    audioChunks = [];
                    analyser.disconnect(); // Disconnect the analyser when recording stops
                })
                .catch((e) => console.error(e));

            isRecording = false;
        }
    }

    

    microphoneButton.addEventListener('click', function () {
        // Hide the restaurant list
        var restaurantList = document.getElementById('restaurant-list');
        if (restaurantList) {
            restaurantList.style.display = 'none';
        }

        // Hide the microphone button
        var symbolButton = document.querySelector('.symbol');
        if (symbolButton) {
            symbolButton.style.display = 'none';
        }


        // Hide the h3 element
        var h3Element = document.querySelector('.font-22');
        if (h3Element) {
            h3Element.style.display = 'none';
        }

        // Hide the mode button
        var modeButton = document.querySelector('.title-icon-two');
        if (modeButton) {
            modeButton.style.display = 'none';
        }
      
        openPopup();
        startRecording();

        // Start updating the wave canvas
        updateWave();
    });

    stopButton.addEventListener('click', function () {

        // Stop mediaRecorder
        stopRecording();
    
        // Clear the wave canvas
        var canvasContext = waveCanvas.getContext('2d');
        var width = waveCanvas.width;
        var height = waveCanvas.height;
        canvasContext.clearRect(0, 0, width, height);

        waveCanvas.style.display = 'none';
    });
    
    var closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', closePopup);

    var refreshButton = document.querySelector('.refresh');
    refreshButton.addEventListener('click', refreshButtonClicked);
});


/////////////////////////   USER COORDINATES   ///////////////////////////


// Function to get the user's coordinates
function getUserCoordinates() {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    resolve(coordinates);
                },
                (error) => {
                    reject(error.message);
                }
            );
        } else {
            reject('Geolocation is not supported in this browser.');
        }
    });
}


/////////////////////////   LOCAL STORAGE   ///////////////////////////

// Retrieve the value from localStorage
const selectedRestaurantData = localStorage.getItem("selectedRestaurant");

// Check if the value exists
if (selectedRestaurantData) {
  // Parse the JSON string to get the object
  const selectedRestaurant = JSON.parse(selectedRestaurantData);

  // Now you can use the selectedRestaurant object in your script
  console.log("Selected Restaurant in script.js:", selectedRestaurant);

  // Add your code here to use the selectedRestaurant object as needed
} else {
  console.log("No selected restaurant data in localStorage.");
}


// // Retrieve the stored user location from localStorage
// var storedUserLocation = localStorage.getItem("userLocation");
// var userLocation = JSON.parse(storedUserLocation);
// console.log('User location new:', userLocation);





/////////////////////////   API REQUESTS   ///////////////////////////


// Function to get the transcribe audio from the backend
let globalWhisperText = '';

async function transcribeAudio(audioBlob) {
  let whisperText = '';

  // Create a Blob from the audio data
  const audioBlobObject = new Blob([audioBlob], { type: 'audio/wav' });

  // Create a FormData for sending to the server
  const formData = new FormData();
  formData.append('file', audioBlobObject, 'audio_received.wav');

  // Create an XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Configure it: POST-request for the specified URL
//   xhr.open('POST', 'http://localhost:3000/transcribe-audio', true);
  xhr.open('POST', 'https://vocalizer.dev/server/transcribe-audio', true);

  // Set up a handler for when the request is successfully completed
  xhr.onload = function () {
    if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        const whisperText = responseData.transcription;

      globalWhisperText = whisperText;

      console.log('Whisper text:', whisperText);
      whisperTextReceived = 1;
    //   hideSpinner();
    //   showRating();
    //   generateImprovedReviewWithoutStars(whisperText);
    } else {
      console.error('Backend request failed:', xhr.statusText);
    }
  };

  // Set up a handler for network errors
  xhr.onerror = function () {
    console.error('Network error occurred');
  };

  // Send the FormData with the audio file
  xhr.send(formData);
}


// // Function to send the text to the backend and trigger OpenAI request
// async function generateImprovedReviewWithoutStars(whisperText) {
//     try {
//         // Get restaurant details from localStorage
//         const selectedRestaurantData = localStorage.getItem("selectedRestaurant");
//         const restaurantName = selectedRestaurantData ? JSON.parse(selectedRestaurantData).name : '';

//         // Send text to the backend
//         // const response = await fetch('http://localhost:3000/generate-improved-review', {
//         const response = await fetch('https://vocalizer.dev/server/generate-improved-review', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 whisperText,
//                 restaurantName,
//             }),
//         });

//         if (!response.ok) {
//             throw new Error(`Backend request failed: ${response.statusText}`);
//         }

//         const data = await response.json();
//         const improvedReview = data.improvedReview;

//         // Log or use the generated improved review as needed
//         console.log('Improved Review:', improvedReview);

//         // Store the improved review in localStorage
//         localStorage.setItem('improvedReview', improvedReview);

//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// Function to send the data to the backend and trigger OpenAI request
async function generateImprovedReviewWithStars(globalWhisperText, selectedOverallStarCount, foodRating, serviceRating, atmosphereRating) {
    try {
        // Get restaurant details from localStorage
        const selectedRestaurantData = localStorage.getItem("selectedRestaurant");
        // const restaurantName = selectedRestaurantData ? JSON.parse(selectedRestaurantData).name : '';

        // Get user coordinates
        const userLocation = await getUserCoordinates();

        // Send data to the backend
        // const response = await fetch('http://localhost:3000/generate-improved-review-with-stars', {
        const response = await fetch('https://vocalizer.dev/server/generate-improved-review-with-stars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                globalWhisperText,
                selectedOverallStarCount,
                foodRating,
                serviceRating,
                atmosphereRating,
                // restaurantName,
            }),
        });

        if (!response.ok) {
            throw new Error(`Backend request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const improvedReviewWithStars = data.improvedReviewWithStars;

        // Log or use the generated improved review as needed
        console.log('Improved Review with Stars:', improvedReviewWithStars);

        // Store the improved review in localStorage
        localStorage.setItem('improvedReviewWithStars', improvedReviewWithStars);

        // Redirect to the result page with parameters
        const resultPageURL = `./result.html?userLocation=${encodeURIComponent(JSON.stringify(userLocation))}&whisperText=${encodeURIComponent(globalWhisperText)}&overallStarCount=${selectedOverallStarCount}&foodRating=${foodRating}&serviceRating=${serviceRating}&atmosphereRating=${atmosphereRating}&improvedReviewWithStars=${encodeURIComponent(improvedReviewWithStars)}`;
        window.location.href = resultPageURL;


    } catch (error) {
        console.error('Error:', error);
    }
}









