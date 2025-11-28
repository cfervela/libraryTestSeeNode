require('dotenv').config();
const express = require('express');
const cors = require('cors');
const booksRoutes = require('./routes/booksRoutes');
const pool = require('./db/conexion');
const app = express();
const PORT = process.env.PORT || 3000;

// Opción 2: CORS específico pero correcto
const allowedOrigins = [
    'https://cfervela.github.io',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como Postman, curl, apps móviles)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ Origen bloqueado por CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
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

