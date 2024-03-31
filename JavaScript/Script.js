window.onload = function() {
    // Function to fetch a random image from Unsplash API and set it as background
    function changeBackground() {
        fetch('https://api.unsplash.com/photos/random?client_id=5ZS-qKNhjJU1uXnZvX1FSMh2abiQ9K-oQapzmTJ2joU')
        .then(response => response.json())
        .then(data => {
            // Get the URL of the image
            const imageUrl = data.urls.regular;
            // Set the background of the body to the fetched image
            document.body.style.backgroundImage = `url(${imageUrl})`;
            // Set rubrik text color based on background
            setRubrikColor();
        })
        .catch(error => {
            console.error('Error fetching image from Unsplash API:', error);
        });
    }

    // Function to set rubrik text color based on background
    function setRubrikColor() {
        // Get the rubrik element
        var rubrikElement = document.getElementById('rubrik');
        // Get the computed style of the rubrik element
        var computedStyle = getComputedStyle(rubrikElement);
        // Get the position and dimensions of the rubrik element
        var rect = rubrikElement.getBoundingClientRect();
        // Get the background color of the element behind the rubrik
        var backgroundColor = window.getComputedStyle(document.elementFromPoint(rect.left, rect.top)).backgroundColor;
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

    // Add event listener to the footer to change background on click
    document.getElementById('footer').addEventListener('click', function() {
        changeBackground();
    });

    // Change background and rubrik text color when the page loads initially
    changeBackground();

    // Update clock function remains the same as before
    function updateClock() {
        var now = new Date();
        var date = now.toDateString();
        var time = now.toLocaleTimeString();
        var clockElement = document.getElementById('clock');
        clockElement.textContent = date + ' ' + time;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Make rubrik editable function remains the same as before
    var rubrikElement = document.getElementById('rubrik');
    rubrikElement.addEventListener('click', function() {
        var inputElement = document.createElement('input');
        inputElement.value = rubrikElement.textContent;
        rubrikElement.textContent = '';
        rubrikElement.appendChild(inputElement);
        inputElement.focus();
        inputElement.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var newRubrik = inputElement.value;
                rubrikElement.textContent = newRubrik;
                localStorage.setItem('dashboardRubrik', newRubrik);
            }
        });
    });
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
        deleteButton.textContent = 'Delete';
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

        // Append the link and delete button to the list item
        listItem.appendChild(linkElement);
        listItem.appendChild(deleteButton);

        // Append the list item to the userLinksList
        userLinksList.appendChild(listItem);
    });
}

// Populate links when the page loads
populateLinks();

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
    } else {
        alert('Please provide both URL and Link Text.');
    }
});