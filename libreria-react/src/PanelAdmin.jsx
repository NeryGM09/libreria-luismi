import { useEffect, useState } from 'react';

export default function PanelAdmin({ mostrar, setMostrar }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {
    if (mostrar) {
      cargarPedidos();
    }
  }, [mostrar]);

  const cargarPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pedidos');
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (response.ok) {
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const pedidosFiltrados = filtroEstado === 'Todos' ? pedidos : pedidos.filter(p => p.estado === filtroEstado);

  if (!mostrar) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Panel de Administración - Pedidos</h5>
            <button type="button" className="btn-close" onClick={() => setMostrar(false)}></button>
          </div>
          <div className="modal-body">
            {cargando ? (
              <div className="text-center">
                <div className="spinner-border"></div>
                <p>Cargando pedidos...</p>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <label className="form-label">Filtrar por Estado:</label>
                  <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                    <option>Todos</option>
                    <option>Pendiente</option>
                    <option>Confirmado</option>
                    <option>Enviado</option>
                    <option>Entregado</option>
                    <option>Cancelado</option>
                  </select>
                </div>

                {pedidosFiltrados.length === 0 ? (
                  <p className="text-center">No hay pedidos con ese estado.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Email</th>
                          <th>Total</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidosFiltrados.map(pedido => (
                          <tr key={pedido.id}>
                            <td>{pedido.id}</td>
                            <td>{pedido.cliente.nombre}</td>
                            <td>{pedido.cliente.email}</td>
                            <td>L. {pedido.total.toFixed(2)}</td>
                            <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge bg-${pedido.estado === 'Pendiente' ? 'warning' : pedido.estado === 'Confirmado' ? 'info' : pedido.estado === 'Enviado' ? 'primary' : pedido.estado === 'Entregado' ? 'success' : 'danger'}`}>
                                {pedido.estado}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <button className="btn btn-outline-info" onClick={() => cambiarEstado(pedido.id, 'Confirmado')}>Confirmar</button>
                                <button className="btn btn-outline-primary" onClick={() => cambiarEstado(pedido.id, 'Enviado')}>Enviar</button>
                                <button className="btn btn-outline-success" onClick={() => cambiarEstado(pedido.id, 'Entregado')}>Entregar</button>
                                <button className="btn btn-outline-danger" onClick={() => cambiarEstado(pedido.id, 'Cancelado')}>Cancelar</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Detalles de pedidos */}
                <h6 className="mt-4">Detalles de Pedidos</h6>
                {pedidosFiltrados.map(pedido => (
                  <div key={pedido.id} className="card mb-3">
                    <div className="card-header">
                      <strong>Pedido #{pedido.id}</strong> - {pedido.cliente.nombre} ({pedido.cliente.email})
                    </div>
                    <div className="card-body">
                      <p><strong>Dirección:</strong> {pedido.cliente.direccion}</p>
                      <p><strong>Teléfono:</strong> {pedido.cliente.telefono || 'No proporcionado'}</p>
                      <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
                      <h6>Productos:</h6>
                      <ul>
                        {pedido.productos.map(p => (
                          <li key={p.id}>{p.nombre} x{p.cantidad} - L. {(p.precio * p.cantidad).toFixed(2)}</li>
                        ))}
                      </ul>
                      <h6>Total: L. {pedido.total.toFixed(2)}</h6>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setMostrar(false)}>Cerrar</button>
            <button type="button" className="btn btn-primary" onClick={cargarPedidos}>Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
