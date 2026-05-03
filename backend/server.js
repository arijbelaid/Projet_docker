const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log('Tentative de connexion à la base de données...');
console.log(` Configuration: \${process.env.DB_HOST}:\${process.env.DB_PORT}/\${process.env.DB_NAME}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

promisePool.query('SELECT 1')
    .then(() => {
        console.log(' Connexion à la base de données établie avec succès!');
        console.log('Base de données:', process.env.DB_NAME);
    })
    .catch(err => {
        console.error(' Erreur de connexion à la base de données:', err.message);
    });

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/contacts', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/contacts', async (req, res) => {
    const { nom, email, telephone } = req.body;
    
    if (!nom || !email || !telephone) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        const [result] = await promisePool.query(
            'INSERT INTO contacts (nom, email, telephone) VALUES (?, ?, ?)',
            [nom, email, telephone]
        );
        
        const [newContact] = await promisePool.query('SELECT * FROM contacts WHERE id = ?', [result.insertId]);
        res.status(201).json(newContact[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.put('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, email, telephone } = req.body;

    try {
        await promisePool.query(
            'UPDATE contacts SET nom = ?, email = ?, telephone = ? WHERE id = ?',
            [nom, email, telephone, id]
        );
        
        const [updated] = await promisePool.query('SELECT * FROM contacts WHERE id = ?', [id]);
        res.json(updated[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await promisePool.query('DELETE FROM contacts WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend démarré sur le port ${PORT}`);
});
