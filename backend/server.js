require('dotenv').config();
const express = require('express');
const cors = require('cors');
const booksRoutes = require('./routes/booksRoutes');
const pool = require('./db/conexion');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - IMPORTANT!
const corsOptions = {
    origin: [
        'https://YOUR-USERNAME.github.io',  // ← UPDATE THIS with your GitHub Pages URL
        'http://localhost:5500',            // For local development
        'http://127.0.0.1:5500'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
    res.send('Hola Fer Vela!! API BookLibrary funcionando correctamente');
});

// Rutas principales
app.use('/api/books', booksRoutes);

// Funcion que hace una consulta de prueba mínima
async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Hola Fer Vela!! Conexión a la base de datos establecida. Resultado:', rows[0].result);
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    }
}

// Iniciar servidor y probar conexión
app.listen(PORT, async () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    await testConnection();
});

