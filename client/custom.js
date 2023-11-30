//Dark Mode
function checkDarkMode(){
    const toggleDark = document.querySelectorAll('[data-toggle-theme]');
    function activateDarkMode(){
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light', 'detect-theme');
        for(let i = 0; i < toggleDark.length; i++){toggleDark[i].checked="checked"};
        localStorage.setItem(pwaName+'-Theme', 'dark-mode');
    }
    function activateLightMode(){
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark','detect-theme');
        for(let i = 0; i < toggleDark.length; i++){toggleDark[i].checked=false};
        localStorage.setItem(pwaName+'-Theme', 'light-mode');
    }
    function removeTransitions(){var falseTransitions = document.querySelectorAll('.btn, .header, #footer-bar, .menu-box, .menu-active'); for(let i = 0; i < falseTransitions.length; i++) {falseTransitions[i].style.transition = "all 0s ease";}}
    function addTransitions(){var trueTransitions = document.querySelectorAll('.btn, .header, #footer-bar, .menu-box, .menu-active'); for(let i = 0; i < trueTransitions.length; i++) {trueTransitions[i].style.transition = "";}}

    function setColorScheme() {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches
        const isNoPreference = window.matchMedia("(prefers-color-scheme: no-preference)").matches
        window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && activateDarkMode())
        window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && activateLightMode())
        if(isDarkMode) activateDarkMode();
        if(isLightMode) activateLightMode();
    }

    //Activating Dark Mode
    var darkModeSwitch = document.querySelectorAll('[data-toggle-theme]')
    darkModeSwitch.forEach(el => el.addEventListener('click',e =>{
        if(document.body.className == "theme-light"){ removeTransitions(); activateDarkMode();}
        else if(document.body.className == "theme-dark"){ removeTransitions(); activateLightMode();}
        setTimeout(function(){addTransitions();},350);
    }));

    //Set Color Based on Remembered Preference.
    if(localStorage.getItem(pwaName+'-Theme') == "dark-mode"){for(let i = 0; i < toggleDark.length; i++){toggleDark[i].checked="checked"};document.body.className = 'theme-dark';}
    if(localStorage.getItem(pwaName+'-Theme') == "light-mode"){document.body.className = 'theme-light';} if(document.body.className == "detect-theme"){setColorScheme();}

    //Detect Dark/Light Mode
    const darkModeDetect = document.querySelectorAll('.detect-dark-mode');
    darkModeDetect.forEach(el => el.addEventListener('click',e =>{
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add('detect-theme')
        setTimeout(function(){setColorScheme();},50)
    }))
}
if(localStorage.getItem(pwaName+'-Theme') == "dark-mode"){document.body.className = 'theme-dark';}
if(localStorage.getItem(pwaName+'-Theme') == "light-mode"){document.body.className = 'theme-light';}


//Back Button
const backButton = document.querySelectorAll('[data-back-button]');
if(backButton.length){
    backButton.forEach(el => el.addEventListener('click',e =>{
        e.stopPropagation;
        e.preventDefault;
        window.history.go(-1);
    }));
}