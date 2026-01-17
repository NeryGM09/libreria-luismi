export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg sticky-top shadow">
      <div className="container">
        <span className="navbar-brand fs-4 fw-bold">Librería Luismy</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-light small">📍 Barrio Sunilapa, Catacamas</span>
          <span className="text-light small">📞 Lunes a Sábado</span>
        </div>
      </div>
    </nav>
  );
}
