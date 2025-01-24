/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');


const html = `
    <div id="recipe-output"></div>
    <ul id="savedRecipesList"></ul>
    </form>
`;

document.body.innerHTML = html;

// Mock fetch API
global.fetch = jest.fn();

describe('Simple tests for recipe script', () => {
    beforeEach(() => {
        localStorage.clear();
        fetch.mockReset();
    });

    test('fetches list.txt and updates files array', async () => {
        fetch.mockResolvedValueOnce({
            text: () => Promise.resolve('recipe1.json\nrecipe2.json')
        });

        const files = [];
        await fetch('recipes/list.txt')
            .then(response => response.text())
            .then(text => {
                files.push(...text.trim().split('\n'));
            });

        expect(files).toEqual(['recipe1.json', 'recipe2.json']);
    });

    test('saves a recipe to localStorage', () => {
        const mockRecipe = {
            title: 'Test Recipe',
            url: 'https://example.com',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            directions: ['Step 1', 'Step 2']
        };

        const recipeDetails = [];
        recipeDetails.push(mockRecipe);
        localStorage.setItem('savedRecipesDetails', JSON.stringify(recipeDetails));

        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipesDetails'));
        expect(savedRecipes).toHaveLength(1);
        expect(savedRecipes[0].title).toBe('Test Recipe');
    });
});
