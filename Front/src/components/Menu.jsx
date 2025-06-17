import { useAuth } from '../context/AuthContext';

export default function Menu() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary px-3">
      <div className="container-fluid">
        {/* Logo y enlace al inicio */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img
            src="/img/logo.png"
            alt="Logo"
            width="40"
            height="40"
            className="d-inline-block align-text-top rounded-circle me-2"
          />
          House Hunter
        </a>

        {/* Botón colapsable para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
          {/* Menú izquierdo */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/sobrenosotros">Sobre Nosotros</a>
            </li>
          </ul>

          {/* Menú derecho */}
          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <li className="nav-item">
                <a className="nav-link" href="/login">Login</a>
              </li>
            ) : (
              <li className="nav-item">
                <a className="nav-link d-flex align-items-center" href="/usuario">Usuario</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
