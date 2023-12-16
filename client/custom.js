document.addEventListener('DOMContentLoaded', function () {
  const darkButton = document.querySelector('.dark-button');
  const lightButton = document.querySelector('.white-button');

  // Initially hide the light mode button
  lightButton.style.display = 'none';

  function checkDarkMode() {
      const toggleDark = document.querySelectorAll('[data-toggle-theme]');

      function activateDarkMode() {
          document.body.classList.add('theme-dark');
          document.body.classList.remove('theme-light', 'detect-theme');
          for (let i = 0; i < toggleDark.length; i++) {
              toggleDark[i].checked = "checked";
          }
          localStorage.setItem('-Theme', 'dark-mode');

          // Show the light mode button after dark mode is activated
          lightButton.style.display = 'block';

          // Replace the dark mode button with another button
          darkButton.style.display = 'none';
      }

      function activateLightMode() {
          document.body.classList.add('theme-light');
          document.body.classList.remove('theme-dark', 'detect-theme');
          for (let i = 0; i < toggleDark.length; i++) {
              toggleDark[i].checked = false;
          }
          localStorage.setItem('Theme', 'light-mode');

          // Hide the light mode button after light mode is activated
          lightButton.style.display = 'none';

          // Restore the dark mode button
          darkButton.style.display = 'block';
      }

      // Activating Dark Mode
      darkButton.addEventListener('click', activateDarkMode);

      // Activating Light Mode
      lightButton.addEventListener('click', activateLightMode);
  }
  checkDarkMode();
});



/////////////////////////////////////


// Get the .page-title-fixed element
const pageTitleFixedElement = document.querySelector('.page-title-fixed');

// Add an event listener for the scroll event
window.addEventListener('scroll', function() {
    // Check the scroll position (adjust the value as needed)
    if (window.scrollY > 90) {
        // If scroll position is greater than 50, add a class to hide the element
        pageTitleFixedElement.style.display = 'none';
    } else {
        // Otherwise, remove the class to show the element
        pageTitleFixedElement.style.display = 'block';
    }
});





/////////////////////////////////////


// script.js or custom.js

// Function to show PWA installation guide notification
function showPWAInstallNotification() {
    const notification = document.getElementById('pwa-install-notification');
    if (notification) {
      notification.style.display = 'block';
    }
  }
  
  // Function to close the notification
  function closeNotification() {
    const notification = document.getElementById('pwa-install-notification');
    if (notification) {
      notification.style.display = 'none';
    }
  }
  
  // Function to handle the PWA installation guide
function showPWAInstallationGuide() {
    // Detect the operating system
    const operatingSystem = getOperatingSystem();
  
    // Customize this function based on your PWA installation guide
    console.log(`Follow the installation guide for your ${operatingSystem} device.`);
  }
  
  // Function to get the operating system
  function getOperatingSystem() {
    const platform = navigator.platform.toLowerCase();
  
    if (platform.includes('win')) {
      return 'Windows';
    } else if (platform.includes('mac')) {
      return 'Mac';
    } else if (platform.includes('linux')) {
      return 'Linux';
    } else if (platform.includes('iphone') || platform.includes('ipad') || platform.includes('ipod')) {
      return 'iOS';
    } else if (platform.includes('android')) {
      return 'Android';
    } else {
      return 'Unknown';
    }
  }
  
  
  // Show PWA installation guide notification after 2 seconds
  setTimeout(showPWAInstallNotification, 1000);
  
