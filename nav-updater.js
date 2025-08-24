// Navigation Updater for NSA Network
// This script automatically updates the navigation of all pages to include Supabase authentication

(function() {
    'use strict';
    
    let currentUser = null;
    let userProfile = null;

    // Check login status when page loads
    document.addEventListener('DOMContentLoaded', async function() {
        await updateNavigation();
        await checkLoginStatus();
    });

    async function updateNavigation() {
        // Find all nav-logo elements and add click functionality
        const navLogos = document.querySelectorAll('.nav-logo');
        navLogos.forEach(logo => {
            if (!logo.hasAttribute('onclick')) {
                logo.setAttribute('onclick', 'toggleUserProfileMenu()');
                logo.style.cursor = 'pointer';
            }
        });

        // Find all nav-actions elements and add user profile section if missing
        const navActions = document.querySelectorAll('.nav-actions');
        navActions.forEach(actions => {
            if (!actions.querySelector('#userProfile')) {
                addUserProfileSection(actions);
            }
        });

        // Update login buttons to point to auth-index.html
        const loginButtons = document.querySelectorAll('a[href*="login.html"]');
        loginButtons.forEach(btn => {
            btn.href = 'auth-index.html';
        });
    }

    function addUserProfileSection(navActions) {
        // Check if user profile section already exists
        if (navActions.querySelector('#userProfile')) {
            return;
        }

        // Create user profile section
        const userProfileHTML = `
            <div id="userProfile" class="user-profile" style="display: none;">
                <div class="user-avatar" onclick="toggleUserMenu()">
                    <img id="userAvatar" src="https://via.placeholder.com/40x40/3b82f6/ffffff?text=U" alt="User Avatar">
                </div>
                <div class="user-menu" id="userMenu">
                    <div class="user-info">
                        <img id="userMenuAvatar" src="https://via.placeholder.com/60x60/3b82f6/ffffff?text=U" alt="User Avatar">
                        <div class="user-details">
                            <span id="userName">User Name</span>
                            <span id="userEmail">user@example.com</span>
                        </div>
                    </div>
                    <div class="menu-items">
                        <a href="profile.html" class="menu-item">
                            <i class="fas fa-user"></i>
                            Profile
                        </a>
                        <a href="settings.html" class="menu-item">
                            <i class="fas fa-cog"></i>
                            Settings
                        </a>
                        <a href="#" class="menu-item" onclick="handleLogout()">
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </a>
                    </div>
                </div>
            </div>
            <a href="auth-index.html" class="btn btn-secondary" id="loginBtn">
                <i class="fas fa-sign-in-alt"></i>
                Login
            </a>
        `;

        // Insert before the first button in nav-actions
        const firstButton = navActions.querySelector('button');
        if (firstButton) {
            firstButton.insertAdjacentHTML('beforebegin', userProfileHTML);
        } else {
            navActions.innerHTML += userProfileHTML;
        }
    }

    async function checkLoginStatus() {
        try {
            // Check if user is logged in with Supabase
            const { user } = await supabaseAuth.getCurrentUser();
            
            if (user) {
                currentUser = user;
                
                // Load user profile from database
                const { data: profile, error } = await supabaseDB.getProfile(user.id);
                
                if (profile && !error) {
                    userProfile = profile;
                    showUserProfile();
                } else {
                    // User doesn't have a profile, show login button
                    showLoginButton();
                }
            } else {
                showLoginButton();
            }
            
        } catch (error) {
            console.error('Error checking login status:', error);
            showLoginButton();
        }
    }

    function showUserProfile() {
        const userProfileDiv = document.getElementById('userProfile');
        const loginBtn = document.getElementById('loginBtn');
        
        if (userProfileDiv && loginBtn) {
            userProfileDiv.style.display = 'block';
            loginBtn.style.display = 'none';
            
            // Update user avatar and info
            const avatarUrl = currentUser.user_metadata?.avatar_url || 
                `https://ui-avatars.com/api/?name=${userProfile.first_name}+${userProfile.last_name}&background=667eea&color=fff&size=40`;
            
            document.getElementById('userAvatar').src = avatarUrl;
            document.getElementById('userMenuAvatar').src = avatarUrl.replace('size=40', 'size=60');
            document.getElementById('userName').textContent = `${userProfile.first_name} ${userProfile.last_name}`;
            document.getElementById('userEmail').textContent = userProfile.email;
        }
    }

    function showLoginButton() {
        const userProfileDiv = document.getElementById('userProfile');
        const loginBtn = document.getElementById('loginBtn');
        
        if (userProfileDiv && loginBtn) {
            userProfileDiv.style.display = 'none';
            loginBtn.style.display = 'inline-flex';
        }
    }

    // Global functions for navigation
    window.toggleUserProfileMenu = function() {
        // Toggle user menu when logo is clicked
        toggleUserMenu();
    };

    window.toggleUserMenu = function() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.toggle('active');
        }
    };

    // Close user menu when clicking outside
    document.addEventListener('click', function(event) {
        const userProfileDiv = document.getElementById('userProfile');
        const userMenu = document.getElementById('userMenu');
        
        if (userProfileDiv && !userProfileDiv.contains(event.target)) {
            if (userMenu) {
                userMenu.classList.remove('active');
            }
        }
    });

    window.handleLogout = async function() {
        try {
            const { error } = await supabaseAuth.signOut();
            if (error) throw error;
            
            // Redirect to login page
            window.location.href = 'auth-index.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed. Please try again.');
        }
    };

    // Hamburger menu functionality
    window.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) {
            const isOpen = sidebar.classList.contains('open');
            
            if (isOpen) {
                sidebar.classList.remove('open');
                if (overlay) {
                    overlay.classList.remove('open');
                    overlay.style.visibility = 'hidden';
                    overlay.style.opacity = '0';
                }
            } else {
                sidebar.classList.add('open');
                if (overlay) {
                    overlay.classList.add('open');
                    overlay.style.visibility = 'visible';
                    overlay.style.opacity = '1';
                }
            }
        }
    };

        // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.querySelector('.hamburger');
        
        if (sidebar && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
            sidebar.classList.remove('open');
            const overlay = document.getElementById('sidebarOverlay');
            if (overlay) {
                overlay.classList.remove('open');
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
            }
        }
    });

    // Add common utility functions that pages might need
    window.openSubmitForm = function() {
        const modal = document.getElementById('submitModal');
        if (modal) modal.style.display = 'block';
    };

    window.closeSubmitForm = function() {
        const modal = document.getElementById('submitModal');
        if (modal) modal.style.display = 'none';
    };

    window.openDonateModal = function() {
        const modal = document.getElementById('donateModal');
        if (modal) modal.style.display = 'block';
    };

    window.closeDonateModal = function() {
        const modal = document.getElementById('donateModal');
        if (modal) modal.style.display = 'none';
    };

    // Add CSS for user profile if not already present
    if (!document.querySelector('#nav-updater-styles')) {
        const styles = document.createElement('style');
        styles.id = 'nav-updater-styles';
        styles.textContent = `
            .user-profile {
                position: relative;
                display: flex;
                align-items: center;
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid #e5e7eb;
                transition: all 0.3s ease;
            }

            .user-avatar:hover {
                border-color: #667eea;
                transform: scale(1.05);
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                min-width: 250px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                margin-top: 0.5rem;
            }

            .user-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .user-info {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                text-align: center;
            }

            .user-menu-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid #667eea;
                margin: 0 auto 0.75rem;
                display: block;
            }

            .user-details {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .user-details span:first-child {
                font-weight: 700;
                color: #1f2937;
                font-size: 1.125rem;
            }

            .user-details span:last-child {
                color: #6b7280;
                font-size: 0.875rem;
            }

            .menu-items {
                padding: 0.75rem 0;
            }

            .menu-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.5rem;
                color: #374151;
                text-decoration: none;
                transition: background 0.3s ease;
            }

            .menu-item:hover {
                background: #f9fafb;
            }

            .menu-item:last-child {
                color: #ef4444;
                font-weight: 600;
            }

            .menu-item:last-child:hover {
                background: #fef2f2;
            }

            .nav-logo {
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .nav-logo:hover {
                transform: scale(1.02);
            }

            /* Hamburger menu styling */
            .hamburger {
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .hamburger:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(styles);
    }

})();
