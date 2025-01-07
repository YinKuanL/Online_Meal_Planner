const fs = require('fs');
const path = require('path');

// Define the folder where recipes are stored
const recipesDirPath = path.join(__dirname, '../recipes');
const listFilePath = path.join(__dirname, '../list.txt');

// Unified function to handle file errors
const handleFileError = (res, err, message) => {
    console.error(err);
    res.status(500).send(message);  // If there is a file error, return 500
};

// Ensure the recipes directory exists
const ensureRecipesDirExists = () => {
    if (!fs.existsSync(recipesDirPath)) {
        fs.mkdirSync(recipesDirPath);  // Create the directory if it doesn't exist
    }
};

// Save or update a recipe
exports.saveRecipe = (req, res) => {
    const { recipe } = req.body;
    if (!recipe) return res.status(400).send('Recipe is required');  // If the recipe is missing, return 400

    // Ensure the list.txt file exists
    fs.appendFile(listFilePath, `${recipe}\n`, (err) => {
        if (err) return handleFileError(res, err, 'Error saving recipe');  // If there is an error saving the recipe, return 500
        res.status(200).send('Recipe saved');  // Successfully saved the recipe, return 200
    });
};

// Update a recipe
exports.updateRecipe = (req, res) => {
    const title = req.params.title.toLowerCase();
    const updatedRecipe = req.body;
    const recipeFilePath = path.join(recipesDirPath, `${title}.json`);

    if (!updatedRecipe) return res.status(400).send('Updated recipe data is required');  // If the updated recipe data is missing, return 400

    // Ensure the recipes directory exists
    ensureRecipesDirExists();

    fs.writeFile(recipeFilePath, JSON.stringify(updatedRecipe, null, 4), (err) => {
        if (err) return handleFileError(res, err, 'Error updating recipe');  // If there is an error updating the recipe, return 500
        res.status(200).send('Recipe updated');  // Successfully updated the recipe, return 200
    });
};
