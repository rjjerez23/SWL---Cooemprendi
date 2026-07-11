import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";

import useAuth from "../hooks/useAuth.js";

function ProtectedRoute() {
  const {
    autenticado,
    cargandoSesion,
  } = useAuth();

  const ubicacionActual = useLocation();

  if (cargandoSesion) {
    return (
      <main className="auth-loading">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: ubicacionActual }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;