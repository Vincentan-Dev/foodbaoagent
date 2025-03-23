document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialization started');
    
    // Check if authService is available
    if (typeof authService === 'undefined') {
        console.error('AuthService not loaded! Check script loading order.');
        return;
    }
    
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
        console.warn('User not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('User is authenticated, loading food items');
    
    // Set the username in the welcome message
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        const user = authService.getCurrentUser();
        console.log('Current user:', user);
        userNameElement.textContent = user ? user.username : 'User';
    }
    
    // Load food items
    loadFoodItems();
    
    // Initialize any UI components
    initUI();
});

function loadFoodItems() {
    console.log('Loading food items (using sample data until API is available)');
    
    // Use sample data instead of API call for now
    const sampleFoodItems = [
        { id: 1, name: 'Hamburger', price: 5.99, image: 'src/img/hamburger.jpg', description: 'Classic beef patty with lettuce, tomato, and special sauce', category: 'Main' },
        { id: 2, name: 'Pizza', price: 8.99, image: 'src/img/pizza.jpg', description: 'Fresh baked crust with your choice of toppings', category: 'Main' },
        { id: 3, name: 'Salad', price: 4.99, image: 'src/img/salad.jpg', description: 'Fresh greens with seasonal vegetables and dressing', category: 'Side' },
        { id: 4, name: 'Pasta', price: 7.99, image: 'src/img/pasta.jpg', description: 'Al dente pasta with homemade sauce', category: 'Main' },
        { id: 5, name: 'Fried Rice', price: 6.99, image: 'src/img/fried-rice.jpg', description: 'Stir-fried rice with vegetables and choice of protein', category: 'Main' },
        { id: 6, name: 'Ice Cream', price: 3.99, image: 'src/img/ice-cream.jpg', description: 'Creamy dessert in various flavors', category: 'Dessert' }
    ];
    
    // Use the sample data directly
    renderFoodItems(sampleFoodItems);
    
    /* 
    // CODE COMMENTED OUT - will be used when the API is ready
    // API URL
    const apiUrl = 'https://g4466c5562a773d-maindb.adb.ap-singapore-1.oraclecloudapps.com/ords/admin/api/food-items';
    
    // Use the authenticated fetch method
    authService.authenticatedFetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Food items loaded:', data);
            renderFoodItems(data);
        })
        .catch(error => {
            console.error('Error loading food items:', error);
            // Show error message
            if (typeof M !== 'undefined') {
                M.toast({html: 'Failed to load food items', classes: 'red'});
            }
        });
    */
}

function initUI() {
    console.log('Initializing UI components');
    
    // Check if Materialize is loaded
    if (typeof M === 'undefined') {
        console.error('Materialize JS not loaded! Waiting 500ms and trying again...');
        setTimeout(initUI, 500);
        return;
    }
    
    console.log('Materialize found, initializing components');
    
    // Initialize sidenav
    const sidenavElems = document.querySelectorAll('.sidenav');
    if (sidenavElems.length) {
        const instances = M.Sidenav.init(sidenavElems);
        console.log('Sidenav initialized successfully');
    } else {
        console.warn('No sidenav elements found');
    }
    
    // Initialize dropdown menus
    const dropdownElems = document.querySelectorAll('.dropdown-trigger');
    if (dropdownElems.length) {
        M.Dropdown.init(dropdownElems, {
            coverTrigger: false,
            constrainWidth: false
        });
        console.log('Dropdowns initialized successfully');
    }
    
    // Initialize other Materialize components as needed
    // Tooltips, modals, etc.
    
    // Update username in header
    const headerComp = document.querySelector('app-header');
    if (headerComp && typeof headerComp.updateUsername === 'function') {
        headerComp.updateUsername();
    }
    
    // Add event listener for logo to open sidenav
    const logoTrigger = document.querySelector('.brand-logo');
    if (logoTrigger) {
        logoTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            const sidenavInstance = M.Sidenav.getInstance(document.querySelector('.sidenav'));
            if (sidenavInstance) {
                sidenavInstance.open();
            }
        });
    }
}

// Call initUI after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, initializing app');
    initUI();
});

// Sample code to render food items with Materialize CSS
function renderFoodItems(foodItems) {
    const container = document.getElementById('food-items-container');
    
    // Check if container exists
    if (!container) {
        console.warn('Food items container not found in current page. Creating it dynamically.');
        
        // Create the container
        const appContent = document.getElementById('app-content');
        if (!appContent) {
            console.error('Cannot display food items: app-content element not found');
            return;
        }
        
        // Create a row for the heading
        const headingRow = document.createElement('div');
        headingRow.className = 'row';
        headingRow.innerHTML = '<div class="col s12"><h6 class="teal-text">Popular Food Items</h6></div>';
        appContent.appendChild(headingRow);
        
        // Create the container for food items
        const foodContainer = document.createElement('div');
        foodContainer.id = 'food-items-container';
        foodContainer.className = 'row';
        appContent.appendChild(foodContainer);
        
        // Use the newly created container
        return renderFoodItems(foodItems);
    }
    
    container.innerHTML = '';
    
    foodItems.forEach(item => {
        const foodCard = document.createElement('div');
        foodCard.className = 'col s12 m6 l4';
        
        foodCard.innerHTML = `
            <div class="card hoverable">
                <div class="card-image">
                    <img src="${item.image || 'images/default-food.jpg'}">
                    <span class="card-title">${item.name}</span>
                    <a class="btn-floating halfway-fab waves-effect waves-light red add-to-cart"
                       data-id="${item.id}">
                        <i class="material-icons">add</i>
                    </a>
                </div>
                <div class="card-content">
                    <p class="truncate">${item.description}</p>
                    <div class="chip teal white-text">${item.category}</div>
                    <p class="right-align">
                        <strong>$${item.price.toFixed(2)}</strong>
                    </p>
                </div>
            </div>
        `;
        
        container.appendChild(foodCard);
    });
    
    // Add event listeners for add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', e => {
            const foodId = e.currentTarget.getAttribute('data-id');
            addToCart(foodId);
            
            // Show a toast notification
            M.toast({
                html: 'Added to cart!',
                classes: 'rounded teal'
            });
        });
    });
}

function renderSampleItems() {
    const foodItemsContainer = document.getElementById('food-items-container');
    if (!foodItemsContainer) return;
    
    // Sample food items
    const foodItems = [
        { id: 1, name: 'Hamburger', price: 5.99, image: 'src/img/hamburger.jpg', description: 'Classic beef patty with lettuce, tomato, and special sauce' },
        { id: 2, name: 'Pizza', price: 8.99, image: 'src/img/pizza.jpg', description: 'Fresh baked crust with your choice of toppings' },
        { id: 3, name: 'Salad', price: 4.99, image: 'src/img/salad.jpg', description: 'Fresh greens with seasonal vegetables and dressing' },
        { id: 4, name: 'Pasta', price: 7.99, image: 'src/img/pasta.jpg', description: 'Al dente pasta with homemade sauce' }
    ];
    
    // Render food items
    foodItemsContainer.innerHTML = `
        <h2>Our Menu</h2>
        <div class="food-items-grid">
            ${foodItems.map(item => `
                <div class="food-item">
                    <div class="food-img">
                        <img src="${item.image}" onerror="this.onerror=null; this.src='src/img/placeholder.jpg';" alt="${item.name}">
                    </div>
                    <div class="food-info">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="food-price">$${item.price.toFixed(2)}</div>
                        <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Helper function to prevent XSS
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Make addToCart function globally available
window.addToCart = function(id) {
    if (!authService.isAuthenticated()) {
        alert('Please log in to add items to cart');
        return;
    }
    
    alert(`Item ${id} added to cart!`);
    // In a real app, you would implement cart functionality with API calls
};