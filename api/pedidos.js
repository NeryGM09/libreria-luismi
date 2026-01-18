const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../libreria.db');

// Promisify database operations
const getDb = () => {
  return new Promise((resolve) => {
    const db = new sqlite3.Database(dbPath);
    
    db.serialize(() => {
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
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await getDb();

    if (req.method === 'GET') {
      const pedidos = await dbAll(db, 'SELECT * FROM pedidos ORDER BY fecha DESC');
      
      // Parsear JSON
      const pedidosParseados = pedidos.map(p => ({
        ...p,
        cliente: typeof p.cliente === 'string' ? JSON.parse(p.cliente) : p.cliente,
        productos: typeof p.productos === 'string' ? JSON.parse(p.productos) : p.productos
      }));
      
      db.close();
      return res.status(200).json(pedidosParseados);
    }

    if (req.method === 'POST') {
      const { cliente, productos, total } = req.body;
      
      if (!cliente || !productos || !total) {
        db.close();
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const fecha = new Date().toISOString();
      const estado = 'Pendiente';

      const result = await dbRun(
        db,
        'INSERT INTO pedidos (cliente, productos, total, fecha, estado) VALUES (?, ?, ?, ?, ?)',
        [JSON.stringify(cliente), JSON.stringify(productos), total, fecha, estado]
      );
      
      db.close();
      return res.status(201).json({ 
        mensaje: 'Pedido creado', 
        id: result.lastID 
      });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { estado } = req.body;

      if (!estado) {
        db.close();
        return res.status(400).json({ error: 'El estado es requerido' });
      }

      await dbRun(
        db,
        'UPDATE pedidos SET estado = ? WHERE id = ?',
        [estado, id]
      );
      
      db.close();
      return res.status(200).json({ mensaje: 'Estado actualizado' });
    }

    db.close();
    res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
