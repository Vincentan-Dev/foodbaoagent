
class ClientService {
    constructor() {
        this.clients = [];
        this.db = null;
        

    }

    /**
     * Fetch all clients
     * @returns {Promise} Promise object with client data
     */
    async getClients() {
        try {
            if (this.db) {
                const snapshot = await this.db.collection('clients').get();
                this.clients = snapshot.docs.map(doc => ({
                    CLIENT_ID: doc.id,
                    ...doc.data()
                }));
                return this.clients;
            } else {
                // Fall back to your existing mock data
                this.clients = [
                    { 
                        CLIENT_ID: 1001, 
                        NAME: 'ABC Corporation', 
                        EMAIL: 'contact@abc.com',
                        CONTACT_PERSON: 'John Doe',
                        CONTACT_NUMBER: '123-456-7890',
                        ADDRESS: '123 Main St, Suite 100',
                        CREDIT_BALANCE: 5000.00,
                        DAILY_RATE: 150.00,
                        STATUS: 'ACTIVE',
                        CLIENT_TYPE: 'CORPORATE'
                    },
                    { 
                        CLIENT_ID: 1002, 
                        NAME: 'XYZ Ltd', 
                        EMAIL: 'info@xyz.com',
                        CONTACT_PERSON: 'Jane Smith',
                        CONTACT_NUMBER: '987-654-3210',
                        ADDRESS: '456 Business Ave',
                        CREDIT_BALANCE: 2500.00,
                        DAILY_RATE: 100.00,
                        STATUS: 'ACTIVE',
                        CLIENT_TYPE: 'CORPORATE'
                    }
                ];
                
                return this.clients;
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    }

    /**
     * Get client by ID
     * @param {number} id The client ID
     * @returns {Promise} Promise object with client data
     */
    async getClientById(id) {
        try {
            // For now, mock data - replace with actual API call
            // const response = await fetch(`${this.apiUrl}/${id}`);
            // return await response.json();
            
            await this.getClients(); // Ensure we have data
            return this.clients.find(client => client.CLIENT_ID == id) || null;
        } catch (error) {
            console.error(`Error fetching client with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Search clients by name or ID
     * @param {string} term Search term
     * @returns {Promise} Promise object with client data
     */
    async searchClients(term) {
        try {
            await this.getClients(); // Ensure we have data
            
            // For now, filter cached data - replace with API call for production
            const searchTerm = term.toLowerCase();
            return this.clients.filter(client => 
                client.NAME.toLowerCase().includes(searchTerm) || 
                String(client.CLIENT_ID).includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching clients:', error);
            throw error;
        }
    }

    /**
     * Save a client (create or update)
     * @param {Object} clientData Client data object
     * @returns {Promise} Promise object with saved client data
     */
    async saveClient(clientData) {
        try {
            // Set timestamps
            clientData.UPDATED_AT = new Date().toISOString();
            
            if (clientData.CLIENT_ID) {
                // Update existing client
                // const response = await fetch(`${this.apiUrl}/${clientData.CLIENT_ID}`, {
                //     method: 'PUT',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(clientData)
                // });
                // return await response.json();
                
                // Mock update for testing
                console.log('Updating client:', clientData);
                return clientData;
            } else {
                // Create new client
                clientData.CREATED_AT = clientData.UPDATED_AT;
                
                // const response = await fetch(this.apiUrl, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(clientData)
                // });
                // return await response.json();
                
                // Mock creation for testing
                clientData.CLIENT_ID = Date.now(); // Mock ID generation
                console.log('Creating new client:', clientData);
                return clientData;
            }
        } catch (error) {
            console.error('Error saving client:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const clientService = new ClientService();