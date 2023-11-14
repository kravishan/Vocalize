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
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                var source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                analyser.connect(audioContext.destination);

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
                    var audioUrl = URL.createObjectURL(audioBlob);
                    // Save the audio or do further processing
                    console.log('Audio saved:', audioUrl);
                };

                mediaRecorder.start();
            })
            .catch(function (error) {
                console.error('Error accessing microphone:', error);
            });
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            audioChunks = [];
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
            canvasContext.strokeStyle = '#51B96D';
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

        recognition.onresult = function (event) {
            var transcript = event.results[0][0].transcript;
            console.log('Speech Recognition Result:', transcript);
            // Do something with the recognized speech
        };

        recognition.onend = function () {
            // Speech recognition ended
        };

        startRecording();

        // Start updating the wave canvas
        updateWave();
    });

    stopButton.addEventListener('click', function () {
        recognition.stop();
    });

    var closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', closePopup);
});
