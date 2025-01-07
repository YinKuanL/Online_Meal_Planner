const app = require('./app'); // Import the app from app.js
const PORT = 3001;  // Define the port the server will listen on

// Start the server and log the URL to the console
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);  // Output the server's running address
});

module.exports = app;  // Export the app for use in other modules
