/**
 * Cloudinary Service
 * Handles Cloudinary account management with Supabase
 */
const cloudinaryService = {
  async getAccounts() {
    try {
      const response = await authService.authenticatedFetch('/api/cloudinary/accounts');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch Cloudinary accounts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting Cloudinary accounts:', error);
      throw error;
    }
  },
  
  async getAccountByUsername(username) {
    try {
      console.log(`Getting cloudinary account for username: ${username}`);
      
      // Fix username typo if present
      const correctedUsername = username === 'vincen423' ? 'vincent423' : username;
      
      const response = await authService.authenticatedFetch(`/api/cloudinary/accounts?username=${correctedUsername}`);
      
      // If response is not ok, it will be handled by authenticatedFetch already
      // Just parse the response - it should be { items: [] } for no results
      
      try {
        const data = await response.json();
        console.log('Cloudinary data received:', data);
        return data;
      } catch (e) {
        console.error('Failed to parse response:', e);
        // Return a consistent format even if parse fails
        return { items: [] };
      }
    } catch (error) {
      // This is for real errors like network issues or auth problems
      console.error('Error getting cloudinary account:', error);
      throw error;
    }
  },
  
  async createAccount(accountData) {
    try {
      const currentUser = authService.getCurrentUser();
      
      // Verify they can only create for their own username
      if (accountData.username !== currentUser.username) {
        throw new Error('You can only create an account for yourself');
      }
      
      // Fix username typo if present
      if (accountData.username === 'vincen423') {
        accountData.username = 'vincent423';
      }
      
      console.log('Sending create account request to API');
      
      const response = await authService.authenticatedFetch('/api/cloudinary/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
      });
      
      console.log('API response status:', response.status);
      
      // Get response text first
      const responseText = await response.text();
      console.log('API response text:', responseText ? responseText.substring(0, 100) + '...' : 'empty');
      
      if (!response.ok) {
        try {
          if (responseText) {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || errorData.error || 'Failed to create account');
          } else {
            throw new Error('Server returned empty error response');
          }
        } catch (parseError) {
          console.error('Error parsing API error response:', parseError);
          throw new Error(responseText || 'Failed to create account (invalid response format)');
        }
      }
      
      // If response is empty or not JSON, handle it gracefully
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response from API, returning empty object');
        return {};
      }
      
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse API success response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error creating cloudinary account:', error);
      throw error;
    }
  },
  
  async updateAccount(id, accountData) {
    try {
      const currentUser = authService.getCurrentUser();
      
      // Verify user can only update their own account (unless they're admin)
      if (accountData.username !== currentUser.username && localStorage.getItem('user_role') !== 'ADMIN') {
        throw new Error('You can only update your own account');
      }
      
      // Fix username typo if present
      if (accountData.username === 'vincen423') {
        accountData.username = 'vincent423';
      }
      
      console.log('Sending update account request for ID:', id);
      
      const response = await authService.authenticatedFetch(`/api/cloudinary/accounts?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
      });
      
      console.log('API response status:', response.status);
      
      // Get response text first
      const responseText = await response.text();
      console.log('API response text:', responseText ? responseText.substring(0, 100) + '...' : 'empty');
      
      if (!response.ok) {
        try {
          if (responseText) {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || errorData.error || 'Failed to update account');
          } else {
            throw new Error('Server returned empty error response');
          }
        } catch (parseError) {
          console.error('Error parsing API error response:', parseError);
          throw new Error(responseText || 'Failed to update account (invalid response format)');
        }
      }
      
      // If response is empty or not JSON, handle it gracefully
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response from API, returning empty object');
        return {};
      }
      
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse API success response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error updating cloudinary account:', error);
      throw error;
    }
  },
  
  async deleteAccount(id) {
    try {
      // Keep admin check for deletion - only admins should delete accounts
      const userRole = localStorage.getItem('user_role');
      if (userRole !== 'ADMIN') {
        throw new Error('Only administrators can delete accounts');
      }
      
      const response = await authService.authenticatedFetch(`/api/cloudinary/accounts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete Cloudinary account');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting Cloudinary account:', error);
      throw error;
    }
  },
  
  // Helper function to hide UI elements based on role
  setupUI() {
    const userRole = localStorage.getItem('user_role');
    console.log('Setting up UI for role:', userRole);
    
    // Hide delete buttons for non-admin users
    if (userRole !== 'ADMIN') {
      const deleteButtons = document.querySelectorAll('.delete-cloudinary-btn');
      deleteButtons.forEach(btn => {
        if (btn) btn.style.display = 'none';
      });
      
      // Only hide the "add" button for the cloudinary account list page
      // but allow users to create their own account on the cloudinary page
      const createButton = document.getElementById('add-cloudinary-btn');
      if (createButton) createButton.style.display = 'none';
    }
  }
};