function Header() {
  return (
    <header className="app-header">
      <h1 className="app-header-title">Cooperativa Emprendicoop</h1>

      <div className="app-header-user">
        <span>Administrador</span>
        <button type="button" className="btn-danger">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;