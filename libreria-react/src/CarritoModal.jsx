import { useState, useMemo } from 'react';

const NUMERO_WHATSAPP = '+50433521667';

export default function CarritoModal({
  mostrar,
  onOcultar,
  carrito,
  onActualizarCantidad,
  onEliminarDelCarrito,
  onLimpiarCarrito
}) {
  const [nombreCliente, setNombreCliente] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Calcular total
  const total = useMemo(() => {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }, [carrito]);

  // Generar mensaje de WhatsApp
  const generarMensajeWhatsApp = () => {
    if (!nombreCliente.trim()) {
      alert('Por favor, ingresa tu nombre');
      return;
    }

    let mensaje = `Hola, me gustaría hacer un pedido a nombre de *${nombreCliente.trim()}*:\n\n`;
    mensaje += '📦 *Productos:*\n';

    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      mensaje += `${index + 1}. ${item.nombre}\n`;
      mensaje += `   • Cantidad: ${item.cantidad}\n`;
      mensaje += `   • Precio unitario: L. ${item.precio.toFixed(2)}\n`;
      mensaje += `   • Subtotal: L. ${subtotal.toFixed(2)}\n\n`;
    });

    mensaje += `💰 *Total: L. ${total.toFixed(2)}*\n\n`;
    mensaje += '¿Pueden confirmar disponibilidad y procesar mi pedido?';

    // Codificar el mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Crear enlace de WhatsApp
    const enlaceWhatsApp = `https://wa.me/${NUMERO_WHATSAPP.replace('+', '')}?text=${mensajeCodificado}`;

    // Abrir en nueva ventana
    window.open(enlaceWhatsApp, '_blank');

    // Limpiar carrito después de enviar
    setTimeout(() => {
      limpiarFormulario();
    }, 500);
  };

  const limpiarFormulario = () => {
    setNombreCliente('');
    onLimpiarCarrito();
    onOcultar();
  };

  if (!mostrar) return null;

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: mostrar ? 'block' : 'none'
      }}
      onClick={onOcultar}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-bag-check me-2"></i>
              Tu Carrito de Compras
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onOcultar}
            ></button>
          </div>

          <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {carrito.length === 0 ? (
              <div className="text-center py-5">
                <div className="display-1 text-muted mb-3">
                  <i className="bi bi-bag"></i>
                </div>
                <p className="text-muted fs-5">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                {/* Tabla de productos */}
                <div className="table-responsive mb-4">
                  <table className="table">
                    <thead>
                      <tr className="border-bottom">
                        <th>Producto</th>
                        <th className="text-center" style={{ width: '80px' }}>Cantidad</th>
                        <th className="text-end" style={{ width: '120px' }}>Subtotal</th>
                        <th style={{ width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrito.map((item) => (
                        <tr key={item.id} className="border-bottom">
                          <td>
                            <div className="d-flex gap-3">
                              <img
                                src={item.imagen || 'https://via.placeholder.com/50x50?text=Producto'}
                                alt={item.nombre}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                              <div>
                                <div className="fw-bold">{item.nombre}</div>
                                <small className="text-muted">L. {item.precio.toFixed(2)} c/u</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="d-flex align-items-center px-2 fw-bold">
                                {item.cantidad}
                              </span>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td className="text-end fw-bold">
                            L. {(item.precio * item.cantidad).toFixed(2)}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => onEliminarDelCarrito(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Resumen */}
                <div className="bg-light p-3 rounded mb-4 border-top">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>L. {total.toFixed(2)}</span>
                  </div>
                  <div className="border-top pt-2 d-flex justify-content-between fs-5 fw-bold">
                    <span>Total:</span>
                    <span className="text-primary">L. {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Formulario de cliente */}
                <div className="mb-4">
                  <label htmlFor="nombreCliente" className="form-label fw-bold">
                    <i className="bi bi-person me-2"></i>
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="nombreCliente"
                    placeholder="Ej: Juan Pérez"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generarMensajeWhatsApp()}
                  />
                  <small className="text-muted d-block mt-2">
                    Necesitamos tu nombre para procesar el pedido
                  </small>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer bg-light">
            {carrito.length > 0 && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-danger me-auto"
                  onClick={limpiarFormulario}
                >
                  <i className="bi bi-trash me-2"></i>
                  Limpiar carrito
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onOcultar}
                >
                  Continuar comprando
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={generarMensajeWhatsApp}
                  disabled={enviando || carrito.length === 0}
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  Enviar pedido por WhatsApp
                </button>
              </>
            )}
            {carrito.length === 0 && (
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={onOcultar}
              >
                Volver al catálogo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}