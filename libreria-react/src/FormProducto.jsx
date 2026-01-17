import { useState } from "react";

export default function FormProducto({ cargar }) {
  const [producto, setProducto] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: ""
  });

  const enviar = async e => {
    e.preventDefault();
    await fetch("http://localhost:3000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    });
    cargar();
  };

  return (
    <form onSubmit={enviar} className="mb-4">
      <input className="form-control mb-2" placeholder="Nombre"
        onChange={e => setProducto({ ...producto, nombre: e.target.value })} />
      <input className="form-control mb-2" placeholder="Categoría"
        onChange={e => setProducto({ ...producto, categoria: e.target.value })} />
      <input className="form-control mb-2" placeholder="Precio"
        onChange={e => setProducto({ ...producto, precio: e.target.value })} />
      <input className="form-control mb-2" placeholder="Stock"
        onChange={e => setProducto({ ...producto, stock: e.target.value })} />
      <button className="btn btn-primary">Agregar</button>
    </form>
  );
}
