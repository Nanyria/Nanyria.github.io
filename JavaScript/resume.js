// Resume page functionality - Tab-based navigation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize with Experience section active by default for main content
    showSection('experience');
    
    // Initialize mobile menu functionality
    initializeMobileMenu();
});

// Mobile menu functionality
function initializeMobileMenu() {
    // Check if mobile menu button already exists
    let menuButton = document.querySelector('.mobile-menu-button');
    const sectionNav = document.querySelector('.section-nav');
    
    if (!menuButton) {
        // Create a container for the mobile menu button and nav
        const menuContainer = document.createElement('div');
        menuContainer.className = 'mobile-menu-container';
        menuContainer.style.position = 'relative';
        
        // Create mobile menu button
        menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-button';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        menuButton.addEventListener('click', toggleMobileMenu);
        
        // Insert container before section nav and move elements
        sectionNav.parentNode.insertBefore(menuContainer, sectionNav);
        menuContainer.appendChild(menuButton);
        menuContainer.appendChild(sectionNav);
    }
    
    // Add mobile menu class to section nav
    if (sectionNav && !sectionNav.classList.contains('mobile-nav-menu')) {
        sectionNav.classList.add('mobile-nav-menu');
    }
    
    // Check screen size after a brief delay to ensure proper rendering
    setTimeout(() => {
        checkScreenSize();
    }, 100);
    
    // Listen for window resize
    window.addEventListener('resize', () => {
        setTimeout(checkScreenSize, 50);
    });
}

function checkScreenSize() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const sectionNav = document.querySelector('.section-nav');
    
    if (!menuButton || !sectionNav) return;
    
    // Check if navigation buttons would wrap to multiple lines
    const shouldUseMobileMenu = checkIfNavWouldWrap();
    
    console.log('checkScreenSize:', { shouldUseMobileMenu, windowWidth: window.innerWidth });
    
    if (shouldUseMobileMenu) {
        // Show menu button initially (will be hidden when header is created)
        menuButton.style.display = 'block';
        sectionNav.classList.add('mobile-hidden');
        sectionNav.classList.remove('mobile-open');
        // Force hide with inline style as backup
        sectionNav.style.display = 'none';
        
        console.log('Mobile mode: hiding nav, showing menu button');
        
        // Update section header for current active section
        const activeContent = document.querySelector('.content-area .section-content.active');
        if (activeContent) {
            const sectionName = activeContent.id.replace('-content', '');
            updateSectionHeader(sectionName);
        }
    } else {
        // Hide menu button, show nav normally
        menuButton.style.display = 'none';
        sectionNav.classList.remove('mobile-hidden', 'mobile-open');
        // Remove any inline display style
        sectionNav.style.display = '';
        
        console.log('Desktop mode: showing nav, hiding menu button');
        
        // Remove section headers on desktop
        const existingHeader = document.querySelector('.content-section-header');
        if (existingHeader) {
            existingHeader.remove();
        }
        
        // Restore original menu button visibility for desktop (should be hidden)
        menuButton.style.display = 'none';
    }
}

function checkIfNavWouldWrap() {
    const sectionNav = document.querySelector('.section-nav');
    if (!sectionNav) return false;
    
    // Get the parent container (the actual available space)
    const parentContainer = sectionNav.parentElement;
    const availableWidth = parentContainer.offsetWidth;
    
    // Temporarily ensure nav is in normal state for measurement
    const wasHidden = sectionNav.classList.contains('mobile-hidden');
    sectionNav.classList.remove('mobile-hidden', 'mobile-open');
    sectionNav.style.display = 'flex';
    sectionNav.style.position = 'absolute';
    sectionNav.style.visibility = 'hidden';
    sectionNav.style.top = '-9999px';
    
    // Force reflow
    sectionNav.offsetHeight;
    
    // Get total width needed for all buttons
    const buttons = sectionNav.querySelectorAll('.nav-button');
    let totalButtonWidth = 0;
    
    buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        const style = window.getComputedStyle(button);
        totalButtonWidth += rect.width + 
            parseFloat(style.marginLeft) + 
            parseFloat(style.marginRight);
    });
    
    // Restore original state
    sectionNav.style.position = '';
    sectionNav.style.visibility = '';
    sectionNav.style.top = '';
    sectionNav.style.display = '';
    if (wasHidden) sectionNav.classList.add('mobile-hidden');
    
    // Check if buttons would overflow (with buffer)
    const wouldWrap = totalButtonWidth > (availableWidth - 40);
    
    console.log('checkIfNavWouldWrap:', {
        availableWidth,
        totalButtonWidth,
        wouldWrap,
        difference: totalButtonWidth - availableWidth
    });
    
    return wouldWrap;
}

function toggleMobileMenu() {
    const sectionNav = document.querySelector('.section-nav');
    const menuButton = document.querySelector('.mobile-menu-button');
    
    if (sectionNav.classList.contains('mobile-open')) {
        sectionNav.classList.remove('mobile-open');
        sectionNav.classList.add('mobile-hidden');
        sectionNav.style.display = 'none';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        // Remove mobile headers when closing
        removeMobileHeaders();
    } else {
        sectionNav.classList.remove('mobile-hidden');
        sectionNav.classList.add('mobile-open');
        sectionNav.style.display = 'flex';
        menuButton.innerHTML = '<i class="fas fa-times"></i>';
        // Add mobile headers when opening
        addMobileHeaders();
    }
}

function addMobileHeaders() {
    // No longer adding mobile headers - original button content is sufficient
    return;
}

function removeMobileHeaders() {
    // No longer using mobile headers - nothing to remove
    return;
}

// Close mobile menu when a nav item is clicked
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
    
    // Add/update section header for mobile
    updateSectionHeader(sectionName);
    
    // Close mobile menu if open
    const sectionNav = document.querySelector('.section-nav');
    const menuButton = document.querySelector('.mobile-menu-button');
    if (sectionNav && sectionNav.classList.contains('mobile-open')) {
        sectionNav.classList.remove('mobile-open');
        if (menuButton) menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        removeMobileHeaders();
    }
}

function updateSectionHeader(sectionName) {
    // Check if we should be in mobile mode by testing if nav would wrap
    const shouldUseMobileMenu = checkIfNavWouldWrap();
    
    if (!shouldUseMobileMenu) {
        // Remove any existing section headers when in desktop mode
        const existingHeader = document.querySelector('.content-section-header');
        if (existingHeader) {
            existingHeader.remove();
        }
        // Ensure original menu button is hidden in desktop mode
        const menuButton = document.querySelector('.mobile-menu-button');
        if (menuButton) {
            menuButton.style.display = 'none';
        }
        return;
    }
    
    // Find the corresponding button to get its text and icon
    const targetButton = Array.from(document.querySelectorAll('.resume-main .nav-button')).find(button => 
        button.onclick.toString().includes(sectionName)
    );
    
    if (!targetButton) return;
    
    // Extract icon and text from the button
    const iconElement = targetButton.querySelector('i');
    const buttonText = targetButton.textContent.trim();
    const iconClass = iconElement ? iconElement.className : '';
    
    // Remove any existing section header
    const existingHeader = document.querySelector('.content-section-header');
    if (existingHeader) {
        existingHeader.remove();
    }
    
    // Hide the original menu button since we'll show one in the header
    const menuButton = document.querySelector('.mobile-menu-button');
    if (menuButton) {
        menuButton.style.display = 'none';
    }
    
    // Ensure nav is properly hidden in mobile mode
    const sectionNav = document.querySelector('.section-nav');
    if (sectionNav) {
        sectionNav.classList.add('mobile-hidden');
        sectionNav.classList.remove('mobile-open');
        sectionNav.style.display = 'none';
    }
    
    // Create new section header with mobile menu button
    const headerDiv = document.createElement('div');
    headerDiv.className = 'content-section-header';
    
    // Add mobile menu button to the left
    const headerMenuButton = document.createElement('button');
    headerMenuButton.className = 'header-menu-button';
    headerMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    headerMenuButton.addEventListener('click', toggleMobileMenu);
    headerDiv.appendChild(headerMenuButton);
    
    // Add section icon and title
    const sectionInfo = document.createElement('div');
    sectionInfo.className = 'section-info';
    
    if (iconClass) {
        const iconSpan = document.createElement('i');
        iconSpan.className = iconClass;
        sectionInfo.appendChild(iconSpan);
    }
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = buttonText;
    sectionInfo.appendChild(titleSpan);
    
    headerDiv.appendChild(sectionInfo);
    
    // Insert header at the beginning of content area
    const contentArea = document.querySelector('.content-area');
    contentArea.insertBefore(headerDiv, contentArea.firstChild);
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
