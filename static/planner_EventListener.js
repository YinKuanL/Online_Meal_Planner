document.addEventListener('DOMContentLoaded', function () {
    // Retrieve saved recipes from local storage or initialize an empty array
    const savedRecipesList = document.getElementById('savedRecipesList');
    const savedRecipesDetails = document.getElementById('savedRecipesDetails');
    let files = [];

    // Update the list of saved recipes in the UI
    updateSavedRecipes();

    // Fetch the list of recipe files
    fetch('recipes/list.txt')
        .then(response => response.text())
        .then(text => {
            files = text.trim().split('\n'); // Split file list into an array of filenames
            const storedRecipe = JSON.parse(localStorage.getItem('currentRecipe'));

            console.log(savedRecipesDetails);
            console.log(storedRecipe);

            // If a recipe is stored, render it, otherwise fetch and render a random recipe
            if (storedRecipe) {
                renderRecipe(storedRecipe);
            } else {
                fetchAndRenderRandomRecipe();
            }
        })
        .catch(error => console.error('Error loading the list.txt file:', error));

    // Fetch and render a random recipe from the list
    function fetchAndRenderRandomRecipe() {
        const randomFile = getRandomFiles(files, 1)[0];
        console.log(randomFile);
        fetchAndRenderRecipe(randomFile);
    }

    // Fetch a recipe from a file and render it
    function fetchAndRenderRecipe(fileName) {
        fetch(`recipes/${fileName}`)
            .then(response => response.json())
            .then(data => {
                renderRecipe(data);
                localStorage.setItem('currentRecipe', JSON.stringify(data));
            })
            .catch(error => console.error(`Error loading ${fileName}:`, error));
    }

    function searchAndDisplayRecipes(query) {
        const matchingRecipes = files.filter(fileName => fileName.toLowerCase().includes(query.toLowerCase()));
        const recipeOutput = document.getElementById('recipe-output');
        if (matchingRecipes.length > 0) {
            recipeOutput.innerHTML = '';
            matchingRecipes.forEach(fileName => {
                fetch(`recipes/${fileName}`)
                    .then(response => response.json())
                    .then(data => renderRecipe(data))
                    .catch(error => console.error(`Error loading ${fileName}:`, error));
            });
        } else {
            recipeOutput.innerHTML = '<p>No matching recipes found.</p>';
        }
    }

    // Select random files from a list
    function getRandomFiles(files, count) {
        return files.sort(() => 0.5 - Math.random()).slice(0, count);
    }

    // Render the recipe on the webpage
    function renderRecipe(recipe) {
        const recipeOutput = document.getElementById('recipe-output');
        if (recipeOutput) {
            recipeOutput.innerHTML = '';
            const recipeDiv = document.createElement('div');
            recipeDiv.innerHTML = `
                <h3>${recipe.title}</h3>
                <p><strong>Source:</strong> <a href="${recipe.url}" target="_blank">${recipe.source}</a></p>
                <h4>Ingredients:</h4>
                <ul>${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
                <h4>Directions:</h4>
                <ol>${recipe.directions.map(direction => `<li>${direction}</li>`).join('')}</ol>
                <button class="btn btn-primary save-recipe">Save Recipe</button>
                <button id="new-recipe" class="btn btn-secondary">New One</button>
                <button id="clear-last-recipe" class="btn btn-danger">Clear Last Recipe</button>
            `;
            recipeOutput.appendChild(recipeDiv);

            // Event listeners for buttons within the recipe
            recipeDiv.querySelector('.save-recipe').addEventListener('click', function () {
                saveRecipe(recipe); // Pass the entire recipe object to the saveRecipe function
            });

            // Fetch a new random recipe
            document.getElementById('new-recipe').addEventListener('click', fetchAndRenderRandomRecipe);
            document.getElementById('clear-last-recipe').addEventListener('click', clearLastRecipe);

            // Event listener for download button
            document.getElementById('download-recipes').addEventListener('click', downloadCompleteRecipes);

            document.getElementById('meal-form').addEventListener('submit', function (event) {
                event.preventDefault();
                const preference = document.getElementById('preference').value.toLowerCase();
                searchAndDisplayRecipes(preference);
            });
        }
    }

    // Save a recipe to local storage
    function saveRecipe(recipe) {
        const recipeDetails = JSON.parse(localStorage.getItem('savedRecipesDetails')) || [];

        // Check if the recipe is already saved
        const isAlreadySaved = recipeDetails.some(savedRecipe => savedRecipe.title === recipe.title);
        if (!isAlreadySaved) {
            // Save the recipe details to local storage
            recipeDetails.push(recipe);
            localStorage.setItem('savedRecipesDetails', JSON.stringify(recipeDetails));
            updateSavedRecipes();
        }
    }

    // Update the list of saved recipes in the UI
    function updateSavedRecipes() {
        const savedRecipesDetails = JSON.parse(localStorage.getItem('savedRecipesDetails')) || [];
        if (savedRecipesList) {
            savedRecipesList.innerHTML = '';
            savedRecipesDetails.forEach(recipe => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = recipe.title;
                savedRecipesList.appendChild(li);
            });
        }
    }

    // Clear the last saved recipe
    function clearLastRecipe() {
        const recipeDetails = JSON.parse(localStorage.getItem('savedRecipesDetails')) || [];

        if (recipeDetails.length > 0) {
            recipeDetails.pop();
            localStorage.setItem('savedRecipesDetails', JSON.stringify(recipeDetails));
            updateSavedRecipes();
        } else {
            console.log('No more recipes to clear.');
        }
    }

    // Download all saved recipes as a text file
    function downloadCompleteRecipes() {
        const recipeDetails = JSON.parse(localStorage.getItem('savedRecipesDetails')) || [];

        if (recipeDetails.length === 0) {
            console.log('No recipes to download.');
            return;
        }

        const headerText = "This is your selected recipes. Enjoy your fantastic cooking journey.\n\n";
        const formattedRecipes = recipeDetails.map(recipe => formatRecipe(recipe));

        // Join header text with recipes
        const allRecipesDetails = headerText + formattedRecipes.join('\n\n');

        // Create and trigger a download link
        const blob = new Blob([allRecipesDetails], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'full-recipes.txt';
        link.click();
    }

    // Helper function to format each recipe nicely
    function formatRecipe(recipe) {
        return `Recipe: ${recipe.title}
Source: ${recipe.source || 'Unknown'}
        
Ingredients:
${recipe.ingredients.join('\n')}
        
Directions:
${recipe.directions.join('\n')}`;
    }
});
