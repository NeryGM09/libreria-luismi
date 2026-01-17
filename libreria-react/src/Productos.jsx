export default function Productos({ 
  productos, 
  carrito = [],
  onAgregarAlCarrito,
  onActualizarCantidad,
  onEliminarDelCarrito
}) {
  // Función para obtener la cantidad de un producto en el carrito
  const getCantidadEnCarrito = (productoId) => {
    const item = carrito.find(item => item.id === productoId);
    return item ? item.cantidad : 0;
  };

  return (
    <div className="row">
      {productos.map(p => {
        const cantidadEnCarrito = getCantidadEnCarrito(p.id);
        
        return (
          <div key={p.id} className="col-md-4 mb-4">
            <div className="card h-100 d-flex flex-column">
              <img 
                src={p.imagen || "https://via.placeholder.com/300x200?text=Producto"} 
                className="card-img-top" 
                alt={p.nombre}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column flex-grow-1">
                <h5 className="card-title">{p.nombre}</h5>
                <p className="card-text small">
                  <strong>Categoría:</strong> {p.categoria}
                </p>
                <p className="card-text text-primary">
                  <strong>Precio: L. {p.precio.toFixed(2)}</strong>
                </p>
                <p className="card-text small text-muted mb-3">
                  Stock: {p.stock} disponibles
                </p>

                {/* Controles del carrito */}
                <div className="mt-auto">
                  {cantidadEnCarrito === 0 ? (
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => onAgregarAlCarrito(p)}
                    >
                      <i className="bi bi-bag-plus me-2"></i>
                      Agregar al carrito
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-danger flex-grow-1"
                        onClick={() => onActualizarCantidad(p.id, cantidadEnCarrito - 1)}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <button className="btn btn-sm btn-primary flex-grow-1" disabled>
                        {cantidadEnCarrito}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary flex-grow-1"
                        onClick={() => onActualizarCantidad(p.id, cantidadEnCarrito + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
