// Ensure the relevant routes are set up
const express = require('express');
const commentController = require('./controllers/commentController');
const recipeController = require('./controllers/recipeController');

const app = express();
app.use(express.json());

// Set up the routes
app.delete('/delete-comment/:index', commentController.deleteComment); // Route to delete a comment by its index
app.post('/save-recipe', recipeController.saveRecipe); // Route to save a new recipe
app.put('/update-recipe/:title', recipeController.updateRecipe); // Route to update an existing recipe by title

module.exports = app;
