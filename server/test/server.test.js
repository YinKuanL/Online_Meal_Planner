const request = require('supertest');
const app = require('../app'); // 引入 app.js 檔案
const fs = require('fs');
const path = require('path');

const commentsFilePath = path.join(__dirname, '../../comments.json');
const recipesDirPath = path.join(__dirname, '../../recipes');
const listFilePath = path.join(__dirname, '../../list.txt');

// 清理測試資料
const cleanUpTestData = () => {
    if (fs.existsSync(commentsFilePath)) {
        fs.unlinkSync(commentsFilePath);
    }
    if (fs.existsSync(listFilePath)) {
        fs.unlinkSync(listFilePath);
    }
    if (fs.existsSync(recipesDirPath)) {
        fs.rmdirSync(recipesDirPath, { recursive: true });
    }
};

beforeEach(() => {
    cleanUpTestData();
});

describe('Recipe Controller Tests', () => {
    it('應該成功儲存食譜並回傳 200', async () => {
        const recipeData = {
            title: '1-2-3 Cherry Poke Cake',
            ingredients: [
                '1 (16 ounce) loaf frozen pound cake, thawed',
                '3/4 cup boiling water',
                '1 (3 ounce) package JELL-O Cherry Flavor Gelatin',
                '1/4 cup cold water',
                '1 ounce BAKER\'S Semi-Sweet Chocolate',
                '2 cups thawed COOL WHIP Whipped Topping, divided',
                '1 1/2 cups cherry pie filling, divided'
            ],
            directions: [
                'Remove foil lid from cake package. (Do not remove cake from pan.) Pierce cake with skewer at 1/2-inch intervals, poking skewer through cake to bottom of pan.',
                'Add boiling water to gelatin mix in small bowl; stir 2 min. until completely dissolved. Stir in cold water; pour over cake. Refrigerate 1 hour. Meanwhile, make curls from semi-sweet chocolate.',
                'Invert cake onto platter. Cut cake horizontally in half. Spread bottom half of cake with 1/3 cup COOL WHIP; cover with 1 cup pie filling and top cake layer. Frost top and sides of cake with remaining COOL WHIP. Garnish with remaining pie filling and chocolate curls.'
            ],
            language: 'en-US',
            source: 'allrecipes.com',
            url: 'http://allrecipes.com/recipe/235063/1-2-3-cherry-poke-cake/'
        };

        const response = await request(app)
            .post('/save-recipe')
            .send(recipeData);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Recipe saved');
    });

    it('如果食譜缺失，應該回傳 400', async () => {
        const response = await request(app)
            .post('/save-recipe')
            .send({});

        expect(response.status).toBe(400);
        expect(response.text).toBe('Recipe is required');
    });

    it('應該成功取得食譜詳細資料並回傳 200', async () => {
        const recipeData = {
            title: '1-2-3 Cherry Poke Cake',
            ingredients: [
                '1 (16 ounce) loaf frozen pound cake, thawed',
                '3/4 cup boiling water',
                '1 (3 ounce) package JELL-O Cherry Flavor Gelatin',
                '1/4 cup cold water',
                '1 ounce BAKER\'S Semi-Sweet Chocolate',
                '2 cups thawed COOL WHIP Whipped Topping, divided',
                '1 1/2 cups cherry pie filling, divided'
            ],
            directions: [
                'Remove foil lid from cake package. (Do not remove cake from pan.) Pierce cake with skewer at 1/2-inch intervals, poking skewer through cake to bottom of pan.',
                'Add boiling water to gelatin mix in small bowl; stir 2 min. until completely dissolved. Stir in cold water; pour over cake. Refrigerate 1 hour. Meanwhile, make curls from semi-sweet chocolate.',
                'Invert cake onto platter. Cut cake horizontally in half. Spread bottom half of cake with 1/3 cup COOL WHIP; cover with 1 cup pie filling and top cake layer. Frost top and sides of cake with remaining COOL WHIP. Garnish with remaining pie filling and chocolate curls.'
            ],
            language: 'en-US',
            source: 'allrecipes.com',
            url: 'http://allrecipes.com/recipe/235063/1-2-3-cherry-poke-cake/'
        };

        // 儲存食譜
        await request(app)
            .post('/save-recipe')
            .send(recipeData);

        // 模擬取得食譜詳細資料
        const response = await request(app)
            .get('/recipe-details/1-2-3-cherry-poke-cake');

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('1-2-3 Cherry Poke Cake');
        expect(response.body.ingredients).toEqual([
            '1 (16 ounce) loaf frozen pound cake, thawed',
            '3/4 cup boiling water',
            '1 (3 ounce) package JELL-O Cherry Flavor Gelatin',
            '1/4 cup cold water',
            '1 ounce BAKER\'S Semi-Sweet Chocolate',
            '2 cups thawed COOL WHIP Whipped Topping, divided',
            '1 1/2 cups cherry pie filling, divided'
        ]);
    });

    it('如果食譜不存在，應該回傳 404', async () => {
        const response = await request(app)
            .get('/recipe-details/non-existent-recipe');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Recipe not found');
    });

    it('應該成功更新食譜並回傳 200', async () => {
        const recipeData = {
            title: '1-2-3 Cherry Poke Cake',
            ingredients: [
                '1 (16 ounce) loaf frozen pound cake, thawed',
                '3/4 cup boiling water',
                '1 (3 ounce) package JELL-O Cherry Flavor Gelatin',
                '1/4 cup cold water',
                '1 ounce BAKER\'S Semi-Sweet Chocolate',
                '2 cups thawed COOL WHIP Whipped Topping, divided',
                '1 1/2 cups cherry pie filling, divided'
            ],
            directions: [
                'Remove foil lid from cake package. (Do not remove cake from pan.) Pierce cake with skewer at 1/2-inch intervals, poking skewer through cake to bottom of pan.',
                'Add boiling water to gelatin mix in small bowl; stir 2 min. until completely dissolved. Stir in cold water; pour over cake. Refrigerate 1 hour. Meanwhile, make curls from semi-sweet chocolate.',
                'Invert cake onto platter. Cut cake horizontally in half. Spread bottom half of cake with 1/3 cup COOL WHIP; cover with 1 cup pie filling and top cake layer. Frost top and sides of cake with remaining COOL WHIP. Garnish with remaining pie filling and chocolate curls.'
            ],
            language: 'en-US',
            source: 'allrecipes.com',
            url: 'http://allrecipes.com/recipe/235063/1-2-3-cherry-poke-cake/'
        };

        // 儲存食譜
        await request(app)
            .post('/save-recipe')
            .send(recipeData);

        // 更新食譜
        const updatedRecipeData = {
            title: '1-2-3 Cherry Poke Cake',
            ingredients: [
                '1 (16 ounce) loaf frozen pound cake, thawed',
                '3/4 cup boiling water',
                '1 (3 ounce) package JELL-O Cherry Flavor Gelatin',
                '1/4 cup cold water',
                '1 ounce BAKER\'S Semi-Sweet Chocolate',
                '2 cups thawed COOL WHIP Whipped Topping, divided',
                '1 1/2 cups cherry pie filling, divided'
            ],
            directions: [
                'Remove foil lid from cake package. (Do not remove cake from pan.) Pierce cake with skewer at 1/2-inch intervals, poking skewer through cake to bottom of pan.',
                'Add boiling water to gelatin mix in small bowl; stir 2 min. until completely dissolved. Stir in cold water; pour over cake. Refrigerate 1 hour. Meanwhile, make curls from semi-sweet chocolate.',
                'Invert cake onto platter. Cut cake horizontally in half. Spread bottom half of cake with 1/3 cup COOL WHIP; cover with 1 cup pie filling and top cake layer. Frost top and sides of cake with remaining COOL WHIP. Garnish with remaining pie filling and chocolate curls.'
            ]
        };

        const response = await request(app)
            .put('/recipe-details/1-2-3-cherry-poke-cake')
            .send(updatedRecipeData);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Recipe updated');
    });

    it('如果儲存食譜時發生錯誤，應該回傳 500', async () => {
        // 模擬寫入檔案錯誤
        fs.appendFile = jest.fn().mockImplementation((path, data, callback) => callback(new Error('File write error')));

        const recipeData = {
            title: '1-2-3 Cherry Poke Cake',
            ingredients: [
                '1 (16 ounce) loaf frozen pound cake, thawed',
                '3/4 cup boiling water',
                '1 (3 ounce) package JELL-O Cherry Flavor Gelatin',
                '1/4 cup cold water',
                '1 ounce BAKER\'S Semi-Sweet Chocolate',
                '2 cups thawed COOL WHIP Whipped Topping, divided',
                '1 1/2 cups cherry pie filling, divided'
            ],
            directions: [
                'Remove foil lid from cake package. (Do not remove cake from pan.) Pierce cake with skewer at 1/2-inch intervals, poking skewer through cake to bottom of pan.',
                'Add boiling water to gelatin mix in small bowl; stir 2 min. until completely dissolved. Stir in cold water; pour over cake. Refrigerate 1 hour. Meanwhile, make curls from semi-sweet chocolate.',
                'Invert cake onto platter. Cut cake horizontally in half. Spread bottom half of cake with 1/3 cup COOL WHIP; cover with 1 cup pie filling and top cake layer. Frost top and sides of cake with remaining COOL WHIP. Garnish with remaining pie filling and chocolate curls.'
            ]
        };

        const response = await request(app)
            .post('/save-recipe')
            .send(recipeData);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error saving recipe');
    });
});

describe('Comment Controller Tests', () => {
    it('應該成功新增評論並回傳 201', async () => {
        const response = await request(app)
            .post('/comments')
            .send({ name: 'John', comment: 'Great recipe!' });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('John');
        expect(response.body.comment).toBe('Great recipe!');
    });

    it('如果評論缺少名稱，應該回傳 400', async () => {
        const response = await request(app)
            .post('/comments')
            .send({ comment: 'Great recipe!' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Name and comment are required');
    });

    it('如果評論缺少內容，應該回傳 400', async () => {
        const response = await request(app)
            .post('/comments')
            .send({ name: 'John' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Name and comment are required');
    });

    it('應該成功取得所有評論並回傳 200', async () => {
        // 新增評論
        await request(app)
            .post('/comments')
            .send({ name: 'Jane', comment: 'Delicious!' });

        const response = await request(app).get('/comments');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[1].name).toBe('Jane');
        expect(response.body[1].comment).toBe('Delicious!');
    });

    it('如果讀取評論檔案時發生錯誤，應該回傳 500', async () => {
        // 模擬讀取檔案錯誤
        fs.readFile = jest.fn().mockImplementation((path, encoding, callback) => callback(new Error('File read error')));

        const response = await request(app).get('/comments');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Error loading comments');
    });
});

// 清理測試資料
afterAll(() => {
    cleanUpTestData();
});
