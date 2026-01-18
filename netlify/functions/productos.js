const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/libreria.db' : path.join(__dirname, '../libreria.db');

const getDb = () => {
  return new Promise((resolve) => {
    const db = new sqlite3.Database(dbPath);
    
    db.serialize(() => {
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
    });

    resolve(db);
  });
};

const dbAll = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const dbRun = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await getDb();

    if (req.method === 'GET') {
      const productos = await dbAll(db, 'SELECT * FROM productos');
      db.close();
      return res.status(200).json(productos);
    }

    if (req.method === 'POST') {
      const { nombre, categoria, precio, stock, imagen } = req.body;
      
      if (!nombre || !categoria || !precio || stock === undefined) {
        db.close();
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const result = await dbRun(
        db,
        'INSERT INTO productos (nombre, categoria, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)',
        [nombre, categoria, precio, stock, imagen || null]
      );
      
      db.close();
      return res.status(201).json({ mensaje: 'Producto agregado', id: result.lastID });
    }

    if (req.method === 'PUT') {
      const id = req.query.id || req.body.id;
      const { nombre, categoria, precio, stock, imagen } = req.body;

      await dbRun(
        db,
        'UPDATE productos SET nombre=?, categoria=?, precio=?, stock=?, imagen=? WHERE id=?',
        [nombre, categoria, precio, stock, imagen, id]
      );
      
      db.close();
      return res.status(200).json({ mensaje: 'Producto actualizado' });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body.id;
      await dbRun(db, 'DELETE FROM productos WHERE id = ?', [id]);
      db.close();
      return res.status(200).json({ mensaje: 'Producto eliminado' });
    }

    db.close();
    res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
