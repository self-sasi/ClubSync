import express from 'express';
import { pool } from '../database.js';
const app = express();
const PORT = 3000;
app.get('/', (req, res) => {
    res.json({ message: "hello how are you" });
});
app.get('/users', async (req, res) => {
    try {
        const [data] = await pool.query("SELECT * FROM users");
        res.json(data);
    }
    catch {
        res.status(500).json({ message: "db query failed" });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map