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

// Star rating script


let selectedStarCount = 0; // Variable to store the selected star count

function handleRating(event) {
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
        selectedStarCount = ratingValue;

        // Log or use the selected star count as needed
        console.log('Selected Star Count:', selectedStarCount);
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


// Function to transcribe audio using OpenAI API
async function transcribeAudio(audioBlob) {
    const apiKey = 'sk'

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
        console.log('Whisper:', data);
        hideSpinner();
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

    var recognition;
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
            //showSpinner();         // Need to remove this line
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
                var value = (dataArray[i] + 1) / 2; // Normalize values to [0, 1]
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
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        //recognition.onresult = function (event) {
            //var transcript = event.results[0][0].transcript;
            //console.log('Speech Recognition Result:', transcript);
            // Do something with the recognized speech
        //};

        recognition.onend = function () {
            // Speech recognition ended
        };

        startRecording();

        // Start updating the wave canvas
        updateWave();
    });

    stopButton.addEventListener('click', function () {
        // Stop mediaRecorder
        stopRecording();
        mediaRecorder.stop();
    
        recognition.stop();
    
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
