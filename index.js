const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, 'libreria-react/dist')));

// API Routes - handlers
const productosHandler = require('./api/productos');
const pedidosHandler = require('./api/pedidos');

// Rutas de API
app.get('/api/productos', (req, res) => productosHandler(req, res));
app.post('/api/productos', (req, res) => productosHandler(req, res));
app.put('/api/productos/:id', (req, res) => productosHandler(req, res));
app.delete('/api/productos/:id', (req, res) => productosHandler(req, res));
app.options('/api/productos', (req, res) => productosHandler(req, res));

app.get('/api/pedidos', (req, res) => pedidosHandler(req, res));
app.post('/api/pedidos', (req, res) => pedidosHandler(req, res));
app.put('/api/pedidos/:id', (req, res) => pedidosHandler(req, res));
app.options('/api/pedidos', (req, res) => pedidosHandler(req, res));

// SPA fallback - debe ir al final
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'libreria-react/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
