// CIVICVIEW - Tailwind V4 Compatible JavaScript

// Initialize Lucide icons and global variables
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    initializePage();
});

// Global navigation functions
function setCurrentPage(page) {
    const pageMap = {
        'home': 'index.html',
        'about': 'aboutus.html',
        'contact': 'contactus.html',
        'get-started': 'getstarted.html'
    };
    
    if (pageMap[page]) {
        window.location.href = pageMap[page];
    }
}

// Global utility functions
function redirectToGetStarted() {
    window.location.href = 'getstarted.html';
}

function handleReportIssue() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('civicview_current_user');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            if (userData.portalType === 'citizen') {
                window.location.href = 'report.html';
                return;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
    
    // User not logged in or not a citizen, set pending flag and redirect to get started
    localStorage.setItem('civicview_pending_report_issue', 'true');
    window.location.href = 'getstarted.html';
}

function logout() {
    localStorage.removeItem('civicview_current_user');
    localStorage.removeItem('civicview_pending_report_issue');
    
    // Dispatch custom event for auth change
    window.dispatchEvent(new CustomEvent('civicview-auth-change'));
    window.location.href = 'index.html';
}

// Dashboard navigation function
function goToDashboard() {
    const currentUser = localStorage.getItem('civicview_current_user');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            if (userData.portalType === 'citizen') {
                window.location.href = 'citizen.html';
            } else if (userData.portalType === 'admin') {
                window.location.href = 'admin.html';
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            window.location.href = 'getstarted.html';
        }
    } else {
        window.location.href = 'getstarted.html';
    }
}

// Update header buttons based on login status
function updateHeaderButtons() {
    const currentUser = localStorage.getItem('civicview_current_user');
    const isLoggedIn = currentUser !== null;
    
    // Desktop buttons
    const dashboardBtn = document.getElementById('dashboard-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const getStartedBtn = document.getElementById('get-started-btn');
    
    // Mobile buttons
    const mobileDashboardBtn = document.getElementById('mobile-dashboard-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const mobileGetStartedBtn = document.getElementById('mobile-get-started-btn');
    
    if (isLoggedIn) {
        // Show dashboard and logout buttons
        if (dashboardBtn) dashboardBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (getStartedBtn) getStartedBtn.classList.add('hidden');
        if (mobileDashboardBtn) mobileDashboardBtn.classList.remove('hidden');
        if (mobileLogoutBtn) mobileLogoutBtn.classList.remove('hidden');
        if (mobileGetStartedBtn) mobileGetStartedBtn.classList.add('hidden');
    } else {
        // Show get started button
        if (dashboardBtn) dashboardBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (getStartedBtn) getStartedBtn.classList.remove('hidden');
        if (mobileDashboardBtn) mobileDashboardBtn.classList.add('hidden');
        if (mobileLogoutBtn) mobileLogoutBtn.classList.add('hidden');
        if (mobileGetStartedBtn) mobileGetStartedBtn.classList.remove('hidden');
    }
}

// Counter animation for stats with enhanced effects
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-target')) || 0;
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const currentValue = Math.floor(targetValue * progress);
            
            counter.textContent = currentValue.toLocaleString();
            
            if (currentStep >= steps) {
                clearInterval(interval);
                counter.textContent = targetValue.toLocaleString();
            }
        }, stepDuration);
    });
}

// Auto-scroll functionality for complaint types with enhanced UX
function initComplaintTypesScroll() {
    const scrollContainer = document.getElementById('complaint-types-scroll');
    if (!scrollContainer) return;
    
    let isScrolling = false;
    let scrollDirection = 1;
    let scrollInterval;
    
    function autoScroll() {
        if (isScrolling) return;
        
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        if (scrollContainer.scrollLeft >= maxScroll) {
            scrollDirection = -1;
        } else if (scrollContainer.scrollLeft <= 0) {
            scrollDirection = 1;
        }
        
        scrollContainer.scrollBy({
            left: scrollDirection * 2,
            behavior: 'smooth'
        });
    }
    
    // Start auto-scroll
    scrollInterval = setInterval(autoScroll, 50);
    
    // Pause auto-scroll on hover
    scrollContainer.addEventListener('mouseenter', () => {
        isScrolling = true;
        if (scrollInterval) {
            clearInterval(scrollInterval);
        }
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        isScrolling = false;
        setTimeout(() => {
            if (!isScrolling) {
                scrollInterval = setInterval(autoScroll, 50);
            }
        }, 1000);
    });
    
    // Add click handlers for complaint type cards
    const complaintCards = scrollContainer.querySelectorAll('.group');
    complaintCards.forEach(card => {
        card.addEventListener('click', () => {
            handleReportIssue();
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Get Started Page Functions
let currentPortal = null;
let currentTab = 'login';
let formData = {
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: ''
};
let showPassword = {};

function selectPortal(portalType) {
    currentPortal = portalType;
    
    const portalSelection = document.getElementById('portalSelection');
    const authForms = document.getElementById('authForms');
    const portalIcon = document.getElementById('portalIcon');
    const portalTitle = document.getElementById('portalTitle');
    const portalDescription = document.getElementById('portalDescription');
    const employeeIdField = document.getElementById('employeeIdField');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const signupSubmitBtn = document.getElementById('signupSubmitBtn');
    
    if (portalSelection && authForms) {
        portalSelection.classList.add('hidden');
        authForms.classList.remove('hidden');
    }
    
    if (portalIcon && portalTitle && portalDescription) {
        if (portalType === 'citizen') {
            portalIcon.innerHTML = '<div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center"><i data-lucide="users" class="w-8 h-8 text-blue-600"></i></div>';
            portalTitle.textContent = 'Citizen Portal';
            portalDescription.textContent = 'Access your citizen dashboard';
            
            // Hide employee ID field for citizens
            if (employeeIdField) employeeIdField.classList.add('hidden');
            
            // Update button styles for citizen
            if (loginSubmitBtn) {
                loginSubmitBtn.className = 'w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300';
                loginSubmitBtn.textContent = 'Login to Citizen Portal';
            }
            if (signupSubmitBtn) {
                signupSubmitBtn.className = 'w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300';
                signupSubmitBtn.textContent = 'Create Citizen Account';
            }
        } else {
            portalIcon.innerHTML = '<div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center"><i data-lucide="shield" class="w-8 h-8 text-green-600"></i></div>';
            portalTitle.textContent = 'Admin Portal';
            portalDescription.textContent = 'Access administrative dashboard';
            
            // Show employee ID field for admin
            if (employeeIdField) employeeIdField.classList.remove('hidden');
            
            // Update button styles for admin
            if (loginSubmitBtn) {
                loginSubmitBtn.className = 'w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300';
                loginSubmitBtn.textContent = 'Login to Admin Portal';
            }
            if (signupSubmitBtn) {
                signupSubmitBtn.className = 'w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300';
                signupSubmitBtn.textContent = 'Create Admin Account';
            }
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    resetAuthForms();
}

function switchTab(tab) {
    currentTab = tab;
    
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (tab === 'login') {
        if (loginTab) {
            loginTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 bg-white text-gray-900 shadow-sm';
        }
        if (signupTab) {
            signupTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-700';
        }
        if (loginForm) loginForm.classList.remove('hidden');
        if (signupForm) signupForm.classList.add('hidden');
    } else {
        if (signupTab) {
            signupTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 bg-white text-gray-900 shadow-sm';
        }
        if (loginTab) {
            loginTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-700';
        }
        if (signupForm) signupForm.classList.remove('hidden');
        if (loginForm) loginForm.classList.add('hidden');
    }
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            input.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function goBack() {
    const portalSelection = document.getElementById('portalSelection');
    const authForms = document.getElementById('authForms');
    
    if (portalSelection && authForms) {
        portalSelection.classList.remove('hidden');
        authForms.classList.add('hidden');
        currentPortal = null;
    }
    
    resetAuthForms();
}

function resetAuthForms() {
    // Reset form data
    formData = {
        email: '',
        password: '',
        confirmPassword: '',
        employeeId: ''
    };
    showPassword = {};
    
    // Reset form fields
    const forms = document.querySelectorAll('#loginForm, #signupForm');
    forms.forEach(form => {
        if (form) form.reset();
    });
    
    // Reset to login tab
    currentTab = 'login';
    switchTab('login');
    
    // Reset password visibility
    const passwordInputs = document.querySelectorAll('input[type="text"][id*="password"], input[type="password"]');
    passwordInputs.forEach(input => {
        input.type = 'password';
    });
    
    const eyeIcons = document.querySelectorAll('[data-lucide="eye-off"]');
    eyeIcons.forEach(icon => {
        icon.setAttribute('data-lucide', 'eye');
    });
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function checkExistingLogin() {
    const currentUser = localStorage.getItem('civicview_current_user');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            return userData.portalType;
        } catch {
            return null;
        }
    }
    return null;
}

// Check for existing login
function checkExistingLogin() {
    const currentUser = localStorage.getItem('civicview_current_user');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            return userData.portalType;
        } catch {
            return null;
        }
    }
    return null;
}

// Enhanced Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    if (!currentPortal) {
        alert('Please select a portal type first.');
        return;
    }
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    const employeeId = document.getElementById('employeeId')?.value;
    
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Validate admin fields
    if (currentPortal === 'admin' && !employeeId?.trim()) {
        alert('Please enter your employee ID.');
        return;
    }
    
    // Check for existing opposite portal login
    const existingLogin = checkExistingLogin();
    const oppositePortal = currentPortal === 'citizen' ? 'admin' : 'citizen';
    
    if (existingLogin === oppositePortal) {
        alert(`A ${oppositePortal} user is currently logged in. Please logout first to access the ${currentPortal} portal.`);
        return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton?.innerHTML;
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 inline mr-2 animate-spin"></i>Logging in...';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create user data
        const userData = {
            email: email,
            portalType: currentPortal,
            firstName: currentPortal === 'citizen' ? 'Citizen' : 'Admin',
            lastName: 'User',
            loginTime: new Date().toISOString(),
            ...(currentPortal === 'admin' && { employeeId: employeeId })
        };
        
        // Store user data
        localStorage.setItem('civicview_current_user', JSON.stringify(userData));
        
        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('civicview-auth-change'));
        
        // Check if user should go to report issue directly
        const pendingReportIssue = localStorage.getItem('civicview_pending_report_issue') === 'true';
        if (pendingReportIssue && currentPortal === 'citizen') {
            localStorage.removeItem('civicview_pending_report_issue');
            window.location.href = 'report.html';
        } else {
            // Navigate to appropriate dashboard
            window.location.href = currentPortal === 'citizen' ? 'citizen.html' : 'admin.html';
        }
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
        
        if (submitButton && originalText) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    if (!currentPortal) {
        alert('Please select a portal type first.');
        return;
    }
    
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
    if (!email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    // Check for existing opposite portal login
    const existingLogin = checkExistingLogin();
    const oppositePortal = currentPortal === 'citizen' ? 'admin' : 'citizen';
    
    if (existingLogin === oppositePortal) {
        alert(`A ${oppositePortal} user is currently logged in. Please logout first to access the ${currentPortal} portal.`);
        return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton?.innerHTML;
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 inline mr-2 animate-spin"></i>Creating account...';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create user data
        const userData = {
            email: email,
            portalType: currentPortal,
            firstName: currentPortal === 'citizen' ? 'Citizen' : 'Admin',
            lastName: 'User',
            loginTime: new Date().toISOString()
        };
        
        // Store user data
        localStorage.setItem('civicview_current_user', JSON.stringify(userData));
        
        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('civicview-auth-change'));
        
        // Check if user should go to report issue directly
        const shouldReportIssue = localStorage.getItem('civicview_pending_report_issue');
        if (shouldReportIssue === 'true' && currentPortal === 'citizen') {
            localStorage.removeItem('civicview_pending_report_issue');
            window.location.href = 'report.html';
        } else {
            // Navigate to appropriate dashboard
            window.location.href = currentPortal === 'citizen' ? 'citizen.html' : 'admin.html';
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        alert('Account creation failed. Please try again.');
        
        if (submitButton && originalText) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

// Dashboard Functions
function switchSection(section) {
    // Remove active class from all nav items
    document.querySelectorAll('[id^="nav-"]').forEach(item => {
        item.classList.remove('sidebar-active');
        item.classList.add('text-gray-700', 'hover:bg-gray-100');
    });
    
    // Add active class to current nav item
    const navItem = document.getElementById(`nav-${section}`);
    if (navItem) {
        navItem.classList.add('sidebar-active');
        navItem.classList.remove('text-gray-700', 'hover:bg-gray-100');
    }
    
    // Hide all sections
    const sections = ['my-reports-section', 'community-feed-section', 'profile-section'];
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) element.classList.add('hidden');
    });
    
    // Show current section
    const currentSectionElement = document.getElementById(`${section}-section`);
    if (currentSectionElement) {
        currentSectionElement.classList.remove('hidden');
    }
    
    if (section === 'community-feed') {
        loadCommunityFeed();
    }
}

function switchView(view) {
    // Remove active class from all nav items
    document.querySelectorAll('[id^="nav-"]').forEach(item => {
        item.classList.remove('sidebar-active');
        item.classList.add('text-gray-700', 'hover:bg-gray-100');
    });
    
    // Add active class to current nav item
    const navItem = document.getElementById(`nav-${view}`);
    if (navItem) {
        navItem.classList.add('sidebar-active');
        navItem.classList.remove('text-gray-700', 'hover:bg-gray-100');
    }
    
    // Hide all views
    const views = ['dashboard-view', 'reports-view', 'analytics-view'];
    views.forEach(viewId => {
        const element = document.getElementById(viewId);
        if (element) element.classList.add('hidden');
    });
    
    // Show current view
    const currentViewElement = document.getElementById(`${view}-view`);
    if (currentViewElement) {
        currentViewElement.classList.remove('hidden');
    }
    
    if (view === 'reports') {
        populateAllReportsTable();
    }
}

// Status and Priority Badge Functions
function getStatusBadge(status) {
    const statusMap = {
        'reported': 'Reported',
        'acknowledged': 'Acknowledged',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'rejected': 'Rejected'
    };
    
    return `<span class="status-${status} px-3 py-1 rounded-full text-sm font-medium">${statusMap[status]}</span>`;
}

function getPriorityBadge(priority) {
    const priorityMap = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'urgent': 'Urgent',
        'critical': 'Critical'
    };
    
    return `<span class="priority-${priority} px-3 py-1 rounded-full text-sm font-medium">${priorityMap[priority]}</span>`;
}

// Report Issue Form Functions
let currentStep = 1;
let selectedImage = null;
let imagePreview = null;
let showMapButton = false;

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 3) {
            currentStep++;
            updateStepDisplay();
            if (currentStep === 3) {
                populateReview();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Update step indicators
    for (let i = 1; i <= 3; i++) {
        const indicator = document.getElementById(`step${i}-indicator`);
        const line = document.getElementById(`step${i}-line`);
        
        if (indicator) {
            if (i < currentStep) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
                indicator.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
                if (line) line.classList.add('completed');
            } else if (i === currentStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
                indicator.textContent = i;
            } else {
                indicator.classList.remove('active', 'completed');
                indicator.textContent = i;
                if (line) line.classList.remove('completed');
            }
        }
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const title = document.getElementById('title');
        const category = document.getElementById('category');
        const description = document.getElementById('description');
        
        if (!title || !title.value.trim()) {
            alert('Please enter an issue title.');
            return false;
        }
        if (!category || !category.value) {
            alert('Please select a category.');
            return false;
        }
        if (!description || !description.value.trim()) {
            alert('Please provide a detailed description.');
            return false;
        }
    } else if (currentStep === 2) {
        const location = document.getElementById('location');
        const urgency = document.querySelector('input[name="urgency"]:checked');
        
        if (!location || !location.value.trim()) {
            alert('Please enter the location.');
            return false;
        }
        if (!urgency) {
            alert('Please select an urgency level.');
            return false;
        }
    }
    
    return true;
}

// Enhanced location input with "Report on Maps" button
function handleLocationInput(inputElement) {
    const locationInput = inputElement || document.getElementById('location');
    const mapButton = document.getElementById('mapButton');
    
    if (locationInput && mapButton) {
        const inputValue = locationInput.value.trim();
        
        if (inputValue.length >= 3 && !showMapButton) {
            showMapButton = true;
            mapButton.classList.remove('hidden');
            mapButton.classList.add('slide-up');
        } else if (inputValue.length < 3 && showMapButton) {
            showMapButton = false;
            mapButton.classList.add('hidden');
            mapButton.classList.remove('slide-up');
        }
    }
}

function reportOnMaps() {
    const locationInput = document.getElementById('location');
    if (locationInput && locationInput.value.trim()) {
        const location = encodeURIComponent(locationInput.value.trim());
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location}`;
        console.log('Opening Google Maps with URL:', mapsUrl);
        window.open(mapsUrl, '_blank');
    } else {
        console.error('No location entered or location input not found');
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('File size must be less than 10MB.');
            return;
        }
        
        selectedImage = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview = e.target.result;
            displayImagePreview();
        };
        reader.readAsDataURL(file);
    }
}

function displayImagePreview() {
    const uploadArea = document.getElementById('uploadArea');
    const previewArea = document.getElementById('imagePreview');
    
    if (uploadArea && previewArea) {
        uploadArea.classList.add('hidden');
        previewArea.classList.remove('hidden');
        
        previewArea.innerHTML = `
            <div class="image-preview">
                <img src="${imagePreview}" alt="Preview" class="max-w-full h-48 object-cover rounded-lg">
                <button type="button" class="remove-image" onclick="removeImage()">
                    <i data-lucide="x" class="w-3 h-3"></i>
                </button>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function removeImage() {
    selectedImage = null;
    imagePreview = null;
    
    const uploadArea = document.getElementById('uploadArea');
    const previewArea = document.getElementById('imagePreview');
    const imageUpload = document.getElementById('imageUpload');
    
    if (uploadArea && previewArea) {
        uploadArea.classList.remove('hidden');
        previewArea.classList.add('hidden');
        previewArea.innerHTML = '';
    }
    
    if (imageUpload) {
        imageUpload.value = '';
    }
}

function populateReview() {
    const title = document.getElementById('title')?.value;
    const category = document.getElementById('category')?.value;
    const description = document.getElementById('description')?.value;
    const location = document.getElementById('location')?.value;
    const urgency = document.querySelector('input[name="urgency"]:checked')?.value;
    
    // Update review section
    const reviewTitle = document.getElementById('reviewTitle');
    const reviewCategory = document.getElementById('reviewCategory');
    const reviewDescription = document.getElementById('reviewDescription');
    const reviewLocation = document.getElementById('reviewLocation');
    const reviewUrgency = document.getElementById('reviewUrgency');
    
    if (reviewTitle) reviewTitle.textContent = title || '';
    if (reviewCategory) reviewCategory.textContent = category || '';
    if (reviewDescription) reviewDescription.textContent = description || '';
    if (reviewLocation) reviewLocation.textContent = location || '';
    if (reviewUrgency) reviewUrgency.textContent = urgency || '';
    
    // Show image preview if available
    const reviewImageContainer = document.getElementById('reviewImageContainer');
    const reviewImage = document.getElementById('reviewImage');
    
    if (imagePreview && reviewImageContainer && reviewImage) {
        reviewImageContainer.classList.remove('hidden');
        reviewImage.src = imagePreview;
    } else if (reviewImageContainer) {
        reviewImageContainer.classList.add('hidden');
    }
}

function generateReportId() {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `CV-${currentYear}-${randomNum}`;
}

async function handleReportSubmission(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton?.innerHTML;
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 inline mr-2 animate-spin"></i>Submitting Report...';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    try {
        // Simulate API submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate report ID
        const reportId = generateReportId();
        
        // Store report data locally (in a real app, this would be sent to a server)
        const reportData = {
            id: reportId,
            title: document.getElementById('title')?.value,
            category: document.getElementById('category')?.value,
            description: document.getElementById('description')?.value,
            location: document.getElementById('location')?.value,
            urgency: document.querySelector('input[name="urgency"]:checked')?.value,
            image: imagePreview,
            status: 'reported',
            submittedAt: new Date().toISOString()
        };
        
        // Save to localStorage (in production, this would be an API call)
        const existingReports = JSON.parse(localStorage.getItem('user_reports') || '[]');
        existingReports.push(reportData);
        localStorage.setItem('user_reports', JSON.stringify(existingReports));
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        const reportIdSpan = document.getElementById('reportId');
        
        if (successModal && reportIdSpan) {
            reportIdSpan.textContent = reportId;
            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit report. Please try again.');
        
        if (submitButton && originalText) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('hidden');
        successModal.classList.remove('flex');
    }
    
    // Redirect to citizen dashboard
    window.location.href = 'citizen.html';
}

// Contact form handler
async function handleContactSubmission(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton?.innerHTML;
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 inline mr-2 animate-spin"></i>Sending...';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
        }
        
        // Reset form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.reset();
        }
        
        // Reset button
        submitButton.disabled = false;
        if (originalText) {
            submitButton.innerHTML = originalText;
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Modal Functions
function viewReport(reportId) {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function updateStatus(reportId) {
    const statusOptions = ['reported', 'acknowledged', 'in-progress', 'resolved', 'rejected'];
    const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    alert(`Report ${reportId} status updated to: ${newStatus}`);
}

// Authentication check
function checkAuth() {
    const userData = localStorage.getItem('civicview_current_user');
    if (!userData) {
        window.location.href = 'getstarted.html';
        return false;
    }
    
    try {
        const user = JSON.parse(userData);
        
        // Update user interface elements
        const userWelcome = document.getElementById('userWelcome');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const memberSince = document.getElementById('memberSince');
        
        if (userWelcome) {
            const firstName = user.firstName || (user.portalType === 'citizen' ? 'Citizen' : 'Admin');
            userWelcome.textContent = `Welcome, ${firstName}`;
        }
        
        if (profileName) {
            profileName.textContent = `${user.firstName || 'User'} ${user.lastName || ''}`;
        }
        
        if (profileEmail) {
            profileEmail.textContent = user.email;
        }
        
        if (memberSince && user.loginTime) {
            const loginDate = new Date(user.loginTime);
            memberSince.textContent = loginDate.toLocaleDateString();
        }
        
        return true;
    } catch (error) {
        window.location.href = 'getstarted.html';
        return false;
    }
}

// Data Loading Functions
function updateStats() {
    const reports = JSON.parse(localStorage.getItem('user_reports') || '[]');
    const stats = {
        total: reports.length,
        resolved: reports.filter(r => r.status === 'resolved').length,
        inProgress: reports.filter(r => r.status === 'in-progress').length,
        pending: reports.filter(r => r.status === 'reported').length
    };
    
    const totalReports = document.getElementById('totalReports');
    const resolvedReports = document.getElementById('resolvedReports');
    const inProgressReports = document.getElementById('inProgressReports');
    const pendingReports = document.getElementById('pendingReports');
    
    if (totalReports) totalReports.textContent = stats.total;
    if (resolvedReports) resolvedReports.textContent = stats.resolved;
    if (inProgressReports) inProgressReports.textContent = stats.inProgress;
    if (pendingReports) pendingReports.textContent = stats.pending;
}

function loadReports() {
    const reports = JSON.parse(localStorage.getItem('user_reports') || '[]');
    const reportsList = document.getElementById('reportsList');
    const noReports = document.getElementById('noReports');
    
    if (reports.length > 0 && reportsList) {
        reportsList.classList.remove('hidden');
        if (noReports) noReports.classList.add('hidden');
        
        reportsList.innerHTML = reports.map(report => `
            <div class="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i data-lucide="alert-triangle" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    ${getStatusBadge(report.status)}
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${report.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${report.description.substring(0, 100)}...</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>${new Date(report.submittedAt).toLocaleDateString()}</span>
                    <span>${report.location}</span>
                </div>
            </div>
        `).join('');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } else if (noReports) {
        if (reportsList) reportsList.classList.add('hidden');
        noReports.classList.remove('hidden');
    }
}

function loadCommunityFeed() {
    const communityFeed = document.getElementById('communityFeed');
    if (communityFeed) {
        communityFeed.innerHTML = getSampleCommunityFeedHTML();
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function populateRecentReportsTable() {
    const recentReportsTable = document.getElementById('recentReportsTable');
    if (recentReportsTable) {
        recentReportsTable.innerHTML = getSampleAdminReportsHTML();
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function populateAllReportsTable() {
    const allReportsTable = document.getElementById('allReportsTable');
    if (allReportsTable) {
        allReportsTable.innerHTML = getSampleAdminReportsHTML();
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function filterReports() {
    populateAllReportsTable();
}

// Sample data generators
function getSampleCommunityFeedHTML() {
    return `
        <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 border border-gray-200">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <i data-lucide="user" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="font-semibold text-gray-900">Priya Sharma</span>
                            <span class="text-sm text-gray-500">reported</span>
                            ${getStatusBadge('acknowledged')}
                        </div>
                        <h4 class="font-medium text-gray-900 mb-2">Water logging in Sector 12</h4>
                        <p class="text-gray-600 text-sm mb-3">Severe water logging issue during monsoon season affecting daily commute.</p>
                        <div class="flex items-center gap-4 text-sm text-gray-500">
                            <span>3 hours ago</span>
                            <span>Noida, UP</span>
                            <button class="text-blue-600 hover:text-blue-700">View Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getSampleAdminReportsHTML() {
    return `
        <tbody>
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CV-2024-123</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pothole on MG Road</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Priya Sharma</td>
                <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge('in-progress')}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getPriorityBadge('high')}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="viewReport('CV-2024-123')" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button onclick="updateStatus('CV-2024-123')" class="text-green-600 hover:text-green-900">Update</button>
                </td>
            </tr>
        </tbody>
    `;
}

// Initialize page-specific functionality
function initializePage() {
    const pathname = window.location.pathname;
    
    // Initialize common functionality
    initSmoothScrolling();
    updateHeaderButtons();
    
    // Page-specific initialization
    if (pathname.includes('index.html') || pathname === '/' || pathname === '') {
        initHomePage();
    }
    
    if (pathname.includes('getstarted.html')) {
        initGetStartedPage();
    }
    
    if (pathname.includes('citizen.html')) {
        initCitizenDashboard();
    }
    
    if (pathname.includes('admin.html')) {
        initAdminDashboard();
    }
    
    if (pathname.includes('report.html')) {
        initReportPage();
    }
    
    if (pathname.includes('aboutus.html')) {
        initAboutPage();
    }
    
    if (pathname.includes('contactus.html')) {
        initContactPage();
    }
}

function initHomePage() {
    initComplaintTypesScroll();
    
    // Initialize counter animation when stats section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.counter');
    if (statsSection) {
        observer.observe(statsSection.closest('.grid'));
    }
    
    // Set up modal handlers
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        // Close modal when clicking outside
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Set up form handler
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }
}

function initGetStartedPage() {
    // Check for pending report issue
    const pendingReportIssue = localStorage.getItem('civicview_pending_report_issue') === 'true';
    const headerDescription = document.getElementById('headerDescription');
    
    if (pendingReportIssue && headerDescription) {
        headerDescription.textContent = 
            'Login or create an account to report your civic issue and help improve your community.';
    }
    
    // Set up form handlers
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Initialize the default tab
    switchTab('login');
}

function initCitizenDashboard() {
    if (checkAuth()) {
        updateStats();
        loadReports();
    }
}

function initAdminDashboard() {
    if (checkAuth()) {
        populateRecentReportsTable();
        
        // Set up filter handlers
        const statusFilter = document.getElementById('statusFilter');
        const priorityFilter = document.getElementById('priorityFilter');
        const searchFilter = document.getElementById('searchFilter');
        
        if (statusFilter) statusFilter.addEventListener('change', filterReports);
        if (priorityFilter) priorityFilter.addEventListener('change', filterReports);
        if (searchFilter) searchFilter.addEventListener('input', filterReports);
        
        // Close modal when clicking outside
        const reportModal = document.getElementById('reportModal');
        if (reportModal) {
            reportModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
        }
    }
}

function initReportPage() {
    if (checkAuth()) {
        updateStepDisplay();
        
        // Set up form handler
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', handleReportSubmission);
        }
        
        // Set up location input handler
        const locationInput = document.getElementById('location');
        if (locationInput) {
            locationInput.addEventListener('input', handleLocationInput);
        }
        
        // Set up image upload handler
        const imageUpload = document.getElementById('imageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', handleImageUpload);
        }
        
        // Close success modal when clicking outside
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeSuccessModal();
                }
            });
        }
    }
}

function initReportPage() {
    if (checkAuth()) {
        updateStepDisplay();
        
        // Set up form handler
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', handleReportSubmission);
        }
        
        // Set up location input handler - already handled by oninput in HTML
        
        // Set up image upload handler
        const imageUpload = document.getElementById('imageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', handleImageUpload);
        }
        
        // Close success modal when clicking outside
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeSuccessModal();
                }
            });
        }
        
        // Initialize showMapButton variable for this page
        showMapButton = false;
    }
}

function initAboutPage() {
    // Add any about page specific functionality here
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function initContactPage() {
    // Set up contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Close success modal when clicking outside
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessModal();
            }
        });
    }
}
