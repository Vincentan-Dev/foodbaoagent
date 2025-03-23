class AppHeader extends HTMLElement {
    constructor() {
        super();
        
        // Determine if we're in a subdirectory
        const inPagesDir = window.location.pathname.includes('/pages/');
        const basePath = inPagesDir ? '../' : '';
        const pagesPath = inPagesDir ? '' : 'pages/';
        
        this.innerHTML = `
            <style>
                /* Header fixed positioning */
                .navbar-fixed {
                    position: fixed !important;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 999;
                    width: 100%;
                }
                
                /* Ensure the navbar doesn't have any margins */
                nav {
                    margin: 0;
                    height: 64px; /* Match your body padding-top */
                }
                
                @media only screen and (max-width: 600px) {
                    nav {
                        height: 56px; /* Match your body padding-top for mobile */
                    }
                }
                
                /* Custom container with less padding */
                .container-flush {
                    width: 100%;
                    padding: 0 8px 0 0; /* Remove left padding, keep small right padding */
                }
                
                /* Style for logo */
                .brand-logo {
                    position: relative !important;
                    margin-right: 5px; /* Reduced from 10px */
                }
                
                .no-left-margin {
                    margin-left: 0 !important;
                    padding-left: 0 !important;
                }
                
                /* Style for username and role display */
                .user-display {
                    display: inline-flex;
                    align-items: center;
                    height: 64px;
                    font-size: 13px;
                    color: white;
                    margin-left: 42px; /* Reduced from 55px */
                    position: absolute;
                    white-space: nowrap;
                }
                
                .username {
                    font-weight: 500;
                }
                
                .role-separator {
                    margin: 0 4px;
                }
                
                .userrole {
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 11px;
                    opacity: 0.9;
                }
                
                /* Narrower sidenav */
                .narrower-sidenav {
                    width: 250px !important; /* Narrower than default 300px */
                }
                
                /* Adjust sidenav item padding for narrower menu */
                .sidenav li > a {
                    padding: 0 24px;
                }
                
                .sidenav .material-icons {
                    margin-right: 16px;
                }
                
                /* Centered sidenav header */
                .sidenav .user-view {
                    padding: 24px 16px 16px;
                    text-align: center;
                    margin-bottom: 0;
                }
                
                .sidenav .user-view .circle {
                    height: 70px; /* Slightly smaller */
                    width: 70px;  /* Slightly smaller */
                    margin: 0 auto 12px;
                    display: block;
                    object-fit: cover;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    transition: transform 0.3s ease;
                }
                
                .sidenav .user-view .circle:hover {
                    transform: scale(1.05);
                }
                
                .sidenav .user-view .name {
                    display: block;
                    font-size: 16px;
                    margin-bottom: 4px;
                    font-weight: 500;
                }
                
                .sidenav .user-view .email {
                    display: block;
                    font-size: 12px;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Mobile styles */
                @media only screen and (max-width: 600px) {
                    .user-display {
                        height: 56px;
                        font-size: 12px;
                        margin-left: 40px; /* Reduced from 50px */
                    }
                    
                    .userrole {
                        font-size: 10px;
                    }
                }
                
                /* Extra small screens */
                @media only screen and (max-width: 320px) {
                    .user-display {
                        max-width: 140px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    
                    .narrower-sidenav {
                        width: 230px !important; /* Even narrower for very small screens */
                    }
                }
                
                /* Add this to ensure logo is visible */
                .brand-logo img {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }
            </style>
            <header>
                <div class="navbar-fixed">
                    <nav class="teal">
                        <div class="nav-wrapper container-flush">
                            <!-- Sidenav trigger with logo - fixed path -->
                            <a href="#" data-target="mobile-nav" class="brand-logo left sidenav-trigger no-left-margin">
                                <img src="${basePath}img/FBLogo.jpg" 
                                     alt="FoodBao" style="height: 40px; margin: 8px 0 8px 4px; border-radius: 50%;">
                            </a>
                            
                            <!-- Username and Role next to logo -->
                            <div class="user-display">
                                <span id="nav-username" class="username">User</span>
                                <span class="role-separator">-</span>
                                <span id="nav-userrole" class="userrole">Role</span>
                            </div>
                            
                            <!-- Logout button at far right -->
                            <ul class="right">
                                <li><a href="#" id="topnav-logout-btn" class="tooltipped" data-position="bottom" data-tooltip="Logout">
                                    <i class="material-icons">exit_to_app</i>
                                </a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
                
                <!-- Sidenav with fixed paths -->
                <ul id="mobile-nav" class="sidenav narrower-sidenav">
                    <li>
                        <div class="user-view center-align">
                            <div class="background teal darken-1"></div>
                            <a href="${basePath}index.html" class="center-align">
                                <img class="circle" 
                                     src="${basePath}img/FBLogo.jpg" 
                                     alt="User">
                            </a>
                            <a href="${basePath}index.html" class="center-align">
                                <span class="white-text name" id="sidenav-username">User</span>
                                <span class="white-text email" id="sidenav-userrole">Role</span>
                            </a>
                        </div>
                    </li>
                    
                    <!-- Menu items with proper paths -->
                    <li><a href="${pagesPath}profile.html"><i class="material-icons">person</i>Profile</a></li>
                    <li><a href="${pagesPath}clientsrch.html"><i class="material-icons">people</i>Clients</a></li>
                    <li><a href="${pagesPath}groups.html"><i class="material-icons">group_work</i>Groups</a></li>
                    <li><a href="${pagesPath}products.html"><i class="material-icons">restaurant_menu</i>Products</a></li>
                    <li><a href="${pagesPath}credit-summary.html"><i class="material-icons">account_balance_wallet</i>Credit Summary</a></li>
                    <li><a href="${pagesPath}claudinary.html"><i class="material-icons">cloud_upload</i>Cloudinary</a></li>
                    <li><div class="divider"></div></li>
                    <li><a class="waves-effect" href="#" id="logout-btn"><i class="material-icons">exit_to_app</i>Logout</a></li>
                </ul>
            </header>
        `;
        
        // Initialize listeners after content is rendered
        this.attachEventListeners();
    }
    
    // Adding a method to handle event listeners
    attachEventListeners() {
        // Initialize logout button
        const logoutBtn = this.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof authService !== 'undefined') {
                    authService.logout();
                } else {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('username');
                    window.location.href = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
                }
            });
        }
        
        // Initialize top nav logout button
        const topNavLogoutBtn = this.querySelector('#topnav-logout-btn');
        if (topNavLogoutBtn) {
            topNavLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof authService !== 'undefined') {
                    authService.logout();
                } else {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('username');
                    window.location.href = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
                }
            });
        }
    }
    
    // This runs after the element is added to the page
    connectedCallback() {
        // Update user information
        this.updateUserInfo();
    }
    
    // Method to update user info in the header
    updateUserInfo() {
        const username = localStorage.getItem('username');
        const userRole = localStorage.getItem('user_role') || 'Admin';
        
        // Update username in nav
        const navUsername = this.querySelector('#nav-username');
        if (navUsername) navUsername.textContent = username || 'User';
        
        // Update role in nav
        const navUserRole = this.querySelector('#nav-userrole');
        if (navUserRole) navUserRole.textContent = userRole;
        
        // Update username in sidenav
        const sidenavUsername = this.querySelector('#sidenav-username');
        if (sidenavUsername) sidenavUsername.textContent = username || 'User';
        
        // Update role in sidenav
        const sidenavUserRole = this.querySelector('#sidenav-userrole');
        if (sidenavUserRole) sidenavUserRole.textContent = userRole;
    }
}

// Register the custom element
customElements.define('app-header', AppHeader);

// Find your sidenav template definition - it may look something like this:
const sidenavTemplate = `
    <ul id="slide-out" class="sidenav">
        <!-- User view section -->
        <li>
            <div class="user-view">
                <!-- User profile info -->
            </div>
        </li>
        <!-- Menu items -->
        <li><a href="pages/profile.html"><i class="material-icons">person</i>Profile</a></li>
        <li><a href="pages/clientsrch.html"><i class="material-icons">people</i>Clients</a></li>
        <li><a href="pages/groups.html"><i class="material-icons">group_work</i>Groups</a></li>
        <li><a href="pages/products.html"><i class="material-icons">restaurant_menu</i>Products</a></li>
        <li><a href="pages/credit-summary.html"><i class="material-icons">account_balance_wallet</i>Credit Summary</a></li>
        <li><a href="pages/claudinary.html"><i class="material-icons">cloud_upload</i>Cloudinary</a></li>
        <li><div class="divider"></div></li>
        <li><a class="waves-effect" href="#" id="logout-btn"><i class="material-icons">exit_to_app</i>Logout</a></li>
    </ul>
`;