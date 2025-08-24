// Login System JavaScript with Supabase Integration

// Initialize Supabase client
const supabaseUrl = 'https://tnjdqipuegeuzpfbrxmv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuamRxaXB1ZWdldXpwZmJyeG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzY1MjQsImV4cCI6MjA2NTcxMjUyNH0.56IkmlyQvR86D7be0TlRYxwLtlkfhse4jyCZehY6I90';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);



// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    checkRememberedUser();
    initializeSupabaseAuth();
});

// Initialize Supabase authentication
function initializeSupabaseAuth() {
    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
            // User signed in successfully
            const user = session.user;
            
            // Debug: Log user data from Google
            console.log('Google OAuth User Data:', user);
            console.log('User Metadata:', user.user_metadata);
            console.log('User Email:', user.email);
            console.log('Avatar URL:', user.user_metadata?.avatar_url);
            console.log('Picture:', user.user_metadata?.picture);
            console.log('Full Name:', user.user_metadata?.full_name);
            console.log('Name:', user.user_metadata?.name);
            
            // Store user data in localStorage
            const userData = {
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                email: user.email,
                avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://via.placeholder.com/80x80/3b82f6/ffffff?text=${user.email?.charAt(0).toUpperCase() || 'U'}`,
                loginTime: new Date().toISOString(),
                id: user.id,
                provider: 'google'
            };
            
            console.log('Final userData being stored:', userData);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Show success modal
            showLoginSuccess(userData);
            
            // Reset any loading states
            const googleBtn = document.querySelector('.google-login-btn');
            if (googleBtn) {
                googleBtn.innerHTML = '<i class="fab fa-google"></i> Continue with Google';
                googleBtn.disabled = false;
            }
            
        } else if (event === 'SIGNED_OUT') {
            // User signed out
            console.log('User signed out');
            localStorage.removeItem('userData');
        }
    });
    
    // Check if user is already signed in
    checkAuthState().then(user => {
        if (user) {
            // User is already signed in, redirect to dashboard or show user info
            console.log('User already signed in:', user);
            const userData = {
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                email: user.email,
                avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://via.placeholder.com/80x80/3b82f6/ffffff?text=${user.email?.charAt(0).toUpperCase() || 'U'}`,
                loginTime: new Date().toISOString(),
                id: user.id,
                provider: 'google'
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redirect to donation page if already logged in
            setTimeout(() => {
                window.location.href = 'donation.html';
            }, 1000);
        }
    });
}

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const googleLoginBtn = document.querySelector('.google-login-btn');
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Handle Google login button
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }
}

// Handle regular login (Demo version - works without Supabase)
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading state
    const submitBtn = document.querySelector('.login-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        try {
            // Demo validation - accept any email/password combo for testing
            if (!email || !password) {
                throw new Error('Please enter both email and password.');
            }
            
            // For demo: accept test@example.com / password123 or any email/password
            if (email && password) {
                // Remember user if checkbox is checked
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', email);
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                // Store user data in localStorage
                const userData = {
                    name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                    email: email,
                    avatar: `https://via.placeholder.com/80x80/3b82f6/ffffff?text=${email.charAt(0).toUpperCase()}`,
                    loginTime: new Date().toISOString(),
                    id: Date.now()
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Show success modal
                showLoginSuccess(userData);
                
                // Reset form
                document.getElementById('loginForm').reset();
                
            } else {
                throw new Error('Invalid credentials. Please try again.');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showLoginError(error.message || 'Login failed. Please try again.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500); // Simulate network delay
}

// Handle Google login with Supabase (Restored)
async function handleGoogleLogin() {
    const googleBtn = document.querySelector('.google-login-btn');
    const originalText = googleBtn.innerHTML;
    
    try {
        // Show loading state
        googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        googleBtn.disabled = true;
        
        // Sign in with Google using Supabase
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/login.html'
            }
        });
        
        if (error) {
            throw error;
        }
        
        // If successful, the user will be redirected back
        // We'll handle the success in the auth state change listener
        
    } catch (error) {
        console.error('Google login error:', error);
        showLoginError('Google login failed. Please try again.');
        
        // Reset button
        googleBtn.innerHTML = originalText;
        googleBtn.disabled = false;
    }
}

// Check current auth state
async function checkAuthState() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Sign out user
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Clear localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userSettings');
        
        // Redirect to login page
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Sign out error:', error);
        // Fallback: clear localStorage and redirect anyway
        localStorage.removeItem('userData');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userSettings');
        window.location.href = 'login.html';
    }
}

// Handle forgot password
async function handleForgotPassword() {
    const email = document.getElementById('email').value;
    
    if (!email) {
        showLoginError('Please enter your email address first.');
        return;
    }
    
    try {
        // Show loading state
        const forgotLink = document.querySelector('.forgot-password');
        const originalText = forgotLink.textContent;
        forgotLink.textContent = 'Sending...';
        forgotLink.style.pointerEvents = 'none';
        
        // Send password reset email via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/login.html'
        });
        
        if (error) {
            throw error;
        }
        
        // Show success message
        showLoginSuccess({
            name: 'Password Reset',
            email: email,
            avatar: 'https://via.placeholder.com/80x80/10b981/ffffff?text=✓'
        });
        
    } catch (error) {
        console.error('Password reset error:', error);
        showLoginError('Password reset failed. ' + (error.message || 'Please try again.'));
    } finally {
        // Reset link
        const forgotLink = document.querySelector('.forgot-password');
        forgotLink.textContent = originalText;
        forgotLink.style.pointerEvents = 'auto';
    }
}

// Show login success modal
function showLoginSuccess(user) {
    const modal = document.getElementById('loginSuccessModal');
    const loginTime = document.getElementById('loginTime');
    
    // Update login time
    const now = new Date();
    loginTime.textContent = now.toLocaleTimeString();
    
    // Update user avatar if it exists
    const userAvatar = modal.querySelector('.user-avatar img');
    if (userAvatar && user.avatar) {
        userAvatar.src = user.avatar;
    }
    
    // Update welcome message
    const welcomeMessage = modal.querySelector('h4');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${user.name}!`;
    }
    
    // Show modal
    modal.style.display = 'flex';
    
    // Add success animation
    modal.classList.add('active');
    
    // Redirect to donation page after 2 seconds (since home.html doesn't exist)
    setTimeout(() => {
        window.location.href = 'donation.html';
    }, 2000);
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('loginSuccessModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
}

// Show login error
function showLoginError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}



// Check for remembered user
function checkRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('email').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Toggle between login and signup modes
let isSignupMode = false;

function toggleLoginMode() {
    isSignupMode = !isSignupMode;
    
    const submitBtn = document.querySelector('.login-submit-btn');
    const footerText = document.getElementById('loginFooterText');
    const headerTitle = document.getElementById('loginHeaderTitle');
    const headerSubtitle = document.getElementById('loginHeaderSubtitle');
    
    if (isSignupMode) {
        // Switch to signup mode
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
        footerText.innerHTML = 'Already have an account? <a href="#" onclick="toggleLoginMode()">Sign in</a>';
        headerTitle.textContent = 'Create Account';
        headerSubtitle.textContent = 'Join the NSA Network community';
    } else {
        // Switch to login mode
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        footerText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleLoginMode()">Sign up</a>';
        headerTitle.textContent = 'Welcome Back';
        headerSubtitle.textContent = 'Sign in to your NSA Network account';
    }
}

// Handle form submission (login or signup)
async function handleFormSubmission() {
    if (isSignupMode) {
        await handleSignup();
    } else {
        await handleLogin();
    }
}

// Handle signup with Supabase
async function handleSignup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showLoginError('Please enter both email and password to sign up.');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('.login-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: window.location.origin + '/login.html'
            }
        });
        
        if (error) {
            throw error;
        }
        
        // Store user data in localStorage
        const userData = {
            name: 'New User',
            email: email,
            avatar: `https://via.placeholder.com/80x80/10b981/ffffff?text=${email.charAt(0).toUpperCase()}`
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show success message
        showLoginSuccess(userData);
        
        // Reset form
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        console.error('Sign up error:', error);
        showLoginError('Sign up failed. ' + (error.message || 'Please try again.'));
    } finally {
        // Reset button
        const submitBtn = document.querySelector('.login-submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
        submitBtn.disabled = false;
    }
}

// Redirect to dashboard (placeholder)
function redirectToDashboard() {
    alert('Dashboard will be implemented in the next phase.');
    closeLoginModal();
}

// Sidebar toggle functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to device items
    const deviceItems = document.querySelectorAll('.device-item');
    deviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Add click effects to security items
    const securityItems = document.querySelectorAll('.security-item');
    securityItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .login-error .error-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .login-error button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .login-error button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .modal.active {
        animation: modalFadeIn 0.3s ease;
    }
    
    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLogin,
        handleGoogleLogin,
        showLoginSuccess,
        closeLoginModal,
        toggleSidebar
    };
}
