// API key
const apiKey = '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';


// Index page script
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

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

// Function to show the overall rating
function showRating() {
    var rating = document.querySelector('.rating');
    if (rating) {
        rating.style.display = 'block';
    }
}

// Function to hide the overall rating
function hideRating() {
    var rating = document.querySelector('.rating');
    if (rating) {
        rating.style.display = 'none';
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


// Function to hide all rating sets
function hideRatingSets() {
    var ratingpacks = document.querySelectorAll('.ratingpack');
    if (ratingpacks) {
        ratingpacks.forEach(ratingpack => {
            ratingpack.style.display = 'none';
        });
    }
}


// Function to show the spinner
function showSpinner() {
    var spinner = document.querySelector('.loadingio-spinner-spinner-euwfnax506b');
    if (spinner) {
    spinner.style.display = 'block';
    }
}

// Function to hide the spinner
function hideSpinner() {
    var spinner = document.querySelector('.loadingio-spinner-spinner-euwfnax506b');
    if (spinner) {
    spinner.style.display = 'none';
    }
}


function showStopButton() {
    var stopButton = document.querySelector('.stop');
    if (stopButton) {
        stopButton.style.display = 'block';
    }
}

function hideStopButton() {
    var stopButton = document.querySelector('.stop');
    if (stopButton) {
        stopButton.style.display = 'none';
    }
}

let globalWhisperText = '';

// Function to transcribe audio using OpenAI API
async function transcribeAudio(audioBlob) {
    let whisperText = '';

    const formData = new FormData();
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'text');
    formData.append('file', audioBlob, 'audio.wav');

    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.statusText}`);
        }

        const data = await response.text();        
        whisperText = data;
        globalWhisperText = data;
        
        console.log('Whisper text:', whisperText);
        hideSpinner();
        showRating();
        generateImprovedReviewWithoutStars(whisperText);

    } catch (error) {
        console.error('Error:', error);
    }
}

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
        hideRatingSets()
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                var source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                //analyser.connect(audioContext.destination);

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
                    //var audioUrl = URL.createObjectURL(audioBlob);

                    // Save the audio as a WAV file
                    //saveAs(audioBlob, 'recorded_audio.wav');

                    // Save the audio data to a variable (you can use this variable to save to a file later)
                    savedAudioData = audioBlob;

                     
                    // Save the audio or do further processing
                    //console.log('Audio saved:', audioUrl);
                    transcribeAudio(audioBlob);
                    };

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
            audioChunks = [];
    
            // Stop the media stream
            if (audioContext && audioContext.state === 'running') {
                audioContext.close().then(function () {
                    console.log('Microphone stream closed');
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


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// Function to send a request to ChatGPT-4 API and update the review output
// Async function to generate an improved review with additional prompts
// Async function to generate an improved hotel or restaurant review
async function generateImprovedReviewWithoutStars(whisperText) {

    try {
        // Prompts tailored for hotel and restaurant reviews
        const additionalPrompts = [
            "I recently visited a restaurant and want to share my experience.",
            "Please enhance my brief feedback by adding more details and making it consumer-friendly.",
            "Imagine you are the customer, what additional information would you find helpful in a review?",
            "Take my short review and make it more informative for other consumers.",
            "Provide insights that would be valuable for someone considering a visit to the restaurant.",
            "Add details that could influence a consumer's decision to choose or avoid the restaurant.",
        ];
        

        // Combine additional prompts with the user's input
        const inputMessages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...additionalPrompts.map(prompt => ({ role: 'assistant', content: prompt })),
            { role: 'user', content: whisperText },
        ];

        // Fetch response from OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: inputMessages,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const improvedReview = data.choices[0].message.content;

        // Log or use the generated improved review as needed
        console.log('Improved Review:', improvedReview);

        // Store the improved review in localStorage
        localStorage.setItem('improvedReview', improvedReview);
        
    } catch (error) {
        console.error('Error:', error);
    }
}


async function generateImprovedReviewWithStars(globalWhisperText, selectedOverallStarCount, foodRating, serviceRating, atmosphereRating) {
//async function generateImprovedReviewWithStars() { 
    //let globalWhisperText = 'Food was good.';
    //let selectedOverallStarCount = '3';
    //let foodRating = '5';
    //let serviceRating = '4';
    //let atmosphereRating = '4';   
    //console.log('Whisper text new:', globalWhisperText);
    //console.log('Overall star count new:', selectedOverallStarCount);
    //console.log('Food rating new:', foodRating);
    //console.log('Service rating new:', serviceRating);
    //console.log('Atmosphere rating new:', atmosphereRating);

    try {
        // Prompts tailored for hotel and restaurant reviews
        const additionalPrompts = [
            "I recently visited a restaurant and want to share my experience.",
            "Please enhance my brief feedback by adding more details and making it consumer-friendly.",
            "Imagine you are the customer, what additional information would you find helpful in a review?",
            "Take my short review and make it more informative for other consumers.",
            "Provide insights that would be valuable for someone considering a visit to the restaurant.",
            "Add details that could influence a consumer's decision to choose or avoid the restaurant.",
        ];

        // Combine additional prompts with the user's input and star ratings
        const inputMessages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...additionalPrompts.map(prompt => ({ role: 'assistant', content: prompt })),
            { role: 'user', content: globalWhisperText },
            { role: 'user', content: `Overall Star Rating: ${selectedOverallStarCount}` },
            { role: 'user', content: `Food Rating: ${foodRating}` },
            { role: 'user', content: `Service Rating: ${serviceRating}` },
            { role: 'user', content: `Atmosphere Rating: ${atmosphereRating}` },
        ];

        // Fetch response from OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: inputMessages,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const improvedReviewWithStars = data.choices[0].message.content;

        // Log or use the generated improved review as needed
        console.log('Improved review with stars:', improvedReviewWithStars);

        // Store the improved review in localStorage
        //localStorage.setItem('improvedReviewWithStars', improvedReviewWithStars);

        // Redirect to the result page with parameters
        const resultPageURL = `result.html?whisperText=${encodeURIComponent(globalWhisperText)}&overallStarCount=${selectedOverallStarCount}&foodRating=${foodRating}&serviceRating=${serviceRating}&atmosphereRating=${atmosphereRating}&improvedReviewWithStars=${encodeURIComponent(improvedReviewWithStars)}`;
        window.location.href = resultPageURL;


    } catch (error) {
        console.error('Error:', error);
    }
}








// Add this at the end of your script.js file
document.addEventListener('DOMContentLoaded', function () {
    initMap();
  });
  