const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const commentsFilePath = path.join(__dirname, 'comments.json');
const recipesDirPath = path.join(__dirname, 'recipes');
const listFilePath = path.join(__dirname, 'list.txt');

app.use(express.json());
app.use(express.static('static'));

// Helper function to handle file operations
const handleFileError = (res, err, message) => {
    console.error(message, err);
    res.status(500).send(message);
};

// Create or update a recipe
app.post('/save-recipe', (req, res) => {
    const { recipe } = req.body;
    if (!recipe) return res.status(400).send('Recipe is required');

    fs.appendFile(listFilePath, `${recipe}\n`, (err) => {
        if (err) return handleFileError(res, err, 'Error saving recipe');
        res.status(200).send('Recipe saved');
    });
});

// Get recipe details
app.get('/recipe-details/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const recipeFilePath = path.join(recipesDirPath, `${title}.json`);

    fs.readFile(recipeFilePath, 'utf8', (err, data) => {
        if (err) return res.status(404).send('Recipe not found');
        res.json(JSON.parse(data));
    });
});

// Update a recipe
app.put('/recipe-details/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const updatedRecipe = req.body;
    const recipeFilePath = path.join(recipesDirPath, `${title}.json`);

    fs.writeFile(recipeFilePath, JSON.stringify(updatedRecipe, null, 4), (err) => {
        if (err) return handleFileError(res, err, 'Error updating recipe');
        res.status(200).send('Recipe updated');
    });
});

// Delete a recipe
app.delete('/recipe-details/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const recipeFilePath = path.join(recipesDirPath, `${title}.json`);

    fs.unlink(recipeFilePath, (err) => {
        if (err) return res.status(404).send('Recipe not found');
        res.status(200).send('Recipe deleted');
    });
});

// Fetch all comments
app.get('/comments', (req, res) => {
    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err) return handleFileError(res, err, 'Error loading comments');
        res.json(JSON.parse(data || '[]'));
    });
});

// Add a new comment
app.post('/comments', (req, res) => {
    const { name, comment } = req.body;
    if (!name || !comment) return res.status(400).send('Name and comment are required');

    const newComment = { name, comment, timestamp: new Date().toISOString() };

    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        let comments = [];
        if (!err) comments = JSON.parse(data || '[]');

        comments.push(newComment);
        fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 4), (writeErr) => {
            if (writeErr) return handleFileError(res, writeErr, 'Error saving comment');
            res.status(201).json(newComment);
        });
    });
});

// Handle missing files or directories
app.use((req, res) => {
    res.status(404).send('Not Found');
});

module.exports = app;