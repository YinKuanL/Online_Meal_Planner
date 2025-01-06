const fs = require('fs');
const path = require('path');

// 假設儲存食譜的資料夾
const recipesDirPath = path.join(__dirname, '../recipes');
// 假設儲存食譜名稱的文字檔
const listFilePath = path.join(__dirname, '../list.txt');

// 處理檔案錯誤的統一函數
const handleFileError = (res, err, message) => {
    console.error(err);
    res.status(500).send(message);
};

// 確保食譜資料夾存在
const ensureRecipesDirExists = () => {
    if (!fs.existsSync(recipesDirPath)) {
        fs.mkdirSync(recipesDirPath);
    }
};

// 創建或更新食譜
exports.saveRecipe = (req, res) => {
    const { recipe } = req.body;
    if (!recipe) return res.status(400).send('Recipe is required');

    // 確保 list.txt 檔案存在
    fs.appendFile(listFilePath, `${recipe}\n`, (err) => {
        if (err) return handleFileError(res, err, 'Error saving recipe');
        res.status(200).send('Recipe saved');
    });
};

// 更新食譜
exports.updateRecipe = (req, res) => {
    const title = req.params.title.toLowerCase();
    const updatedRecipe = req.body;
    const recipeFilePath = path.join(recipesDirPath, `${title}.json`);

    // 確保食譜資料夾存在
    ensureRecipesDirExists();

    fs.writeFile(recipeFilePath, JSON.stringify(updatedRecipe, null, 4), (err) => {
        if (err) return handleFileError(res, err, 'Error updating recipe');
        res.status(200).send('Recipe updated');
    });
};
