document.addEventListener('DOMContentLoaded', function () {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const savedRecipesList = document.getElementById('savedRecipesList');
    const form = document.getElementById('meal-form');
    let files = [];

    updateSavedRecipes();

    fetch('recipes/list.txt')
        .then(response => response.text())
        .then(text => {
            files = text.trim().split('\n');
            const storedRecipe = JSON.parse(localStorage.getItem('currentRecipe'));
            if (storedRecipe) {
                renderRecipe(storedRecipe);
            } else {
                fetchAndRenderRandomRecipe();
            }
        })
        .catch(error => console.error('Error loading the list.txt file:', error));

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const preference = document.getElementById('preference').value.toLowerCase();
        searchAndDisplayRecipes(preference);
    });

    function searchAndDisplayRecipes(query) {
        const matchingRecipes = files.filter(fileName => fileName.toLowerCase().includes(query));

        if (matchingRecipes.length > 0) {
            document.getElementById('recipe-output').innerHTML = '';
            matchingRecipes.forEach(fileName => {
                fetch(`recipes/${fileName}`)
                    .then(response => response.json())
                    .then(data => renderRecipe(data))
                    .catch(error => console.error(`Error loading ${fileName}:`, error));
            });
        } else {
            document.getElementById('recipe-output').innerHTML = '<p>No matching recipes found.</p>';
        }
    }

    function fetchAndRenderRandomRecipe() {
        const randomFile = getRandomFiles(files, 1)[0];
        fetchAndRenderRecipe(randomFile);
    }

    function fetchAndRenderRecipe(fileName) {
        fetch(`recipes/${fileName}`)
            .then(response => response.json())
            .then(data => {
                renderRecipe(data);
                localStorage.setItem('currentRecipe', JSON.stringify(data));
            })
            .catch(error => console.error(`Error loading ${fileName}:`, error));
    }

    function getRandomFiles(files, count) {
        return files.sort(() => 0.5 - Math.random()).slice(0, count);
    }

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

            recipeDiv.querySelector('.save-recipe').addEventListener('click', function () {
                saveRecipe(recipe.title);
            });

            document.getElementById('new-recipe').addEventListener('click', fetchAndRenderRandomRecipe);
            document.getElementById('clear-last-recipe').addEventListener('click', clearLastRecipe);
        }
    }

    function saveRecipe(recipeTitle) {
        if (!savedRecipes.includes(recipeTitle)) {
            // 儲存到本地儲存
            savedRecipes.push(recipeTitle);
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
            updateSavedRecipes();

            // 約定向後端伺服器發送POST請求
            fetch('/save-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ recipe: recipeTitle })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => console.log(data))
                .catch(error => console.error('Error saving recipe to server:', error));
        }
    }

    function clearLastRecipe() {
        if (savedRecipes.length > 0) {
            savedRecipes.pop();
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
            updateSavedRecipes();
        } else {
            console.log('No more recipes to clear.');
        }
    }

    function updateSavedRecipes() {
        if (savedRecipesList) {
            savedRecipesList.innerHTML = '';
            savedRecipes.forEach(recipe => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = recipe;
                savedRecipesList.appendChild(li);
            });
        }
    }

    document.getElementById('download-recipes').addEventListener('click', downloadCompleteRecipes);

    function downloadCompleteRecipes() {
        const recipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

        // Create an array of promises that resolve to full recipe details
        const promises = recipes.map(recipeTitle => getFullRecipeDetails(recipeTitle));

        // Use Promise.all to ensure all promises are resolved
        Promise.all(promises)
            .then(recipesDetails => {
                const allRecipesDetails = recipesDetails.join('\n\n');
                const blob = new Blob([allRecipesDetails], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'full-recipes.txt';
                link.click();
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
            });
    }

    function getFullRecipeDetails(recipeTitle) {
        return fetch('/recipes/list.txt')
            .then(response => response.text())
            .then(text => {
                // Split the list into an array and find the matching file
                const files = text.trim().split('\n').map(file => file.toLowerCase());
                const matchingFile = files.find(file => file.includes(recipeTitle.toLowerCase()));

                if (!matchingFile) {
                    throw new Error(`Recipe ${recipeTitle} file not found`);
                }

                console.log(`Fetching file: ${matchingFile}`);  // Log the file name being fetched

                // Fetch the matching file
                return fetch(`recipes/${matchingFile}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error loading recipe file: ${matchingFile}`);
                }
                return response.json();
            })
            .then(recipe => {
                console.log(`Read title: ${recipe.title}`);  // Log the title read from the file
                return `
                Recipe: ${recipe.title}
                Source: ${recipe.source || 'Unknown'}
                
                Ingredients:
                ${recipe.ingredients.join('\n')}
                
                Directions:
                ${recipe.directions.join('\n')}
            `;
            })
            .catch(error => {
                console.error('Error fetching recipe details:', error);
                return `Recipe: ${recipeTitle} (Details not available)`;
            });
    }
});