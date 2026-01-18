const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de React
const distPath = path.join(__dirname, 'libreria-react/dist');
app.use(express.static(distPath));

// API Routes - Importar directamente las funciones
const productosHandler = require('./api/productos');
const pedidosHandler = require('./api/pedidos');

// Rutas de API
app.get('/api/productos', (req, res) => productosHandler(req, res));
app.post('/api/productos', (req, res) => productosHandler(req, res));
app.put('/api/productos', (req, res) => productosHandler(req, res));
app.delete('/api/productos', (req, res) => productosHandler(req, res));
app.options('/api/productos', (req, res) => productosHandler(req, res));

app.get('/api/pedidos', (req, res) => pedidosHandler(req, res));
app.post('/api/pedidos', (req, res) => pedidosHandler(req, res));
app.put('/api/pedidos', (req, res) => pedidosHandler(req, res));
app.options('/api/pedidos', (req, res) => pedidosHandler(req, res));

// Catch-all para React SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

module.exports = app;
