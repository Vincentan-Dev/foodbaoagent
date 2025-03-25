/**
 * Authentication Service
 * Handles user authentication using Supabase via Vercel APIs
 */
const authService = {
  async login(username, password) {
    // Keep only the real authentication flow:
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store auth data in localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('username', data.user.username);
    localStorage.setItem('user_id', data.user.id);
    localStorage.setItem('user_role', data.user.role || data.user.user_role); // Store whatever role field exists
    localStorage.setItem('user_email', data.user.email);
    
    return { success: true, user: data.user };
  },
  
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    window.location.href = '/login.html';
  },
  
  getCurrentUser() {
    return {
      token: localStorage.getItem('auth_token'),
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('user_id'),
      role: localStorage.getItem('user_role'),
      email: localStorage.getItem('user_email')
    };
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  authenticatedFetch: async function(url, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        console.error('No authentication token available');
        this.logout();
        return Promise.reject(new Error('Authentication required'));
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
    };
    
    const fetchOptions = { ...options, headers };
    
    try {
        // Use proxy API for all data requests
        const isExternalUrl = url.startsWith('http');
        const finalUrl = isExternalUrl ? url : `/api/proxy?path=${encodeURIComponent(url)}`;
        
        console.log(`Making authenticated request to: ${finalUrl}`);
        const response = await fetch(finalUrl, fetchOptions);
        
        // Handle 401 Unauthorized (token expired)
        if (response.status === 401) {
            console.warn('Authentication token expired or invalid');
            this.logout();
            return Promise.reject(new Error('Authentication session expired'));
        }
        
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        return Promise.reject(error);
    }
  },
  
  getUserDetails: async function() {
    try {
        // Check if we already have user details cached
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('user_id');
        const userRole = localStorage.getItem('user_role');
        
        if (username && userId && userRole) {
            return {
                username,
                id: userId,
                role: userRole
            };
        }
        
        // If not, fetch from user details API
        const apiUrl = '/api/user';
        
        const response = await this.authenticatedFetch(apiUrl);
        const userData = await response.json();
        
        // Store user details in localStorage
        if (userData.username) localStorage.setItem('username', userData.username);
        if (userData.id) localStorage.setItem('user_id', userData.id);
        if (userData.role) localStorage.setItem('user_role', userData.role);
        if (userData.email) localStorage.setItem('user_email', userData.email);
        
        console.log('User details retrieved');
        return userData;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
  }
};

// Override the original logout function to check for login_in_progress
const originalLogout = authService.logout;
authService.logout = function() {
    // Don't redirect if we're in the middle of a login attempt
    if (localStorage.getItem('login_in_progress')) {
        console.log('Login in progress, preventing redirect');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        return;
    }
    
    // Otherwise use the original logout function
    originalLogout.call(this);
};


