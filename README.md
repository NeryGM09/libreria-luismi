# 📚 Librería Luismi - Catálogo de Productos

Aplicación web para gestionar y mostrar el catálogo de productos de Librería Luismi en Catacamas, Olancho.

## 🚀 Características

- ✅ Catálogo de productos con búsqueda y filtros por categoría
- ✅ Carrito de compras con actualización de cantidades
- ✅ Envío de pedidos directamente a WhatsApp
- ✅ Interfaz responsiva con Bootstrap 5
- ✅ Imagen de productos con placeholders

## 📋 Requisitos

- Node.js v18+
- Git
- Cuenta en GitHub
- Cuenta en Vercel (gratis)

## 🛠️ Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/libreria-luismi.git
cd libreria-luismi
```

### 2. Instalar dependencias del frontend
```bash
cd libreria-react
npm install
cd ..
```

### 3. Instalar dependencias del backend (si corres localmente)
```bash
cd backend
npm install
cd ..
```

### 4. Correr en desarrollo

**Terminal 1 - Frontend (React + Vite)**
```bash
cd libreria-react
npm run dev
```
Accede a: http://localhost:5173

**Terminal 2 - Backend (Express)**
```bash
cd backend
npm start
```
Backend en: http://localhost:3000

## 🌐 Despliegue en Vercel

### Paso 1: Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Haz clic en "Sign Up"
3. Conecta tu cuenta de GitHub
4. Autoriza Vercel para acceder a tus repositorios

### Paso 2: Subir código a GitHub
1. Abre Terminal/PowerShell en la carpeta del proyecto
2. Ejecuta:
```bash
git init
git add .
git commit -m "Initial commit: Librería Luismi"
git branch -M main
git remote add origin https://github.com/tu-usuario/libreria-luismi.git
git push -u origin main
```

### Paso 3: Desplegar en Vercel
1. Ve a https://vercel.com/dashboard
2. Haz clic en "Add New..." → "Project"
3. Selecciona tu repositorio "libreria-luismi"
4. Vercel detectará automáticamente la configuración
5. Haz clic en "Deploy"
6. ¡Listo! Tu sitio estará disponible en: `https://libreria-luismi.vercel.app`

## 📱 Cómo usar

### En la tienda:
1. **Buscar**: Usa el campo de búsqueda para encontrar productos
2. **Filtrar**: Selecciona una categoría con los botones
3. **Agregar al carrito**: Haz clic en "Agregar al carrito"
4. **Ajustar cantidad**: Usa + y - para cambiar cantidades
5. **Enviar pedido**: 
   - Abre el carrito (botón flotante ⊕)
   - Ingresa tu nombre
   - Haz clic en "Enviar pedido por WhatsApp"
   - Se abrirá WhatsApp con el pedido formateado

## 📍 Ubicación de la tienda
**Barrio Sunilapa, Catacamas, Olancho**
- WhatsApp: +504 33521667
- Horario: Lunes a Sábado 8:00 AM - 6:00 PM

## 🔧 Estructura del proyecto

```
libreria-luismi/
├── api/                      # Vercel Functions (backend)
│   ├── productos.js         # Endpoints de productos
│   └── pedidos.js           # Endpoints de pedidos
├── libreria-react/          # Frontend React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Navbar.jsx
│   │   ├── Productos.jsx
│   │   ├── CarritoModal.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/                 # Express (para desarrollo local)
│   ├── server.js
│   └── package.json
├── vercel.json             # Configuración de Vercel
├── .gitignore
├── package.json
└── README.md
```

## 🗄️ Base de datos

SQLite (`libreria.db`) con tablas:
- **productos**: id, nombre, categoria, precio, stock, imagen
- **pedidos**: id, cliente, productos, total, fecha, estado

## 💡 Variables de entorno

No se requieren variables de entorno especiales. El número de WhatsApp está hardcodeado en `CarritoModal.jsx`.

Para cambiar el número:
1. Abre `libreria-react/src/CarritoModal.jsx`
2. Cambia: `const NUMERO_WHATSAPP = '+50433521667';`
3. Guarda y redeploy

## 🐛 Troubleshooting

**Error: "No se pudieron cargar los productos"**
- En desarrollo: Asegúrate que el backend esté corriendo en puerto 3000
- En producción: Verifica que `vercel.json` esté configurado correctamente

**WhatsApp no abre**
- Verifica que el número esté en formato correcto: `+[país][número]`
- El formato debe ser: `+50433521667` (sin espacios)

**Base de datos vacía**
- En Vercel, la base de datos se crea automáticamente con datos iniciales
- Los datos se pierden si redeploys (Vercel no persiste archivos)
- Para persistencia, considera usar una BD externa (MongoDB, PostgreSQL)

## 📞 Soporte

Para cambios o actualizaciones, contacta al equipo de desarrollo.

---

**Hecho con ❤️ para Librería Luismi**
