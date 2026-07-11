import { useState } from "react";
import { useNavigate } from "react-router";

import useAuth from "../hooks/useAuth.js";

function Header() {
  const navigate = useNavigate();

  const {
    usuario,
    cerrarSesion,
  } = useAuth();

  const [cerrando, setCerrando] = useState(false);

  const handleLogout = async () => {
    setCerrando(true);

    await cerrarSesion().catch(() => undefined);

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="app-header">
      <h1 className="app-header-title">
        Cooperativa Emprendicoop
      </h1>

      <div className="app-header-user">
        <span>
          {usuario?.nombre || "Usuario"}
        </span>

        <button
          type="button"
          className="btn-danger"
          onClick={handleLogout}
          disabled={cerrando}
        >
          {cerrando
            ? "Cerrando..."
            : "Cerrar sesión"}
        </button>
      </div>
    </header>
  );
}

export default Header;