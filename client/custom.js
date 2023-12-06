document.addEventListener('DOMContentLoaded', function () {
  const darkButton = document.querySelector('.dark-button');
  const lightButton = document.querySelector('.white-button');
  const voiceButton = document.querySelector('.voice-input-button');
  const mapButton = document.querySelector('.map-button');

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

  function checkInputMode() {
      // Replace this logic with your actual condition to determine the input mode
      let isVoiceMode = true; // Change this to your actual condition

      function toggleMode() {
          isVoiceMode = !isVoiceMode;

          if (isVoiceMode) {
              voiceButton.style.display = 'block';
              mapButton.style.display = 'none';
          } else {
              mapButton.style.display = 'block';
              voiceButton.style.display = 'none';
          }
      }

      // Add click event listeners to toggle between voice and map
      voiceButton.addEventListener('click', toggleMode);
      mapButton.addEventListener('click', toggleMode);

      // Initial mode check
      toggleMode();
  }

  checkDarkMode();
  checkInputMode();
});
