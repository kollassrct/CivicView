// CIVICVIEW - JavaScript Functions

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
            // If error, redirect to get started
            window.location.href = 'getstarted.html';
        }
    } else {
        // No user logged in, redirect to get started
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
        // Show dashboard and logout buttons, hide get started
        if (dashboardBtn) dashboardBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (getStartedBtn) getStartedBtn.classList.add('hidden');
        
        if (mobileDashboardBtn) mobileDashboardBtn.classList.remove('hidden');
        if (mobileLogoutBtn) mobileLogoutBtn.classList.remove('hidden');
        if (mobileGetStartedBtn) mobileGetStartedBtn.classList.add('hidden');
    } else {
        // Show get started button, hide dashboard and logout
        if (dashboardBtn) dashboardBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (getStartedBtn) getStartedBtn.classList.remove('hidden');
        
        if (mobileDashboardBtn) mobileDashboardBtn.classList.add('hidden');
        if (mobileLogoutBtn) mobileLogoutBtn.classList.add('hidden');
        if (mobileGetStartedBtn) mobileGetStartedBtn.classList.remove('hidden');
    }
}

// Counter animation for stats
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
            
            counter.textContent = currentValue.toLocaleString() + (targetValue > 999 ? '+' : '');
            
            if (currentStep >= steps) {
                clearInterval(interval);
                counter.textContent = targetValue.toLocaleString() + (targetValue > 999 ? '+' : '');
            }
        }, stepDuration);
    });
}

// Auto-scroll functionality for complaint types
function initComplaintTypesScroll() {
    const scrollContainer = document.getElementById('complaint-types-scroll');
    if (scrollContainer) {
        let isScrolling = false;
        let scrollTimeout;
        
        function autoScroll() {
            if (!isScrolling) {
                scrollContainer.scrollBy({
                    left: 320,
                    behavior: 'smooth'
                });
                
                // Reset scroll if at the end
                setTimeout(() => {
                    if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
                        scrollContainer.scrollTo({
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                }, 1000);
            }
        }
        
        // Auto scroll every 5 seconds
        const autoScrollInterval = setInterval(autoScroll, 5000);
        
        // Pause auto scroll when user is manually scrolling
        const handleScroll = () => {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 1000);
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        
        // Cleanup function
        return () => {
            clearInterval(autoScrollInterval);
            clearTimeout(scrollTimeout);
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }
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

function selectPortal(portalType) {
    currentPortal = portalType;
    
    const portalSelection = document.getElementById('portalSelection');
    const authForms = document.getElementById('authForms');
    const portalIcon = document.getElementById('portalIcon');
    const portalTitle = document.getElementById('portalTitle');
    const portalDescription = document.getElementById('portalDescription');
    
    if (portalSelection && authForms) {
        portalSelection.classList.add('hidden');
        authForms.classList.remove('hidden');
    }
    
    if (portalIcon && portalTitle && portalDescription) {
        if (portalType === 'citizen') {
            portalIcon.innerHTML = '<i data-lucide="users" class="w-8 h-8 text-blue-600"></i>';
            portalTitle.textContent = 'Citizen Portal';
            portalDescription.textContent = 'Access your citizen dashboard';
        } else {
            portalIcon.innerHTML = '<i data-lucide="shield" class="w-8 h-8 text-green-600"></i>';
            portalTitle.textContent = 'Admin Portal';
            portalDescription.textContent = 'Access administrative dashboard';
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // Reset forms
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
            loginTab.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
            loginTab.classList.remove('text-gray-500');
        }
        if (signupTab) {
            signupTab.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
            signupTab.classList.add('text-gray-500');
        }
        if (loginForm) loginForm.classList.remove('hidden');
        if (signupForm) signupForm.classList.add('hidden');
    } else {
        if (signupTab) {
            signupTab.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
            signupTab.classList.remove('text-gray-500');
        }
        if (loginTab) {
            loginTab.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
            loginTab.classList.add('text-gray-500');
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
    const forms = document.querySelectorAll('#loginForm, #signupForm');
    forms.forEach(form => {
        if (form) form.reset();
    });
    
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

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    const employeeId = document.getElementById('employeeId')?.value;
    
    // Validate admin fields
    if (currentPortal === 'admin' && !employeeId?.trim()) {
        alert('Please enter your employee ID.');
        return;
    }
    
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
        submitButton.classList.add('btn-loading');
        submitButton.textContent = 'Logging in...';
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user data
    const userData = {
        email: email,
        portalType: currentPortal,
        loginTime: new Date().toISOString(),
        firstName: currentPortal === 'citizen' ? 'Citizen' : 'Admin',
        lastName: 'User',
        ...(currentPortal === 'admin' && { employeeId: employeeId })
    };
    
    // Store user data
    localStorage.setItem('civicview_current_user', JSON.stringify(userData));
    
    // Reset button
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('btn-loading');
        if (originalText) {
            submitButton.innerHTML = originalText;
        }
    }
    
    // Check if user should go to report issue directly
    const shouldReportIssue = localStorage.getItem('civicview_pending_report_issue');
    if (shouldReportIssue === 'true' && currentPortal === 'citizen') {
        localStorage.removeItem('civicview_pending_report_issue');
        window.location.href = 'report.html';
    } else {
        // Navigate to appropriate dashboard
        if (currentPortal === 'citizen') {
            window.location.href = 'citizen.html';
        } else {
            window.location.href = 'admin.html';
        }
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }
    
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
        submitButton.classList.add('btn-loading');
        submitButton.textContent = 'Creating account...';
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create user data
    const userData = {
        email: email,
        portalType: currentPortal,
        loginTime: new Date().toISOString(),
        firstName: currentPortal === 'citizen' ? 'Citizen' : 'Admin',
        lastName: 'User'
    };
    
    // Store user data
    localStorage.setItem('civicview_current_user', JSON.stringify(userData));
    
    // Reset button
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('btn-loading');
        if (originalText) {
            submitButton.innerHTML = originalText;
        }
    }
    
    // Check if user should go to report issue directly
    const shouldReportIssue = localStorage.getItem('civicview_pending_report_issue');
    if (shouldReportIssue === 'true' && currentPortal === 'citizen') {
        localStorage.removeItem('civicview_pending_report_issue');
        window.location.href = 'report.html';
    } else {
        // Navigate to appropriate dashboard
        if (currentPortal === 'citizen') {
            window.location.href = 'citizen.html';
        } else {
            window.location.href = 'admin.html';
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
    const reviewImage = document.getElementById('reviewImage');
    
    if (reviewTitle) reviewTitle.textContent = title;
    if (reviewCategory) reviewCategory.textContent = category;
    if (reviewDescription) reviewDescription.textContent = description;
    if (reviewLocation) reviewLocation.textContent = location;
    if (reviewUrgency) reviewUrgency.textContent = urgency;
    
    if (reviewImage) {
        if (imagePreview) {
            reviewImage.innerHTML = `<img src="${imagePreview}" alt="Issue Image" class="w-full h-32 object-cover rounded-lg">`;
        } else {
            reviewImage.innerHTML = '<p class="text-gray-500 text-sm">No image uploaded</p>';
        }
    }
}

function generateReportId() {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100; // 3-digit number
    return `CV-${currentYear}-${randomNum}`;
}

async function handleReportSubmission(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton?.innerHTML;
    
    if (submitButton) {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 inline mr-2 animate-spin"></i>Submitting...';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate report ID and show success modal
        const reportId = generateReportId();
        const reportIdElement = document.getElementById('reportId');
        if (reportIdElement) {
            reportIdElement.textContent = reportId;
        }
        
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
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

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('hidden');
        successModal.classList.remove('flex');
    }
    
    // Redirect based on context
    if (window.location.pathname.includes('report.html')) {
        window.location.href = 'citizen.html';
    }
}

// Contact form handler
async function handleContactSubmission(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton?.innerHTML;
    
    if (submitButton) {
        // Show loading state
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
    // This would be implemented with actual report data
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function updateStatus(reportId) {
    // Simulate status update
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

// Data Loading Functions (these would connect to real APIs in production)
function updateStats() {
    // Sample implementation - would fetch real data in production
    const stats = {
        total: 2,
        resolved: 1,
        inProgress: 1,
        pending: 0
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
    // This would load actual user reports in production
    const reportsList = document.getElementById('reportsList');
    const noReports = document.getElementById('noReports');
    
    // Sample data check
    const hasReports = true; // This would be determined by actual data
    
    if (hasReports && reportsList) {
        reportsList.classList.remove('hidden');
        if (noReports) noReports.classList.add('hidden');
        
        // Populate with sample data
        reportsList.innerHTML = getSampleReportsHTML();
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
    // Implement filtering logic here
    populateAllReportsTable();
}

// Sample data generators
function getSampleReportsHTML() {
    return `
        <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow report-card border border-gray-100">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <i data-lucide="construction" class="w-5 h-5 text-orange-600"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Pothole on Main Street</h3>
                        <p class="text-sm text-gray-500">Report #CV-2024-245</p>
                    </div>
                </div>
                ${getStatusBadge('in-progress')}
            </div>
            <p class="text-gray-600 text-sm mb-4">Large pothole causing traffic congestion near the city center intersection.</p>
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Reported 2 days ago</span>
                <div class="w-full bg-gray-200 rounded-full h-2 mx-4">
                    <div class="bg-blue-600 h-2 rounded-full progress-bar" style="width: 60%"></div>
                </div>
                <span class="text-xs text-blue-600 font-medium">60%</span>
            </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow report-card border border-gray-100">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <i data-lucide="lightbulb" class="w-5 h-5 text-green-600"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Broken Street Light</h3>
                        <p class="text-sm text-gray-500">Report #CV-2024-203</p>
                    </div>
                </div>
                ${getStatusBadge('resolved')}
            </div>
            <p class="text-gray-600 text-sm mb-4">Street light not working, creating safety concerns during night hours.</p>
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Resolved 1 week ago</span>
                <div class="w-full bg-gray-200 rounded-full h-2 mx-4">
                    <div class="bg-green-600 h-2 rounded-full progress-bar" style="width: 100%"></div>
                </div>
                <span class="text-xs text-green-600 font-medium">100%</span>
            </div>
        </div>
    `;
}

function getSampleCommunityFeedHTML() {
    return `
        <div class="space-y-4">
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <i data-lucide="user" class="w-4 h-4 text-blue-600"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">Anonymous Citizen</h4>
                            <p class="text-xs text-gray-500">Ward 12, Sector 15</p>
                        </div>
                    </div>
                    ${getStatusBadge('reported')}
                </div>
                <h5 class="font-medium text-gray-900 mb-2">Drainage overflow near park</h5>
                <p class="text-gray-600 text-sm mb-3">Water logging due to blocked drainage system affecting pedestrian movement.</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>3 hours ago</span>
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center"><i data-lucide="thumbs-up" class="w-3 h-3 mr-1"></i> 5</span>
                        <span class="flex items-center"><i data-lucide="message-circle" class="w-3 h-3 mr-1"></i> 2</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i data-lucide="user" class="w-4 h-4 text-green-600"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">Community Member</h4>
                            <p class="text-xs text-gray-500">Ward 8, Sector 22</p>
                        </div>
                    </div>
                    ${getStatusBadge('resolved')}
                </div>
                <h5 class="font-medium text-gray-900 mb-2">Garbage collection completed</h5>
                <p class="text-gray-600 text-sm mb-3">Thank you to the municipal team for addressing the waste management issue promptly.</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>1 day ago</span>
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center"><i data-lucide="thumbs-up" class="w-3 h-3 mr-1"></i> 12</span>
                        <span class="flex items-center"><i data-lucide="message-circle" class="w-3 h-3 mr-1"></i> 7</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getSampleAdminReportsHTML() {
    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CV-2024-245</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pothole on Main Street</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Road Maintenance</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge('in-progress')}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getPriorityBadge('high')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 days ago</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button onclick="viewReport('CV-2024-245')" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                <button onclick="updateStatus('CV-2024-245')" class="text-green-600 hover:text-green-900">Update</button>
            </td>
        </tr>
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CV-2024-203</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Broken Street Light</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Street Lighting</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge('resolved')}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getPriorityBadge('medium')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 week ago</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button onclick="viewReport('CV-2024-203')" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                <button onclick="updateStatus('CV-2024-203')" class="text-green-600 hover:text-green-900">Update</button>
            </td>
        </tr>
    `;
}

// Initialize page-specific functionality
function initializePage() {
    const pathname = window.location.pathname;
    
    // Initialize common functionality
    initSmoothScrolling();
    
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
        
        // Set up image upload handler
        const imageUpload = document.getElementById('imageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', handleImageUpload);
        }
    }
}

function initAboutPage() {
    // Set up intersection observer for counter animation
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe the impact section
    const counterElement = document.querySelector('.counter');
    if (counterElement) {
        const impactSection = counterElement.closest('section');
        if (impactSection) {
            observer.observe(impactSection);
        }
    }
}

function initContactPage() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
}

// Main page initialization function
function initializePage() {
    // Update header buttons based on login status
    updateHeaderButtons();
    
    // Page-specific initialization
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('index.html') || currentPath === '/') {
        initHomePage();
    } else if (currentPath.includes('aboutus.html')) {
        initAboutPage();
    } else if (currentPath.includes('contactus.html')) {
        initContactPage();
    } else if (currentPath.includes('getstarted.html')) {
        initGetStartedPage();
    } else if (currentPath.includes('citizen.html')) {
        initCitizenDashboard();
    } else if (currentPath.includes('admin.html')) {
        initAdminDashboard();
    } else if (currentPath.includes('report.html')) {
        initReportPage();
    }
}

// Home page specific initialization
function initHomePage() {
    // Initialize counter animation
    initComplaintTypesScroll();
    
    // Set up intersection observer for counter animation
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe the stats section
    const counterElement = document.querySelector('.counter');
    if (counterElement) {
        const statsSection = counterElement.closest('section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
}