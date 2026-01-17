const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./libreria.db");

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    autor TEXT,
    precio REAL
  )
  `);

  db.run(`
  INSERT OR IGNORE INTO libros (titulo, autor, precio)
  VALUES
  ('El Principito', 'Antoine de Saint-Exupéry', 250),
  ('Cien años de soledad', 'Gabriel García Márquez', 300),
  ('Don Quijote', 'Miguel de Cervantes', 280)
  `);

  // Tabla productos
  db.run(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    categoria TEXT,
    precio REAL,
    stock INTEGER,
    imagen TEXT
  )
  `);

  // Agregar columna imagen si no existe (para migración)
  db.run(`ALTER TABLE productos ADD COLUMN imagen TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding column:', err);
    }
  });

  // Datos iniciales
  db.run(`
  INSERT OR IGNORE INTO productos (nombre, categoria, precio, stock, imagen) VALUES
  ('El Principito', 'Libros', 250, 10, 'https://via.placeholder.com/300x400?text=El+Principito'),
  ('Cien años de soledad', 'Libros', 300, 8, 'https://via.placeholder.com/300x400?text=Cien+Años+de+Soledad'),
  ('Don Quijote', 'Libros', 280, 5, 'https://via.placeholder.com/300x400?text=Don+Quijote'),
  ('Pluma azul', 'Plumas', 50, 20, 'https://via.placeholder.com/300x200?text=Pluma+Azul'),
  ('Pluma negra', 'Plumas', 50, 15, 'https://via.placeholder.com/300x200?text=Pluma+Negra'),
  ('Cuaderno universitario', 'Papeles', 120, 25, 'https://via.placeholder.com/300x200?text=Cuaderno+Universitario'),
  ('Papel bond', 'Papeles', 80, 30, 'https://via.placeholder.com/300x200?text=Papel+Bond'),
  ('Bloc de notas', 'Papeles', 60, 40, 'https://via.placeholder.com/300x200?text=Bloc+de+Notas'),
  ('Mochila escolar', 'Mochilas', 850, 5, 'https://via.placeholder.com/300x300?text=Mochila+Escolar'),
  ('Mochila ejecutiva', 'Mochilas', 1200, 3, 'https://via.placeholder.com/300x300?text=Mochila+Ejecutiva')
  `);

  // Tabla pedidos
  db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT,
    productos TEXT,
    total REAL,
    fecha TEXT,
    estado TEXT
  )
  `);
});

app.get("/libros", (req, res) => {
  db.all("SELECT * FROM libros", (err, rows) => {
    res.json(rows);
  });
});

app.get("/productos", (req, res) => {
  db.all("SELECT * FROM productos", (err, rows) => {
    res.json(rows);
  });
});

app.post("/productos", (req, res) => {
  const { nombre, categoria, precio, stock, imagen } = req.body;
  db.run(
    "INSERT INTO productos (nombre, categoria, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)",
    [nombre, categoria, precio, stock, imagen]
  );
  res.json({ mensaje: "Producto agregado" });
});

app.delete("/productos/:id", (req, res) => {
  db.run("DELETE FROM productos WHERE id = ?", req.params.id);
  res.json({ mensaje: "Producto eliminado" });
});

app.post("/pedidos", (req, res) => {
  const { cliente, productos, total } = req.body;
  const fecha = new Date().toISOString();
  const estado = "Pendiente";
  db.run(
    "INSERT INTO pedidos (cliente, productos, total, fecha, estado) VALUES (?, ?, ?, ?, ?)",
    [JSON.stringify(cliente), JSON.stringify(productos), total, fecha, estado],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ mensaje: "Pedido creado", id: this.lastID });
      }
    }
  );
});

app.get("/pedidos", (req, res) => {
  db.all("SELECT * FROM pedidos ORDER BY fecha DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      rows.forEach(row => {
        row.cliente = JSON.parse(row.cliente);
        row.productos = JSON.parse(row.productos);
      });
      res.json(rows);
    }
  });
});

app.put("/pedidos/:id", (req, res) => {
  const { estado } = req.body;
  db.run(
    "UPDATE pedidos SET estado = ? WHERE id = ?",
    [estado, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ mensaje: "Estado actualizado" });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("API corriendo en http://localhost:3000");
});
