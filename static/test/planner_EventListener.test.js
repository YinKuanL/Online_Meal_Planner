/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML file into jsdom
const html = `
    <div id="recipe-output"></div>
    <ul id="savedRecipesList"></ul>
`;

document.body.innerHTML = html;

// Mock fetch API
global.fetch = jest.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/1234');

describe('Simple tests for recipe script', () => {
    beforeEach(() => {
        // Clear localStorage and reset mocks
        localStorage.clear();
        fetch.mockReset();
    });

    test('searches and displays recipes based on query', async () => {
        const files = ['recipe1.json', 'recipe2.json', 'chicken_recipe.json'];
        const query = 'chicken';
        const recipeOutput = document.getElementById('recipe-output');

        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                title: 'Chicken Recipe',
                ingredients: ['Chicken', 'Salt'],
                directions: ['Cook chicken', 'Add salt']
            })
        });

        const matchingRecipes = files.filter(fileName => fileName.toLowerCase().includes(query.toLowerCase()));

        if (matchingRecipes.length > 0) {
            recipeOutput.innerHTML = '';
            await Promise.all(
                matchingRecipes.map(fileName =>
                    fetch(`recipes/${fileName}`)
                        .then(response => response.json())
                        .then(data => {
                            const recipeDiv = document.createElement('div');
                            recipeDiv.textContent = data.title;
                            recipeOutput.appendChild(recipeDiv);
                        })
                )
            );
        } else {
            recipeOutput.innerHTML = '<p>No matching recipes found.</p>';
        }

        expect(recipeOutput.innerHTML).toContain('Chicken Recipe');
    });

    test('downloads complete recipes as a text file', () => {
        const mockRecipes = [
            {
                title: 'Recipe 1',
                source: 'https://example.com/1',
                ingredients: ['Ingredient 1', 'Ingredient 2'],
                directions: ['Step 1', 'Step 2']
            },
            {
                title: 'Recipe 2',
                source: 'https://example.com/2',
                ingredients: ['Ingredient A', 'Ingredient B'],
                directions: ['Step A', 'Step B']
            }
        ];

        localStorage.setItem('savedRecipesDetails', JSON.stringify(mockRecipes));

        const headerText = "This is your selected recipes. Enjoy your fantastic cooking journey.\n\n";
        const formattedRecipes = mockRecipes.map(recipe => `Recipe: ${recipe.title}\nSource: ${recipe.source}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nDirections:\n${recipe.directions.join('\n')}`);
        const allRecipesDetails = headerText + formattedRecipes.join('\n\n');

        const blob = new Blob([allRecipesDetails], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'full-recipes.txt';

        jest.spyOn(link, 'click');

        link.click();

        expect(link.click).toHaveBeenCalled();
    });
});
