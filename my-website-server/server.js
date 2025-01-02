const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const commentsFilePath = path.join(__dirname, 'comments.json');



app.use(express.json());

app.use(express.static('static'));

app.post('/save-recipe', (req, res) => {
    const { recipe } = req.body;
    fs.appendFile(path.join(__dirname, 'list.txt'), `${recipe}\n`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving recipe');
        }
        res.status(200).send('Recipe saved');
    });
});

app.get('/recipe-details/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const listFilePath = path.join(__dirname, 'list.txt');
    const recipeDirPath = path.join(__dirname, 'recipes');

    // Read list.txt to get the list of recipes
    fs.readFile(listFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading list.txt:', err);
            return res.status(500).send('Error reading recipe list');
        }

        const recipesList = data.trim().split('\n').map(recipe => recipe.toLowerCase());

        if (!recipesList.includes(title)) {
            return res.status(404).send('Recipe not listed in list.txt');
        }

        // Make the recipe file path in lowercase
        const recipeFilePath = path.join(recipeDirPath, `${title}.json`);

        // Read the recipe JSON file
        fs.readFile(recipeFilePath, 'utf8', (err, recipeData) => {
            if (err) {
                console.error('Error reading recipe file:', err);
                return res.status(404).send('Recipe file not found');
            }

            res.json(JSON.parse(recipeData));
        });
    });
});

// Add this after your existing routes in the Node.js server file:

// API to fetch all comments
app.get('/comments', (req, res) => {
    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading comments:', err);
            return res.status(500).send('Error loading comments');
        }
        res.json(JSON.parse(data || '[]')); // Return parsed JSON or empty array if file content is empty
    });
});

// API to save a comment
app.post('/comments', (req, res) => {
    const { name, comment } = req.body;

    if (!name || !comment) {
        return res.status(400).send('Name and comment are required');
    }

    const newComment = { name, comment, timestamp: new Date().toISOString() };

    // Read the existing comments, append the new one, and save the file
    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        let comments = [];
        if (!err) {
            comments = JSON.parse(data || '[]');
        }
        comments.push(newComment);

        fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 4), (writeErr) => {
            if (writeErr) {
                console.error('Error saving comment:', writeErr);
                return res.status(500).send('Error saving comment');
            }
            res.status(201).json(newComment);
        });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});