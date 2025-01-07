const request = require('supertest');
const app = require('../app'); // Import the app.js file
const fs = require('fs');
const path = require('path');

// Set up the test environment
beforeAll(() => {
    // Clean up test data
    const testDir = path.join(__dirname, '../../recipes');
    if (fs.existsSync(testDir)) {
        fs.rmdirSync(testDir, { recursive: true });  // Remove the test directory if it exists
    }
});

describe('Comment Controller Tests', () => {
    const commentsFilePath = path.join(__dirname, '../../comments.json');

    it('should return 404 if the comment is not found', async () => {
        const response = await request(app).delete('/delete-comment/999');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Comment not found');
    });

    it('should return 500 if there is an error reading the comments file', async () => {
        // Simulate a file read error
        fs.readFile = jest.fn().mockImplementation((path, encoding, callback) => callback(new Error('File read error')));

        const response = await request(app).delete('/delete-comment/0');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Error loading comments');
    });
});

describe('Recipe Controller Tests', () => {
    const recipesDirPath = path.join(__dirname, '../../recipes');
    const listFilePath = path.join(__dirname, '../../list.txt');

    beforeEach(() => {
        // Clean up the test folder before each test
        if (fs.existsSync(recipesDirPath)) {
            fs.rmdirSync(recipesDirPath, { recursive: true });  // Remove the recipes directory if it exists
        }
        if (fs.existsSync(listFilePath)) {
            fs.unlinkSync(listFilePath);  // Remove the list.txt file if it exists
        }
    });

    it('should save a recipe and return 200', async () => {
        const response = await request(app)
            .post('/save-recipe')
            .send({ recipe: 'Chicken Curry' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Recipe saved');
    });

    it('should return 400 if the recipe is missing', async () => {
        const response = await request(app)
            .post('/save-recipe')
            .send({});

        expect(response.status).toBe(400);
        expect(response.text).toBe('Recipe is required');
    });

    it('should update a recipe and return 200', async () => {
        const recipeData = { title: 'Chicken Curry', ingredients: ['Chicken', 'Curry powder', 'Rice'] };
        const response = await request(app)
            .put('/update-recipe/chicken-curry')
            .send(recipeData);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Recipe updated');
    });

    it('should return 500 if there is an error saving the recipe', async () => {
        // Simulate a file write error
        fs.appendFile = jest.fn().mockImplementation((path, data, callback) => callback(new Error('File write error')));

        const response = await request(app)
            .post('/save-recipe')
            .send({ recipe: 'Chicken Curry' });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error saving recipe');
    });
});

// Clean up test data after all tests
afterAll(() => {
    const testDir = path.join(__dirname, '../../recipes');
    if (fs.existsSync(testDir)) {
        fs.rmdirSync(testDir, { recursive: true });  // Remove the test directory if it exists
    }
});
