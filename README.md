# Food Order PWA

## Overview
This project is a Progressive Web App (PWA) designed for a food order system. It features a modern and responsive user interface built with HTML, Materialize CSS, and JavaScript. The application includes a login page, a registration form with an impressive AI look, and a main dashboard with side navigation for easy access to various functionalities.

## Features
- **Login Page**: Users can authenticate using OAuth2.
- **Registration Page**: New clients can register with a visually appealing form.
- **Dashboard**: After logging in, users can access the main dashboard with a side navigation menu.
- **API Integration**: Connects to ORDS with secure OAuth2 authentication.
- **Offline Capabilities**: Utilizes a service worker for caching and offline access.

## Project Structure
```
food-order-pwa
├── public
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── register.html
│   ├── manifest.json
│   ├── favicon.ico
│   └── service-worker.js
├── src
│   ├── css
│   │   ├── materialize.min.css
│   │   └── style.css
│   ├── js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── api.js
│   │   ├── ui.js
│   │   └── materialize.min.js
│   └── assets
│       └── icons
├── .gitignore
└── README.md
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Open `public/index.html` in your browser to view the application.
4. Ensure you have a local server running to test the PWA features.

## Usage
- Use the login page to authenticate and access the dashboard.
- Register as a new client to start placing orders.
- Explore the dashboard for various food ordering options.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.