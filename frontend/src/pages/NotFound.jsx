import { Link } from "react-router";

function NotFound() {
  return (
    <main>
      <h1>Página no encontrada</h1>
      <p>La dirección solicitada no existe.</p>
      <Link to="/login">Volver al inicio de sesión</Link>
    </main>
  );
}

export default NotFound;