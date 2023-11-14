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
    // Wait for the DOM to be fully loaded

    var popup = document.getElementById('popup');

    function openPopup() {
        popup.style.display = 'block';
    }

    function closePopup() {
        popup.style.display = 'none';
    }

    var microphoneButton = document.querySelector('.symbol');
    microphoneButton.addEventListener('click', openPopup);

    var closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', closePopup);
    
    closePopup();
});
