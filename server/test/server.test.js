const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

const commentsFilePath = path.join(__dirname, '../comments.json');
const recipesDirPath = path.join(__dirname, '../recipes');
const listFilePath = path.join(__dirname, '../list.txt');

beforeAll(() => {
    // Create mock files and directories if needed
    if (!fs.existsSync(recipesDirPath)) fs.mkdirSync(recipesDirPath);
    fs.writeFileSync(commentsFilePath, '[]');
    fs.writeFileSync(listFilePath, '');
});

afterAll(() => {
    // Clean up mock files and directories
    fs.rmSync(commentsFilePath, { force: true });
    fs.rmSync(listFilePath, { force: true });
    fs.rmdirSync(recipesDirPath, { recursive: true });
});

describe('API Routes', () => {
    describe('POST /save-recipe', () => {
        it('should save a recipe to the list file', async () => {
            const response = await request(app)
                .post('/save-recipe')
                .send({ recipe: 'Test Recipe' });
            expect(response.status).toBe(200);
            expect(response.text).toBe('Recipe saved');

            const listContent = fs.readFileSync(listFilePath, 'utf8');
            expect(listContent).toContain('Test Recipe');
        });

        it('should return 400 if recipe is not provided', async () => {
            const response = await request(app).post('/save-recipe').send({});
            expect(response.status).toBe(400);
            expect(response.text).toBe('Recipe is required');
        });
    });

    describe('GET /recipe-details/:title', () => {
        it('should return recipe details if the recipe exists', async () => {
            const recipeData = { title: 'Test Recipe', ingredients: [] };
            fs.writeFileSync(
                path.join(recipesDirPath, 'test-recipe.json'),
                JSON.stringify(recipeData)
            );

            const response = await request(app).get('/recipe-details/test-recipe');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(recipeData);
        });

        it('should return 404 if the recipe does not exist', async () => {
            const response = await request(app).get('/recipe-details/non-existent');
            expect(response.status).toBe(404);
            expect(response.text).toBe('Recipe not found');
        });
    });

    describe('PUT /recipe-details/:title', () => {
        it('should update an existing recipe', async () => {
            const recipeData = { title: 'Test Recipe', ingredients: [] };
            const updatedRecipe = { title: 'Test Recipe', ingredients: ['Eggs'] };
            const recipePath = path.join(recipesDirPath, 'test-recipe.json');
            fs.writeFileSync(recipePath, JSON.stringify(recipeData));

            const response = await request(app)
                .put('/recipe-details/test-recipe')
                .send(updatedRecipe);
            expect(response.status).toBe(200);
            expect(response.text).toBe('Recipe updated');

            const savedRecipe = JSON.parse(fs.readFileSync(recipePath, 'utf8'));
            expect(savedRecipe).toEqual(updatedRecipe);
        });
    });

    describe('DELETE /recipe-details/:title', () => {
        it('should delete an existing recipe', async () => {
            const recipePath = path.join(recipesDirPath, 'test-recipe.json');
            fs.writeFileSync(recipePath, JSON.stringify({ title: 'Test Recipe' }));

            const response = await request(app).delete('/recipe-details/test-recipe');
            expect(response.status).toBe(200);
            expect(response.text).toBe('Recipe deleted');
            expect(fs.existsSync(recipePath)).toBe(false);
        });

        it('should return 404 if the recipe does not exist', async () => {
            const response = await request(app).delete('/recipe-details/non-existent');
            expect(response.status).toBe(404);
            expect(response.text).toBe('Recipe not found');
        });
    });

    describe('GET /comments', () => {
        it('should fetch all comments', async () => {
            const comments = [{ name: 'John', comment: 'Great recipe!' }];
            fs.writeFileSync(commentsFilePath, JSON.stringify(comments));

            const response = await request(app).get('/comments');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(comments);
        });
    });

    describe('POST /comments', () => {
        it('should add a new comment', async () => {
            const newComment = { name: 'Jane', comment: 'Loved it!' };

            const response = await request(app).post('/comments').send(newComment);
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newComment);

            const savedComments = JSON.parse(fs.readFileSync(commentsFilePath, 'utf8'));
            expect(savedComments).toContainEqual(expect.objectContaining(newComment));
        });

        it('should return 400 if name or comment is missing', async () => {
            const response = await request(app).post('/comments').send({ name: 'Jane' });
            expect(response.status).toBe(400);
            expect(response.text).toBe('Name and comment are required');
        });
    });

    describe('404 Handling', () => {
        it('should return 404 for unknown routes', async () => {
            const response = await request(app).get('/unknown-route');
            expect(response.status).toBe(404);
            expect(response.text).toBe('Not Found');
        });
    });
});
