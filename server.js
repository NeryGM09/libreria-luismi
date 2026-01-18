const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, 'libreria-react/dist')));

// API routes
app.use('/api/productos', require('./api/productos'));
app.use('/api/pedidos', require('./api/pedidos'));

// Manejo de rutas de React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'libreria-react/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
