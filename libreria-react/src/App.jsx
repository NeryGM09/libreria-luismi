import { useEffect, useState, useMemo, useCallback } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import Productos from './Productos';
import CarritoModal from './CarritoModal';
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * Componente principal de la aplicación Librería Luismy
 * Maneja el catálogo de productos, filtros, búsqueda y carrito
 */
function App() {
  // Estados
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // URL base de la API (funciona en desarrollo y producción)
  const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : '/api';

  // Efecto para cargar productos
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const response = await fetch(`${API_BASE}/productos`);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        // Filtrar solo productos con stock disponible
        const productosDisponibles = data.filter(producto => producto.stock > 0);
        setProductos(productosDisponibles);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos. Por favor, intente nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  // Extraer categorías únicas con useMemo para optimización
  const categorias = useMemo(() => {
    return [...new Set(productos.map(producto => producto.categoria))]
      .filter(categoria => categoria) // Remover categorías vacías/null
      .sort(); // Ordenar alfabéticamente
  }, [productos]);

  // Filtrar productos con useMemo para evitar cálculos innecesarios
  const productosFiltrados = useMemo(() => {
    return productos.filter(producto => {
      const coincideCategoria = categoriaSeleccionada 
        ? producto.categoria === categoriaSeleccionada 
        : true;
      
      const coincideBusqueda = busqueda 
        ? producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
        : true;
      
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoriaSeleccionada, busqueda]);

  // Handlers optimizados con useCallback
  const handleBusquedaChange = useCallback((event) => {
    setBusqueda(event.target.value);
  }, []);

  const handleCategoriaClick = useCallback((categoria) => {
    setCategoriaSeleccionada(prevCategoria => 
      prevCategoria === categoria ? null : categoria
    );
  }, []);

  const handleMostrarTodos = useCallback(() => {
    setCategoriaSeleccionada(null);
  }, []);

  // Funciones del carrito
  const agregarAlCarrito = useCallback((producto) => {
    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(item => item.id === producto.id);
      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  }, []);

  const actualizarCantidad = useCallback((productoId, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId);
    } else {
      setCarrito(prevCarrito =>
        prevCarrito.map(item =>
          item.id === productoId ? { ...item, cantidad } : item
        )
      );
    }
  }, []);

  const eliminarDelCarrito = useCallback((productoId) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== productoId));
  }, []);

  const limpiarCarrito = useCallback(() => {
    setCarrito([]);
  }, []);

  // Renderizado condicional para estados de carga y error
  if (cargando) {
    return (
      <div className="app-loading d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-vh-100 d-flex flex-column">
      <Navbar />
      
      <main className="flex-grow-1">
        <div className="container py-4 py-lg-5">
          {/* Encabezado Principal */}
          <header className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3" aria-label="Bienvenido a Librería Luismy">
              Bienvenido a <span className="text-primary">LIBRERÍA LUISMY</span>
            </h1>
            <p className="lead fs-4 text-muted max-w-800 mx-auto">
              Tu tienda de libros y artículos de papelería. Encuentra una amplia variedad de libros, revistas, cuadernos y más.
            </p>
            
            <div className="mt-4 pt-3 border-top">
              <h2 className="h5 mb-2">📍 Nuestra Ubicación</h2>
              <p className="mb-0 fs-5">
                Barrio Sunilapa, media cuadra al norte de Diálisis, Catacamas
              </p>
            </div>
          </header>

          {/* Búsqueda */}
          <section className="mb-5" aria-label="Buscar productos">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white border-primary">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="search"
                    className="form-control form-control-lg"
                    placeholder="Buscar productos por nombre..."
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    aria-label="Buscar productos por nombre"
                  />
                  {busqueda && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setBusqueda("")}
                      aria-label="Limpiar búsqueda"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
                <small className="text-muted d-block mt-2">
                  Escribe el nombre del producto que deseas encontrar
                </small>
              </div>
            </div>
          </section>

          {/* Filtros por Categoría */}
          {categorias.length > 0 && (
            <section className="mb-5" aria-label="Filtrar por categoría">
              <h3 className="h4 mb-3 text-center">Categorías</h3>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <button
                  className={`btn btn-lg ${categoriaSeleccionada === null ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={handleMostrarTodos}
                  aria-pressed={categoriaSeleccionada === null}
                >
                  <i className="bi bi-grid me-2"></i>
                  Todos
                </button>
                
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    className={`btn btn-lg ${categoriaSeleccionada === categoria ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleCategoriaClick(categoria)}
                    aria-pressed={categoriaSeleccionada === categoria}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Resultados */}
          <section aria-label="Productos disponibles">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0">
                {categoriaSeleccionada 
                  ? `Productos en "${categoriaSeleccionada}"` 
                  : 'Todos los Productos Disponibles'
                }
              </h2>
              <span className="badge bg-primary fs-6">
                {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            {productosFiltrados.length > 0 ? (
              <Productos 
                productos={productosFiltrados}
                carrito={carrito}
                onAgregarAlCarrito={agregarAlCarrito}
                onActualizarCantidad={actualizarCantidad}
                onEliminarDelCarrito={eliminarDelCarrito}
              />
            ) : (
              <div className="text-center py-5">
                <div className="display-1 text-muted mb-3">
                  <i className="bi bi-search"></i>
                </div>
                <h3 className="h4 mb-3">No se encontraron productos</h3>
                <p className="text-muted">
                  {busqueda 
                    ? `No hay productos que coincidan con "${busqueda}"`
                    : 'No hay productos disponibles en esta categoría'
                  }
                </p>
                {(busqueda || categoriaSeleccionada) && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setBusqueda("");
                      setCategoriaSeleccionada(null);
                    }}
                  >
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    Ver todos los productos
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-5 mt-auto">
        <div className="container">
          <div className="text-center">
            <p className="mb-3 fs-5">
              &copy; 2026 <strong>LIBRERÍA LUISMY</strong>. Todos los derechos reservados.
            </p>
            <div className="d-flex justify-content-center gap-4 mb-4">
              <a href="#" className="text-white text-decoration-none hover-primary" aria-label="Facebook">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="#" className="text-white text-decoration-none hover-primary" aria-label="Instagram">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="#" className="text-white text-decoration-none hover-primary" aria-label="WhatsApp">
                <i className="bi bi-whatsapp fs-4"></i>
              </a>
            </div>
            <small className="text-white-50 d-block">
              Catacamas, Olancho | Horario: Lunes a Viernes 8:00 AM - 6:00 PM
            </small>
          </div>
        </div>
      </footer>

      {/* Botón flotante del carrito */}
      {carrito.length > 0 && (
        <button
          className="btn btn-primary rounded-circle position-fixed"
          style={{
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          onClick={() => setMostrarCarrito(true)}
          title="Ver carrito"
        >
          <div className="position-relative">
            <i className="bi bi-bag fs-4"></i>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.7rem' }}
            >
              {carrito.reduce((total, item) => total + item.cantidad, 0)}
            </span>
          </div>
        </button>
      )}

      {/* Modal del carrito */}
      <CarritoModal
        mostrar={mostrarCarrito}
        onOcultar={() => setMostrarCarrito(false)}
        carrito={carrito}
        onActualizarCantidad={actualizarCantidad}
        onEliminarDelCarrito={eliminarDelCarrito}
        onLimpiarCarrito={limpiarCarrito}
      />
    </div>
  );
}

export default App;