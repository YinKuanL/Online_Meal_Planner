const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


app.use(express.json());

app.use(express.static(path.join(__dirname, '..')));

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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});