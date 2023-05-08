const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Configuración de la carpeta public para archivos estáticos.
app.use(express.static('public'));

// Procesamiento de datos enviados desde forms.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Trabajo con las cookies.
app.use(cookieParser());

// Llamada al router.
app.use('/', require('./routes/router'));

// Middleware para eliminar la caché.
app.use((req, res, next) => {
    if (!req.user) { res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); }
    next();
});

// Manejo de errores.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Inicialización del servidor.
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
