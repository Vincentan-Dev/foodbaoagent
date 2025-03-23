// Token Manager - Handles token refresh and security

class TokenManager {
    constructor() {
        this.TOKEN_KEY = 'auth_token';
        this.TOKEN_EXPIRY = 'token_expiry';
        this.REFRESH_TOKEN = 'refresh_token';
        this.API_URL = 'https://g4466c5562a773d-maindb.adb.ap-singapore-1.oraclecloudapps.com/ords/admin';
        
        // Set up periodic check for token validity
        this.initTokenRefreshCheck();
    }
    
    // Get the current token
    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        const expiry = localStorage.getItem(this.TOKEN_EXPIRY);
        
        if (!token || !expiry) {
            return false;
        }
        
        return Date.now() < parseInt(expiry);
    }
    
    // Initialize token refresh checker
    initTokenRefreshCheck() {
        // Check every minute
        setInterval(() => this.checkAndRefreshToken(), 60000);
        
        // Also check immediately
        this.checkAndRefreshToken();
    }
    
    // Check token validity and refresh if needed
    async checkAndRefreshToken() {
        if (!this.isAuthenticated()) {
            return;
        }
        
        const expiry = parseInt(localStorage.getItem(this.TOKEN_EXPIRY));
        const currentTime = Date.now();
        
        // If token will expire in less than 5 minutes
        if (expiry - currentTime < 300000) {
            await this.refreshToken();
        }
    }
    
    // Refresh the token
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem(this.REFRESH_TOKEN);
            
            if (!refreshToken) {
                this.logout();
                return;
            }
            
            const response = await fetch(`${this.API_URL}/login/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            });
            
            if (!response.ok) {
                throw new Error('Token refresh failed');
            }
            
            const data = await response.json();
            
            if (data && data.access_token) {
                // Update token and expiry
                const expiryTime = Date.now() + (data.expires_in || 3600) * 1000;
                localStorage.setItem(this.TOKEN_KEY, data.access_token);
                localStorage.setItem(this.TOKEN_EXPIRY, expiryTime.toString());
                
                if (data.refresh_token) {
                    localStorage.setItem(this.REFRESH_TOKEN, data.refresh_token);
                }
                
                return true;
            } else {
                throw new Error('Invalid refresh token response');
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            this.logout();
            return false;
        }
    }
    
    // Log the user out
    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY);
        localStorage.removeItem(this.REFRESH_TOKEN);
        localStorage.removeItem('user_data');
        
        // Redirect to login page if not already there
        if (!window.location.href.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
    
    // Helper method for making authenticated API calls
    async fetchWithAuth(url, options = {}) {
        // Check authentication first
        if (!this.isAuthenticated()) {
            this.logout();
            throw new Error('Not authenticated');
        }
        
        // Add authorization header
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.getToken()}`
        };
        
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            
            // If unauthorized, try to refresh token and retry
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                
                if (refreshed) {
                    // Retry with new token
                    headers.Authorization = `Bearer ${this.getToken()}`;
                    return fetch(url, {
                        ...options,
                        headers
                    });
                } else {
                    throw new Error('Authentication failed');
                }
            }
            
            return response;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }
}

// Create a global instance
const tokenManager = new TokenManager();

// Add guard to protect pages
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth check on login page
    if (window.location.href.includes('login.html') || 
        window.location.href.includes('register.html')) {
        return;
    }
    
    // Check authentication for all other pages
    if (!tokenManager.isAuthenticated()) {
        tokenManager.logout();
    }
});