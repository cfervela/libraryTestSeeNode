require('dotenv').config();
const express = require('express');
const cors = require('cors');
const booksRoutes = require('./routes/booksRoutes');
const pool = require('./db/conexion');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - CORREGIDO
const corsOptions = {
    origin: [
        'https://cfervela.github.io',              // ✅ Sin ruta ni barra final
        'http://localhost:5500',                    // Para desarrollo local
        'http://127.0.0.1:5500',
        'http://localhost:5501',                    // Por si cambias puerto
        'http://127.0.0.1:5501'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Agregar headers manualmente como backup
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (corsOptions.origin.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
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

