// This file manages the user interface interactions, including the side navigation and dynamic content updates.

document.addEventListener('DOMContentLoaded', function() {
    // Initialize side navigation
    const elems = document.querySelectorAll('.sidenav');
    const instances = M.Sidenav.init(elems);

    // Event listener for menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });
});

// Function to load different pages dynamically
function loadPage(page) {
    const content = document.getElementById('main-content');
    fetch(`./${page}.html`)
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}

// Function to show a loading spinner
function showLoading() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
}

// Function to hide the loading spinner
function hideLoading() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
}