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

        // Check if all ratings are set before calling showSpinnerWithStar
        if (foodRating !== 0 && serviceRating !== 0 && atmosphereRating !== 0) {
            hideRatingSets();
            showSpinner();
            generateImprovedReviewWithStars(globalWhisperText, selectedOverallStarCount, foodRating, serviceRating, atmosphereRating);
            //generateImprovedReviewWithStars();
        }
         
        //generateImprovedReviewWithStars(whisperText, selectedOverallStarCount, foodRating, serviceRating, atmosphereRating);
    }

}






/////////////////////////   Show BUTTONS   ///////////////////////////

// Function to show the overall rating
function showRating() {
    var rating = document.querySelector('.rating');
    if (rating) {
        rating.style.display = 'block';
    }
}

// Function to show all rating sets
function showRatingSets() {
    var ratingpacks = document.querySelectorAll('.ratingpack');
    if (ratingpacks) {
        ratingpacks.forEach(ratingpack => {
            ratingpack.style.display = 'block';
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


// Function to hide all rating sets
function hideRatingSets() {
    var ratingpacks = document.querySelectorAll('.ratingpack');
    if (ratingpacks) {
        ratingpacks.forEach(ratingpack => {
            ratingpack.style.display = 'none';
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




/////////////////////////   POPUP   ///////////////////////////

// Popup script
document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById('popup');
    var stopButton = document.querySelector('.stop');
    var microphoneButton = document.querySelector('.symbol');
    var waveCanvas = document.querySelector('.wave-canvas');

    //var recognition;
    var mediaRecorder;
    var audioChunks = [];
    var audioContext;
    var analyser;
    var dataArray;
    
    function openPopup() {
        document.body.classList.add('popup-open');
        popup.style.display = 'block';
    }

    function closePopup() {
        document.body.classList.remove('popup-open');
        popup.style.display = 'none';
        stopRecording();
    }

    function startRecording() {
        hideSpinner();
        hideRating();
        hideRatingSets();
    
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                var source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
    
                dataArray = new Float32Array(analyser.fftSize);
    
                mediaRecorder = new MediaRecorder(stream);
    
                mediaRecorder.ondataavailable = function (event) {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
    
                        // Update the wave view
                        drawWave();
                    }
                };
    
                mediaRecorder.onstop = function () {
                    var audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    
                    // Save the audio data to a variable for later use
                    savedAudioData = audioBlob;
    
                    // Save the audio or do further processing
                    //console.log('Audio saved:', audioUrl);
                    transcribeAudio(audioBlob);
    
                    // Clear audioChunks after processing
                    audioChunks = [];
                };
    
                // Start the mediaRecorder
                mediaRecorder.start();
            })
            .catch(function (error) {
                console.error('Error accessing microphone:', error);
            });
    }  

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            showSpinner();
            hideStopButton();
    
            mediaRecorder.stop();
            //stream.getTracks().forEach(track => track.stop());
            audioChunks = [];
    
            // Stop the media stream and close the audio context
            if (audioContext && audioContext.state === 'running') {
                // Stop all tracks in the stream
                const tracks = mediaRecorder.stream.getTracks();
                tracks.forEach(track => track.stop());
    
                // Close the audio context
                audioContext.close().then(function () {
                    //console.log('Microphone stream closed');
                });
            }
        }
    }

    function drawWave() {
        if (analyser) {
            analyser.getFloatTimeDomainData(dataArray);

            var canvasContext = waveCanvas.getContext('2d');
            var width = waveCanvas.width;
            var height = waveCanvas.height;

            canvasContext.clearRect(0, 0, width, height);
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = '#ffffff';
            canvasContext.beginPath();

            var sliceWidth = width / analyser.fftSize;
            var x = 0;

            for (var i = 0; i < analyser.fftSize; i++) {
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
    }

    function updateWave() {
        drawWave();
        requestAnimationFrame(updateWave);
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
        var h3Element = document.querySelector('h3');
        if (h3Element) {
            h3Element.style.display = 'none';
        }
      
        openPopup();
        //recognition = new webkitSpeechRecognition();
       // recognition.lang = 'en-US';
        //recognition.start();

        //recognition.onresult = function (event) {
            //var transcript = event.results[0][0].transcript;
            //console.log('Speech Recognition Result:', transcript);
            // Do something with the recognized speech
        //};

       // recognition.onend = function () {
            // Speech recognition ended
        //};

        startRecording();

        // Start updating the wave canvas
        updateWave();
    });

    stopButton.addEventListener('click', function () {
        // Stop mediaRecorder
        stopRecording();
        mediaRecorder.stop();
    
       // recognition.stop();
    
        // Clear the wave canvas
        var canvasContext = waveCanvas.getContext('2d');
        var width = waveCanvas.width;
        var height = waveCanvas.height;
        canvasContext.clearRect(0, 0, width, height);

        waveCanvas.style.display = 'none';
    });
    
    var closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', closePopup);
});





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
  xhr.open('POST', 'http://localhost:3000/transcribe-audio', true);

  // Set up a handler for when the request is successfully completed
  xhr.onload = function () {
    if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        const whisperText = responseData.transcription;

      globalWhisperText = whisperText;

      console.log('Whisper text:', whisperText);
      hideSpinner();
      showRating();
      generateImprovedReviewWithoutStars(whisperText);
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


// Function to send the text to the backend and trigger OpenAI request
async function generateImprovedReviewWithoutStars(whisperText) {
    try {
        // Get restaurant details from localStorage
        const selectedRestaurantData = localStorage.getItem("selectedRestaurant");
        const restaurantName = selectedRestaurantData ? JSON.parse(selectedRestaurantData).name : '';

        // Send text to the backend
        const response = await fetch('http://localhost:3000/generate-improved-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                whisperText,
                restaurantName,
            }),
        });

        if (!response.ok) {
            throw new Error(`Backend request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const improvedReview = data.improvedReview;

        // Log or use the generated improved review as needed
        console.log('Improved Review:', improvedReview);

        // Store the improved review in localStorage
        localStorage.setItem('improvedReview', improvedReview);

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to send the data to the backend and trigger OpenAI request
async function generateImprovedReviewWithStars(globalWhisperText, selectedOverallStarCount, foodRating, serviceRating, atmosphereRating) {
    try {
        // Get restaurant details from localStorage
        const selectedRestaurantData = localStorage.getItem("selectedRestaurant");
        const restaurantName = selectedRestaurantData ? JSON.parse(selectedRestaurantData).name : '';

        // Send data to the backend
        const response = await fetch('http://localhost:3000/generate-improved-review-with-stars', {
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
                restaurantName,
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
        const resultPageURL = `/result.html?whisperText=${encodeURIComponent(globalWhisperText)}&overallStarCount=${selectedOverallStarCount}&foodRating=${foodRating}&serviceRating=${serviceRating}&atmosphereRating=${atmosphereRating}&improvedReviewWithStars=${encodeURIComponent(improvedReviewWithStars)}`;
        window.location.href = resultPageURL;

    } catch (error) {
        console.error('Error:', error);
    }
}





