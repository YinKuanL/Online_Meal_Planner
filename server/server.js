const app = require('./app'); // 載入 app.js
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
