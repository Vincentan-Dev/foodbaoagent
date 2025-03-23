// This file contains functions for making API calls to the ORDS, handling requests and responses.

const apiBaseUrl = 'https://your-ords-api-url.com'; // Replace with your ORDS API base URL

async function fetchWithAuth(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('bearerToken'); // Retrieve the bearer token from local storage

    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${apiBaseUrl}/${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error; // Rethrow the error for further handling
    }
}

async function getOrders() {
    return await fetchWithAuth('orders'); // Fetch orders from the API
}

async function createOrder(orderData) {
    return await fetchWithAuth('orders', 'POST', orderData); // Create a new order
}

async function updateOrder(orderId, orderData) {
    return await fetchWithAuth(`orders/${orderId}`, 'PUT', orderData); // Update an existing order
}

async function deleteOrder(orderId) {
    return await fetchWithAuth(`orders/${orderId}`, 'DELETE'); // Delete an order
}