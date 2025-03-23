/**
 * Client Profile Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (typeof authService !== 'undefined') {
        authService.checkAuthentication();
    }
    
    // Initialize client service
    if (typeof clientService === 'undefined') {
        console.error('clientService is not defined. Make sure clientService.js is loaded.');
        return;
    }
    
    // Initialize form
    initClientForm();
    
    // Set up search functionality
    setupSearch();
});

/**
 * Initialize the client form
 */
function initClientForm() {
    const clientForm = document.getElementById('client-form');
    const registerBtn = document.getElementById('register-btn');
    
    // Handle form submission
    clientForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        try {
            // Get form data
            const formData = getFormData();
            
            // Save client
            const savedClient = await clientService.saveClient(formData);
            
            // Update form with saved data
            populateForm(savedClient);
            
            // Show success message
            M.toast({html: 'Client saved successfully!', classes: 'green'});
        } catch (error) {
            console.error('Error saving client:', error);
            M.toast({html: 'Error saving client. Please try again.', classes: 'red'});
        }
    });
    
    // Handle register button click
    registerBtn.addEventListener('click', function() {
        resetForm();
    });
}

/**
 * Setup client search functionality
 */
function setupSearch() {
    const searchClientBtn = document.getElementById('search-client-btn');
    const searchTermInput = document.getElementById('search-term');
    const searchResultsContainer = document.getElementById('search-results');
    
    // Open search modal
    searchClientBtn.addEventListener('click', function() {
        // Clear previous search
        searchTermInput.value = '';
        searchResultsContainer.innerHTML = '';
    });
    
    // Handle search input
    searchTermInput.addEventListener('keyup', async function(event) {
        const searchTerm = this.value.trim();
        
        // Only search if there's something to search for
        if (searchTerm.length < 2) {
            searchResultsContainer.innerHTML = '';
            return;
        }
        
        try {
            // Search clients
            const results = await clientService.searchClients(searchTerm);
            
            // Display results
            displaySearchResults(results);
        } catch (error) {
            console.error('Error searching clients:', error);
            searchResultsContainer.innerHTML = '<tr><td colspan="4" class="center-align red-text">Error searching clients</td></tr>';
        }
    });
}

/**
 * Display search results in the table
 * @param {Array} results Client search results
 */
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    
    // Clear previous results
    searchResultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<tr><td colspan="4" class="center-align">No clients found</td></tr>';
        return;
    }
    
    // Add each result to the table
    results.forEach(client => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${client.CLIENT_ID}</td>
            <td>${client.NAME}</td>
            <td>${client.CLIENT_TYPE}</td>
            <td>
                <a href="#" class="select-client-btn" data-id="${client.CLIENT_ID}">
                    <i class="material-icons">check</i>
                </a>
            </td>
        `;
        
        searchResultsContainer.appendChild(row);
    });
    
    // Add event listeners to select buttons
    document.querySelectorAll('.select-client-btn').forEach(btn => {
        btn.addEventListener('click', async function(event) {
            event.preventDefault();
            
            const clientId = this.getAttribute('data-id');
            
            try {
                // Get client data
                const client = await clientService.getClientById(clientId);
                
                // Populate form
                populateForm(client);
                
                // Close modal
                const modal = M.Modal.getInstance(document.getElementById('client-search-modal'));
                modal.close();
            } catch (error) {
                console.error('Error loading client:', error);
                M.toast({html: 'Error loading client data', classes: 'red'});
            }
        });
    });
}

/**
 * Get form data as an object
 * @returns {Object} Form data object
 */
function getFormData() {
    // Get form values
    const clientId = document.getElementById('client-id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contactPerson = document.getElementById('contact-person').value;
    const contactNumber = document.getElementById('contact-number').value;
    const address = document.getElementById('address').value;
    const creditBalance = parseFloat(document.getElementById('credit-balance').value || 0);
    const dailyRate = parseFloat(document.getElementById('daily-rate').value || 0);
    const status = document.getElementById('status').value;
    const clientType = document.getElementById('client-type').value;
    
    // Build data object
    const formData = {
        NAME: name,
        EMAIL: email,
        CONTACT_PERSON: contactPerson,
        CONTACT_NUMBER: contactNumber,
        ADDRESS: address,
        CREDIT_BALANCE: creditBalance,
        DAILY_RATE: dailyRate,
        STATUS: status,
        CLIENT_TYPE: clientType,
        UPDATED_BY: 'Vincentan-Dev'
    };
    
    // Add ID if updating existing client
    if (clientId) {
        formData.CLIENT_ID = parseInt(clientId, 10);
    } else {
        formData.CREATED_BY = 'Vincentan-Dev';
    }
    
    return formData;
}

/**
 * Populate form with client data
 * @param {Object} client Client data
 */
function populateForm(client) {
    document.getElementById('client-id').value = client.CLIENT_ID || '';
    document.getElementById('name').value = client.NAME || '';
    document.getElementById('email').value = client.EMAIL || '';
    document.getElementById('contact-person').value = client.CONTACT_PERSON || '';
    document.getElementById('contact-number').value = client.CONTACT_NUMBER || '';
    document.getElementById('address').value = client.ADDRESS || '';
    document.getElementById('credit-balance').value = client.CREDIT_BALANCE || 0;
    document.getElementById('daily-rate').value = client.DAILY_RATE || 0;
    
    // Update select dropdown
    const statusSelect = document.getElementById('status');
    statusSelect.value = client.STATUS || 'ACTIVE';
    M.FormSelect.init(statusSelect);
    
    // Update client type chips
    const clientTypeChips = document.querySelectorAll('.client-type-chip');
    clientTypeChips.forEach(chip => {
        if (chip.getAttribute('data-value') === client.CLIENT_TYPE) {
            chip.classList.add('selected');
        } else {
            chip.classList.remove('selected');
        }
    });
    document.getElementById('client-type').value = client.CLIENT_TYPE || 'CORPORATE';
    
    // Update all labels to "active" state to show they have content
    M.updateTextFields();
}

/**
 * Reset form to create a new client
 */
function resetForm() {
    // Clear form fields
    document.getElementById('client-form').reset();
    document.getElementById('client-id').value = '';
    
    // Reset client type to default
    const clientTypeChips = document.querySelectorAll('.client-type-chip');
    clientTypeChips.forEach(chip => {
        if (chip.getAttribute('data-value') === 'CORPORATE') {
            chip.classList.add('selected');
        } else {
            chip.classList.remove('selected');
        }
    });
    document.getElementById('client-type').value = 'CORPORATE';
    
    // Reset status to default
    const statusSelect = document.getElementById('status');
    statusSelect.value = 'ACTIVE';
    M.FormSelect.init(statusSelect);
    
    // Update all text fields
    M.updateTextFields();
    
    // Set focus to name field
    document.getElementById('name').focus();
}

/**
 * Validate form input
 * @returns {boolean} True if valid, false otherwise
 */
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const clientType = document.getElementById('client-type').value;
    
    if (!name) {
        M.toast({html: 'Please enter a client name', classes: 'red'});
        return false;
    }
    
    if (!clientType) {
        M.toast({html: 'Please select a client type', classes: 'red'});
        return false;
    }
    
    return true;
}