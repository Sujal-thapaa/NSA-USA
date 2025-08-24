// Supabase configuration
const SUPABASE_URL = 'https://tnjdqipuegeuzpfbrxmv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuamRxaXB1ZWdldXpwZmJyeG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzY1MjQsImV4cCI6MjA2NTcxMjUyNH0.56IkmlyQvR86D7be0TlRYxwLtlkfhse4jyCZehY6I90';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helper functions
const auth = {
    // Sign in with Google
    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://tnjdqipuegeuzpfbrxmv.supabase.co/auth/v1/callback'
            }
        });
        return { data, error };
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Database helper functions
const db = {
    // Check if user has a profile
    async getProfile(userId) {
        try {
            console.log('Checking profile for user:', userId);
            
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            console.log('Profile query result:', { data, error });
            
            if (error) {
                console.error('Database error details:', error);
                
                // Handle specific error cases
                if (error.code === 'PGRST116') {
                    console.log('Profile not found - this is expected for new users');
                    return { data: null, error: null }; // No error for missing profile
                }
                
                if (error.code === '42P01') {
                    console.error('Table "profiles" does not exist. Please create the table first.');
                    throw new Error('Database table "profiles" does not exist. Please create it in Supabase first.');
                }
                
                if (error.code === '400') {
                    console.error('Bad request error - likely table structure issue');
                    throw new Error('Database query failed. Please check if the profiles table exists and has the correct structure.');
                }
            }
            
            return { data, error };
        } catch (err) {
            console.error('Unexpected error in getProfile:', err);
            return { data: null, error: err };
        }
    },

    // Create a new profile
    async createProfile(profileData) {
        try {
            console.log('Creating profile with data:', profileData);
            
            const { data, error } = await supabase
                .from('profiles')
                .insert([profileData])
                .select()
                .single();
            
            console.log('Profile creation result:', { data, error });
            
            if (error) {
                console.error('Profile creation error:', error);
                
                if (error.code === '42P01') {
                    throw new Error('Database table not found. Please create the profiles table first.');
                }
                
                if (error.code === '23505') {
                    throw new Error('Profile already exists for this user.');
                }
            }
            
            return { data, error };
        } catch (err) {
            console.error('Unexpected error in createProfile:', err);
            return { data: null, error: err };
        }
    },

    // Update existing profile
    async updateProfile(userId, profileData) {
        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('user_id', userId)
            .select()
            .single();
        return { data, error };
    }
};

// Utility functions
const utils = {
    // Show loading state
    showLoading(element, text = 'Loading...') {
        element.disabled = true;
        element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    },

    // Reset button state
    resetButton(element, originalText) {
        element.disabled = false;
        element.innerHTML = originalText;
    },

    // Show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    },

    // Show success message
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
};

// Test database connection
const testConnection = async () => {
    try {
        console.log('Testing Supabase connection...');
        console.log('URL:', SUPABASE_URL);
        console.log('Key length:', SUPABASE_ANON_KEY.length);
        
        // Test basic connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
            if (error.code === '42P01') {
                console.log('✅ Supabase connection working, but profiles table does not exist');
                return { connected: true, tableExists: false, message: 'Table "profiles" does not exist. Please create it first.' };
            } else if (error.code === '400') {
                console.log('⚠️ Supabase connection working, but profiles table has issues');
                return { connected: true, tableExists: false, message: 'Table exists but has structure issues. Please check the table schema.' };
            } else {
                console.error('❌ Database error:', error);
                return { connected: true, tableExists: false, error, message: 'Database error: ' + error.message };
            }
        } else {
            console.log('✅ Supabase connection working and profiles table exists');
            return { connected: true, tableExists: true, message: 'Database connection working perfectly!' };
        }
    } catch (err) {
        console.error('❌ Connection test failed:', err);
        return { connected: false, error: err, message: 'Connection failed: ' + err.message };
    }
};

// Export for use in other files
window.supabaseAuth = auth;
window.supabaseDB = db;
window.supabaseUtils = utils;
window.testSupabaseConnection = testConnection;
