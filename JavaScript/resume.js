// Resume page functionality - Tab-based navigation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize with Experience section active by default for main content
    showSection('experience');
    // Initialize with About section active by default for sidebar
    showSidebarSection('about');
});

// Tab-based section navigation for main content area
function showSection(sectionName) {
    // Hide all content sections
    const allContents = document.querySelectorAll('.content-area .section-content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all main nav buttons
    const allButtons = document.querySelectorAll('.resume-main .nav-button');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected section
    const targetContent = document.getElementById(sectionName + '-content');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Add active class to the corresponding button
    const targetButton = Array.from(document.querySelectorAll('.resume-main .nav-button')).find(button => 
        button.onclick.toString().includes(sectionName)
    );
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

// Tab-based section navigation for sidebar content area
function showSidebarSection(sectionName) {
    // Hide all sidebar content sections
    const allSidebarContents = document.querySelectorAll('.sidebar-content-area .sidebar-section-content');
    allSidebarContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all sidebar nav buttons
    const allSidebarButtons = document.querySelectorAll('.sidebar-nav .nav-button');
    allSidebarButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected sidebar section
    const targetContent = document.getElementById(sectionName + '-content');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Add active class to the corresponding sidebar button
    const targetButton = Array.from(document.querySelectorAll('.sidebar-nav .nav-button')).find(button => 
        button.onclick.toString().includes(sectionName)
    );
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

// Print functionality - shows all sections for printing
function printResume() {
    // Store current active sections
    const currentActiveContent = document.querySelector('.content-area .section-content.active');
    const currentActiveButton = document.querySelector('.resume-main .nav-button.active');
    const currentActiveSidebarContent = document.querySelector('.sidebar-content-area .sidebar-section-content.active');
    const currentActiveSidebarButton = document.querySelector('.sidebar-nav .nav-button.active');
    
    // Show all main content sections for printing
    const allContents = document.querySelectorAll('.content-area .section-content');
    allContents.forEach(content => {
        content.classList.add('active');
    });
    
    // Show all sidebar content sections for printing
    const allSidebarContents = document.querySelectorAll('.sidebar-content-area .sidebar-section-content');
    allSidebarContents.forEach(content => {
        content.classList.add('active');
    });
    
    // Hide navigation buttons for printing
    const mainNav = document.querySelector('.resume-main .section-nav');
    const sidebarNav = document.querySelector('.sidebar-nav');
    mainNav.style.display = 'none';
    sidebarNav.style.display = 'none';
    
    // Trigger print
    window.print();
    
    // Restore original state after printing
    setTimeout(() => {
        // Hide all main content sections
        allContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Hide all sidebar content sections
        allSidebarContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Restore original active main content section
        if (currentActiveContent) {
            currentActiveContent.classList.add('active');
        }
        
        // Restore original active sidebar content section
        if (currentActiveSidebarContent) {
            currentActiveSidebarContent.classList.add('active');
        }
        
        // Restore original active buttons
        if (currentActiveButton) {
            currentActiveButton.classList.add('active');
        }
        
        if (currentActiveSidebarButton) {
            currentActiveSidebarButton.classList.add('active');
        }
        
        // Show navigation again
        mainNav.style.display = '';
        sidebarNav.style.display = '';
    }, 100);
}
