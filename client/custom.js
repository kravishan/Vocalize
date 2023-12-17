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

// Function to open the installation modal
function openInstallModal() {
    const modal = document.getElementById('installModal');
    if (modal) {
      modal.style.display = 'block';

    // Add a class to the body when the modal is open
    document.body.classList.add('modal-open');

    // Hide the list when the modal is open
    hideElement('restaurant-list');
  
      // Customize the installation instructions based on the detected operating system
      const operatingSystem = getOperatingSystem();
      const installInstructions = document.getElementById('installInstructions');
      const installInstructions1 = document.getElementById('installInstructions1');
      const installInstructions2 = document.getElementById('installInstructions2');
      const installInstructions3 = document.getElementById('installInstructions3');
      const installInstructions4 = document.getElementById('installInstructions4');
  
      if (operatingSystem === 'iOS') {
        installInstructions.textContent = 'Follow the steps to install on iOS';
        installInstructions1.textContent = '1. Tap on share in the browser menu';
        installInstructions2.textContent = '2. Tap on the menu icon';
        installInstructions3.textContent = '3. Select "Add to Home Screen"';
        installInstructions4.textContent = '4. Look for the app on your home screen';
      } else if (operatingSystem === 'Android') {
        installInstructions.textContent = 'Follow the steps to install on Android';
        installInstructions1.textContent = '1. Press the three dot icon on chrome browser';
        installInstructions2.textContent = '2. Select "Add to Home Screen"';
        installInstructions3.textContent = '3. Look for the app on your home screen';
      } else {
        installInstructions.textContent = 'Follow the steps to install on your device...';

      }      
    }
  }

  // Function to hide an element by ID
function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  }

  // Function to show an element by ID
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'block';
    }
  }
  
  // Function to close the installation modal
  function closeInstallModal() {
    const modal = document.getElementById('installModal');
    if (modal) {
      modal.style.display = 'none';

    // Remove the class from the body when the modal is closed
    document.body.classList.remove('modal-open');

    // Show the list when the modal is closed
    showElement('restaurant-list');
        
    }
  }


  // Show PWA installation guide notification only if it hasn't been shown before
  if (!getCookie('pwaNotificationShown')) {
    setTimeout(showPWAInstallNotification, 500);
}

// Function to show PWA installation guide notification
function showPWAInstallNotification() {
    // Detect the operating system
    const operatingSystem = getOperatingSystem();

    // Show the notification only on Android and iOS
    if (operatingSystem === 'Android' || operatingSystem === 'iOS') {
        const notification = document.getElementById('pwa-install-notification');
        if (notification) {
            notification.style.display = 'block';
        }
    }




    // const notification = document.getElementById('pwa-install-notification');
    // if (notification) {
    //   notification.style.display = 'block';
    // }
  }
  
  // Function to close the notification
  function closeNotification() {
    setCookie('pwaNotificationShown', 'true', 365);
    const notification = document.getElementById('pwa-install-notification');
    if (notification) {
      notification.style.display = 'none';
    }
  }
  
  // Function to handle the PWA installation guide
function showPWAInstallationGuide() {
  const notification = document.getElementById('pwa-install-notification');
        if (notification) {
            notification.style.display = 'block';

            // Set the cookie to indicate that the notification has been shown
            setCookie('pwaNotificationShown', 'true', 365); // 365 days expiration 
        }
    // Detect the operating system
    const operatingSystem = getOperatingSystem();

    openInstallModal();
    closeNotification();
  
    // Customize this function based on your PWA installation guide
    console.log(`Follow the installation guide for your ${operatingSystem} device.`);
  }

  // Function to get a cookie value by name
  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieString;
}
  
  // Function to get the operating system
  function getOperatingSystem() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('android')) {
        return 'Android';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
        return 'iOS';
    } else if (userAgent.includes('win')) {
        return 'Windows';
    } else if (userAgent.includes('mac')) {
        return 'Mac';
    } else if (userAgent.includes('linux')) {
        return 'Linux';
    } else {
        return 'Unknown';
    }
}

  
  

  