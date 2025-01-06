// recipeUtils.test.js
const { saveRecipe } = require('./recipeUtils');

beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
});

test('should save a recipe to localStorage', () => {
    const recipe = { title: 'Test Recipe', ingredients: ['ingredient1', 'ingredient2'] };
    saveRecipe(recipe);

    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes'));
    expect(savedRecipes).toHaveLength(1); // Ensure the recipe is saved
    expect(savedRecipes[0].title).toBe('Test Recipe'); // Ensure the recipe title is correct
});
