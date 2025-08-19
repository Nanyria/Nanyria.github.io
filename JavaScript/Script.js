// Simple test to verify script loads
console.log('Script.js file loaded successfully');

window.onload = function() {
    console.log('Window loaded, starting initialization...');
    
    // Function to fetch a random image from Unsplash API and set it as background
    function changeBackground() {
        fetch('https://api.unsplash.com/photos/random?client_id=5ZS-qKNhjJU1uXnZvX1FSMh2abiQ9K-oQapzmTJ2joU')
        .then(response => response.json())
        .then(data => {
            // Get the URL of the image
            const imageUrl = data.urls.regular;
            // Set the background of the body to the fetched image
            document.body.style.backgroundImage = `url(${imageUrl})`;
            // Set rubrik text color based on background after a small delay
            setTimeout(function() {
                setRubrikColor();
            }, 100);
        })
        .catch(error => {
            console.error('Error fetching image from Unsplash API:', error);
        });
    }

    // Add event listener to the footer to change background on click
    document.getElementById('footer').addEventListener('click', function() {
        changeBackground();
    });

    // Change background and rubrik text color when the page loads initially
    changeBackground();

    // Initialize clock
    updateClock();
    setInterval(updateClock, 1000);

    // Load saved rubrik from localStorage AFTER background is set
    setTimeout(function() {
        loadSavedRubrik();
    }, 100);

    // Test localStorage immediately
    console.log('Testing localStorage...');
    console.log('Current dashboardRubrik value:', localStorage.getItem('dashboardRubrik'));
    console.log('Current dashboardLinks value:', localStorage.getItem('dashboardLinks'));

    // Make rubrik editable
    var rubrikElement = document.getElementById('rubrik');
    rubrikElement.addEventListener('click', function() {
        var inputElement = document.createElement('input');
        inputElement.value = rubrikElement.textContent;
        inputElement.style.fontSize = getComputedStyle(rubrikElement).fontSize;
        inputElement.style.fontFamily = getComputedStyle(rubrikElement).fontFamily;
        inputElement.style.color = getComputedStyle(rubrikElement).color;
        inputElement.style.backgroundColor = 'transparent';
        inputElement.style.border = '1px solid #ccc';
        inputElement.style.padding = '2px';
        rubrikElement.textContent = '';
        rubrikElement.appendChild(inputElement);
        inputElement.focus();
        inputElement.select();
        
        function saveRubrik() {
            var newRubrik = inputElement.value.trim();
            if (newRubrik === '') {
                newRubrik = 'Rubrik'; // Default text if empty
            }
            console.log('Saving rubrik:', newRubrik);
            rubrikElement.textContent = newRubrik;
            localStorage.setItem('dashboardRubrik', newRubrik);
            console.log('Rubrik saved to localStorage');
            setRubrikColor(); // Update color after text change
        }
        
        inputElement.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveRubrik();
            }
        });
        
        inputElement.addEventListener('blur', function() {
            saveRubrik();
        });
    });

    // Populate links when the page loads
    populateLinks();

    // Get weather when page loads
    getWeather();

    // Get quote of the day when page loads
    getQuoteOfTheDay();

    // Initialize notes functionality
    initializeNotes();

    // Handle form submission to add new link
    document.getElementById('addLinkForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        // Get the values of the URL and Link Text input fields
        var linkUrl = document.getElementById('linkUrl').value.trim();
        var linkText = document.getElementById('linkText').value.trim();

        // Check if both fields are not empty
        if (linkUrl !== '' && linkText !== '') {
            // Get links from localStorage or initialize an empty array
            var storedLinks = JSON.parse(localStorage.getItem('dashboardLinks')) || [];

            // Add the new link to storedLinks array
            storedLinks.push({ url: linkUrl, text: linkText });

            // Update localStorage
            localStorage.setItem('dashboardLinks', JSON.stringify(storedLinks));

            // Populate links again
            populateLinks();

            // Clear the input fields
            document.getElementById('linkUrl').value = '';
            document.getElementById('linkText').value = '';
            
            // Hide the form after successful submission
            document.getElementById('addLinkForm').style.display = 'none';
        } else {
            alert('Please provide both URL and Link Text.');
        }
    });

    // Handle "+" button click to show form
    document.getElementById('addLinkBtn').addEventListener('click', function() {
        const form = document.getElementById('addLinkForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        
        // Focus on first input when form is shown
        if (form.style.display === 'block') {
            document.getElementById('linkUrl').focus();
        }
    });

    // Handle cancel button click to hide form
    document.getElementById('cancelLinkBtn').addEventListener('click', function() {
        document.getElementById('addLinkForm').style.display = 'none';
        // Clear the input fields when canceling
        document.getElementById('linkUrl').value = '';
        document.getElementById('linkText').value = '';
    });
}

// Function to set rubrik text color based on background
function setRubrikColor() {
    // Get the rubrik element
    var rubrikElement = document.getElementById('rubrik');
    
    // Only proceed if the element exists and has content
    if (!rubrikElement || !rubrikElement.textContent.trim()) {
        return;
    }
    
    // Get the position and dimensions of the rubrik element
    var rect = rubrikElement.getBoundingClientRect();
    
    // Get the background color of the element behind the rubrik
    var backgroundColor = window.getComputedStyle(document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2)).backgroundColor;
    
    // Set the text color based on the background color brightness
    rubrikElement.style.color = isDarkColor(backgroundColor) ? '#ffffff' : '#000000';
}

// Function to determine if a color is dark or light
function isDarkColor(color) {
    // Convert the color to RGB components
    var rgb = color.match(/\d+/g).map(Number);
    // Calculate the perceived brightness
    var brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    // Return true if the brightness is less than 128, indicating a dark color
    return brightness < 128;
}

// Update clock function
function updateClock() {
    var now = new Date();
    var date = now.toDateString();
    var time = now.toLocaleTimeString();
    var clockElement = document.getElementById('clock');
    clockElement.textContent = date + ' ' + time;
}

// Load saved rubrik from localStorage
function loadSavedRubrik() {
    console.log('Loading saved rubrik...');
    var savedRubrik = localStorage.getItem('dashboardRubrik');
    console.log('Saved rubrik from localStorage:', savedRubrik);
    
    if (savedRubrik) {
        var rubrikElement = document.getElementById('rubrik');
        if (rubrikElement) {
            console.log('Setting rubrik text to:', savedRubrik);
            rubrikElement.textContent = savedRubrik;
            // Update color after loading the text
            setTimeout(function() {
                setRubrikColor();
            }, 50);
        } else {
            console.log('Rubrik element not found');
        }
    } else {
        console.log('No saved rubrik found in localStorage');
    }
}

function populateLinks() {
    // Get links from localStorage or initialize an empty array
    var storedLinks = JSON.parse(localStorage.getItem('dashboardLinks')) || [];

    // Get the userLinks ul element
    var userLinksList = document.getElementById('userLinks');

    // Clear existing links
    userLinksList.innerHTML = '';

    // Populate links from storedLinks
    storedLinks.forEach(function(link) {
        var listItem = document.createElement('li');
        var linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.textContent = link.text;
        linkElement.target = "_blank"; // Open link in a new tab

        // Append a delete button for each link
        var deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.className = 'delete-link-btn';
        deleteButton.title = 'Delete link';
        deleteButton.addEventListener('click', function() {
            // Remove the link from storedLinks
            storedLinks = storedLinks.filter(function(item) {
                return item.url !== link.url;
            });
            // Update localStorage
            localStorage.setItem('dashboardLinks', JSON.stringify(storedLinks));
            // Repopulate links
            populateLinks();
        });

        // Create a container for the link and button
        var linkContainer = document.createElement('div');
        linkContainer.className = 'link-container';
        linkContainer.appendChild(linkElement);
        linkContainer.appendChild(deleteButton);
        
        // Append the container to the list item
        listItem.appendChild(linkContainer);

        // Append the list item to the userLinksList
        userLinksList.appendChild(listItem);
    });
}

// Add this function to your Script.js
function getWeather() {
    console.log('Fetching weather data...');
    
    // Check if user has set a manual location preference
    const manualLocation = localStorage.getItem('manualLocation');
    if (manualLocation) {
        const locationData = JSON.parse(manualLocation);
        console.log('Using manual location:', locationData.city);
        fetchWeatherData(locationData.lat, locationData.lon, locationData.city);
        return;
    }
    
    // Check if geolocation is supported
    if (navigator.geolocation) {
        console.log('Getting user location...');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log('Location found:', lat, lon);
                fetchWeatherData(lat, lon);
            },
            function(error) {
                console.log('Location access denied or failed:', error.message);
                // Fallback to Stockholm, Sweden coordinates
                console.log('Using fallback location (Stockholm)');
                const lat = 59.3293;
                const lon = 18.0686;
                fetchWeatherData(lat, lon);
            }
        );
    } else {
        console.log('Geolocation not supported by browser');
        // Fallback to Stockholm, Sweden coordinates
        const lat = 59.3293;
        const lon = 18.0686;
        fetchWeatherData(lat, lon);
    }
}

// Function to set manual location
function setManualLocation(city, lat, lon) {
    const locationData = {
        city: city,
        lat: lat,
        lon: lon
    };
    localStorage.setItem('manualLocation', JSON.stringify(locationData));
    console.log('Manual location set to:', city);
    // Refresh weather with new location
    fetchWeatherData(lat, lon, city);
}

// Function to clear manual location and use GPS again
function clearManualLocation() {
    localStorage.removeItem('manualLocation');
    console.log('Manual location cleared, using GPS location');
    getWeather();
}

function fetchWeatherData(lat, lon, manualCity = null) {
    // Get weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=2`;
    
    // If manual city is provided, use it directly
    if (manualCity) {
        fetch(weatherUrl)
        .then(response => response.json())
        .then(weatherData => {
            console.log('Weather data received for manual location:', weatherData);
            displayWeather(weatherData, manualCity);
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            document.getElementById('weatherContent').innerHTML = '<p>Error loading weather</p>';
        });
        return;
    }
    
    // Otherwise use geocoding to detect city name
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    
    // Fetch both weather and location data
    Promise.all([
        fetch(weatherUrl).then(response => response.json()),
        fetch(geocodeUrl).then(response => response.json())
    ])
    .then(([weatherData, locationData]) => {
        console.log('Weather data received:', weatherData);
        console.log('Location data received:', locationData);
        
        // Try to get the most appropriate city name from OpenStreetMap data
        const address = locationData.address;
        const city = address?.city || 
                    address?.town || 
                    address?.municipality || 
                    address?.village || 
                    address?.county || 
                    locationData.display_name?.split(',')[0] ||
                    'Unknown Location';
        
        console.log('Detected city:', city);
        console.log('Full address:', address);
        
        displayWeather(weatherData, city);
    })
    .catch(error => {
        console.error('Error fetching weather or location:', error);
        document.getElementById('weatherContent').innerHTML = '<p>Error loading weather</p>';
    });
}

function displayWeather(data, city) {
    const current = data.current_weather;
    const daily = data.daily;
    
    // Get weather descriptions for today and tomorrow
    const todayWeatherDescription = getWeatherDescription(current.weathercode);
    const tomorrowWeatherDescription = getWeatherDescription(daily.weathercode[1]);
    
    const weatherHTML = `
        <div class="weather-container">
            <h4 id="cityName" class="weather-city-name" title="Click to change location">${city}</h4>
            
            <div class="weather-today-section">
                <div class="weather-today-left">
                    <p class="weather-day-title">Today</p>
                    <p class="weather-description">${todayWeatherDescription}</p>
                    <p class="weather-detail">Wind: ${Math.round(current.windspeed)} km/h</p>
                    <p class="weather-detail">
                        H: ${Math.round(daily.temperature_2m_max[0])}° / 
                        L: ${Math.round(daily.temperature_2m_min[0])}°
                    </p>
                </div>
                <div class="weather-today-right">
                    <div class="weather-temperature-main">${Math.round(current.temperature)}°</div>
                </div>
            </div>
            
            <div class="weather-day-section tomorrow">
                <p class="weather-day-title">Tomorrow</p>
                <p class="weather-description">${tomorrowWeatherDescription}</p>
                <p class="weather-detail">
                    High: ${Math.round(daily.temperature_2m_max[1])}° / 
                    Low: ${Math.round(daily.temperature_2m_min[1])}°
                </p>
            </div>
        </div>
    `;
    
    document.getElementById('weatherContent').innerHTML = weatherHTML;
    
    // Add click event to city name
    document.getElementById('cityName').addEventListener('click', function() {
        showCitySelector();
    });
}

// Function to show city selector
function showCitySelector() {
    const cities = [
        { name: 'Use GPS Location', lat: null, lon: null },
        { name: 'Varberg', lat: 57.1057, lon: 12.2504 },
        { name: 'Göteborg', lat: 57.7089, lon: 11.9746 },
        { name: 'Stockholm', lat: 59.3293, lon: 18.0686 },
        { name: 'Malmö', lat: 55.6050, lon: 13.0038 },
        { name: 'Uppsala', lat: 59.8586, lon: 17.6389 },
        { name: 'Linköping', lat: 58.4108, lon: 15.6214 }
    ];
    
    // Create dropdown HTML
    let optionsHTML = '';
    cities.forEach(city => {
        optionsHTML += `<option value="${city.name}" data-lat="${city.lat}" data-lon="${city.lon}">${city.name}</option>`;
    });
    
    const selectorHTML = `
        <div class="city-selector-container">
            <p class="city-selector-prompt">Choose your location:</p>
            <select id="citySelector" class="city-selector-dropdown">
                ${optionsHTML}
            </select>
            <br>
            <button id="selectCityBtn" class="city-selector-btn">Select</button>
            <button id="cancelCityBtn" class="city-selector-btn">Cancel</button>
        </div>
    `;
    
    document.getElementById('weatherContent').innerHTML = selectorHTML;
    
    // Add event listeners
    document.getElementById('selectCityBtn').addEventListener('click', function() {
        const selector = document.getElementById('citySelector');
        const selectedOption = selector.options[selector.selectedIndex];
        const cityName = selectedOption.value;
        const lat = selectedOption.getAttribute('data-lat');
        const lon = selectedOption.getAttribute('data-lon');
        
        if (cityName === 'Use GPS Location') {
            clearManualLocation();
        } else {
            setManualLocation(cityName, parseFloat(lat), parseFloat(lon));
        }
    });
    
    document.getElementById('cancelCityBtn').addEventListener('click', function() {
        getWeather(); // Reload current weather
    });
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail'
    };
    
    return weatherCodes[code] || 'Unknown';
}

// Quote of the Day functionality
function getQuoteOfTheDay() {
    console.log('Fetching quote of the day...');
    
    // Check if we have a quote cached for today
    const today = new Date().toDateString();
    const cachedQuote = localStorage.getItem('dailyQuote');
    const cachedDate = localStorage.getItem('dailyQuoteDate');
    
    if (cachedQuote && cachedDate === today) {
        console.log('Using cached quote for today');
        displayQuote(JSON.parse(cachedQuote));
        return;
    }
    
    // Fetch new quote from API
    fetch('https://zenquotes.io/api/random')
        .then(response => response.json())
        .then(data => {
            console.log('Quote data received:', data);
            
            // ZenQuotes returns an array, so we take the first item
            const quoteData = {
                content: data[0].q,
                author: data[0].a
            };
            
            // Cache the quote for today
            localStorage.setItem('dailyQuote', JSON.stringify(quoteData));
            localStorage.setItem('dailyQuoteDate', today);
            
            displayQuote(quoteData);
        })
        .catch(error => {
            console.error('Error fetching quote:', error);
            // Fallback quote if API fails
            const fallbackQuote = {
                content: "The only way to do great work is to love what you do.",
                author: "Steve Jobs"
            };
            displayQuote(fallbackQuote);
        });
}

function displayQuote(quoteData) {
    const quoteHTML = `
        <div class="quote-container">
            <blockquote class="quote-text">"${quoteData.content}"</blockquote>
            <cite class="quote-author">— ${quoteData.author}</cite>
            <button id="refreshQuoteBtn" class="refresh-quote-btn" title="Get new quote">🔄</button>
        </div>
    `;
    
    document.getElementById('quoteContent').innerHTML = quoteHTML;
    
    // Add click event to refresh button
    document.getElementById('refreshQuoteBtn').addEventListener('click', function() {
        getNewQuote();
    });
}

function getNewQuote() {
    console.log('Fetching new quote...');
    document.getElementById('quoteContent').innerHTML = '<p>Loading new quote...</p>';
    
    fetch('https://zenquotes.io/api/random')
        .then(response => response.json())
        .then(data => {
            console.log('New quote data received:', data);
            
            // ZenQuotes returns an array, so we take the first item
            const quoteData = {
                content: data[0].q,
                author: data[0].a
            };
            
            // Update cache with new quote
            const today = new Date().toDateString();
            localStorage.setItem('dailyQuote', JSON.stringify(quoteData));
            localStorage.setItem('dailyQuoteDate', today);
            
            displayQuote(quoteData);
        })
        .catch(error => {
            console.error('Error fetching new quote:', error);
            // Fallback quote if API fails
            const fallbackQuote = {
                content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                author: "Winston Churchill"
            };
            displayQuote(fallbackQuote);
        });
}

// Notes functionality - Simple auto-save textarea
function initializeNotes() {
    console.log('Initializing simple notes functionality...');
    
    const notesTextarea = document.getElementById('notesTextarea');
    
    // Load saved notes from localStorage
    const savedNotes = localStorage.getItem('dashboardNotes');
    if (savedNotes) {
        notesTextarea.value = savedNotes;
        console.log('Loaded saved notes from localStorage');
    }
    
    // Auto-save as user types
    notesTextarea.addEventListener('input', function() {
        localStorage.setItem('dashboardNotes', notesTextarea.value);
        console.log('Notes auto-saved to localStorage');
    });
    
    // Also save on blur (when user clicks away)
    notesTextarea.addEventListener('blur', function() {
        localStorage.setItem('dashboardNotes', notesTextarea.value);
        console.log('Notes saved on blur');
    });

    // Initialize custom scroll arrows for all scrollable elements
    initializeScrollArrows();
}

// Custom Scroll Arrow System
function initializeScrollArrows() {
    console.log('Initializing custom scroll arrows...');
    
    // Find all scrollable elements (both vertical and horizontal)
    const verticalScrollElements = document.querySelectorAll('.boxContent, .infoContainer');
    const horizontalScrollElements = document.querySelectorAll('.container');
    
    verticalScrollElements.forEach(element => {
        createVerticalScrollArrows(element);
    });
    
    horizontalScrollElements.forEach(element => {
        createHorizontalScrollArrows(element);
    });
}

function createVerticalScrollArrows(scrollableElement) {
    // Create up arrow
    const upArrow = document.createElement('div');
    upArrow.className = 'scroll-arrow scroll-arrow-up';
    upArrow.innerHTML = '▲';
    upArrow.title = 'Scroll up';
    
    // Create down arrow
    const downArrow = document.createElement('div');
    downArrow.className = 'scroll-arrow scroll-arrow-down';
    downArrow.innerHTML = '▼';
    downArrow.title = 'Scroll down';
    
    // Get the parent container
    const container = scrollableElement.parentElement;
    
    // Make sure container has relative positioning
    if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }
    
    // Add arrows to the container
    container.appendChild(upArrow);
    container.appendChild(downArrow);
    
    // Add click event listeners
    upArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollUp(scrollableElement);
    });
    
    downArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollDown(scrollableElement);
    });
    
    // Update arrow visibility based on scroll position
    function updateArrowVisibility() {
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
        
        // Hide up arrow if at top
        upArrow.style.display = scrollTop <= 0 ? 'none' : 'flex';
        
        // Hide down arrow if at bottom
        downArrow.style.display = scrollTop >= scrollHeight - clientHeight - 1 ? 'none' : 'flex';
    }
    
    // Update visibility on scroll
    scrollableElement.addEventListener('scroll', updateArrowVisibility);
    
    // Initial visibility update
    updateArrowVisibility();
}

function createHorizontalScrollArrows(scrollableElement) {
    // Create left arrow
    const leftArrow = document.createElement('div');
    leftArrow.className = 'scroll-arrow scroll-arrow-left';
    leftArrow.innerHTML = '◀';
    leftArrow.title = 'Scroll left';
    
    // Create right arrow
    const rightArrow = document.createElement('div');
    rightArrow.className = 'scroll-arrow scroll-arrow-right';
    rightArrow.innerHTML = '▶';
    rightArrow.title = 'Scroll right';
    
    // Add arrows directly to the scrollable element since container is the scrollable element
    scrollableElement.appendChild(leftArrow);
    scrollableElement.appendChild(rightArrow);
    
    // Add click event listeners
    leftArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollLeft(scrollableElement);
    });
    
    rightArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollRight(scrollableElement);
    });
    
    // Update arrow visibility based on scroll position
    function updateArrowVisibility() {
        const { scrollLeft, scrollWidth, clientWidth } = scrollableElement;
        
        // Hide left arrow if at leftmost position
        leftArrow.style.display = scrollLeft <= 0 ? 'none' : 'flex';
        
        // Hide right arrow if at rightmost position
        rightArrow.style.display = scrollLeft >= scrollWidth - clientWidth - 1 ? 'none' : 'flex';
    }
    
    // Update visibility on scroll
    scrollableElement.addEventListener('scroll', updateArrowVisibility);
    
    // Initial visibility update
    updateArrowVisibility();
}

function scrollUp(element) {
    const scrollAmount = element.clientHeight * 0.3; // Scroll 30% of visible height
    element.scrollBy({
        top: -scrollAmount,
        behavior: 'smooth'
    });
}

function scrollDown(element) {
    const scrollAmount = element.clientHeight * 0.3; // Scroll 30% of visible height
    element.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
    });
}

function scrollLeft(element) {
    const scrollAmount = element.clientWidth * 0.3; // Scroll 30% of visible width
    element.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
}

function scrollRight(element) {
    const scrollAmount = element.clientWidth * 0.3; // Scroll 30% of visible width
    element.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}