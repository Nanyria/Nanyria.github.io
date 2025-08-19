// Resume page functionality - Tab-based navigation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize with Experience section active by default
    showSection('experience');
});

// Tab-based section navigation
function showSection(sectionName) {
    // Hide all content sections
    const allContents = document.querySelectorAll('.content-area .section-content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const allButtons = document.querySelectorAll('.nav-button');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected section
    const targetContent = document.getElementById(sectionName + '-content');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Add active class to the corresponding button
    const targetButton = Array.from(document.querySelectorAll('.nav-button')).find(button => 
        button.onclick.toString().includes(sectionName)
    );
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

// Print functionality - shows all sections for printing
function printResume() {
    // Store current active section
    const currentActiveContent = document.querySelector('.content-area .section-content.active');
    const currentActiveButton = document.querySelector('.nav-button.active');
    
    // Show all sections for printing
    const allContents = document.querySelectorAll('.content-area .section-content');
    allContents.forEach(content => {
        content.classList.add('active');
    });
    
    // Hide navigation buttons for printing
    const nav = document.querySelector('.section-nav');
    nav.style.display = 'none';
    
    // Trigger print
    window.print();
    
    // Restore original state after printing
    setTimeout(() => {
        // Hide all sections
        allContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Restore original active section
        if (currentActiveContent) {
            currentActiveContent.classList.add('active');
        }
        
        // Restore original active button
        if (currentActiveButton) {
            currentActiveButton.classList.add('active');
        }
        
        // Show navigation again
        nav.style.display = '';
    }, 100);
}
