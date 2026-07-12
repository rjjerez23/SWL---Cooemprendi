import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { apiRequest, formatMoney } from "../services/apiClient.js";
import "../styles/dashboard.css";

const accionesRapidas = [
  { id: "nuevo-socio", titulo: "Gestionar socios", descripcion: "Registrar o consultar socios", ruta: "/socios" },
  { id: "nuevo-ahorro", titulo: "Registrar ahorro", descripcion: "Consultar el módulo de ahorros", ruta: "/ahorros" },
  { id: "nuevo-prestamo", titulo: "Gestionar préstamos", descripcion: "Registrar o consultar préstamos", ruta: "/prestamos" },
  { id: "nuevo-pago", titulo: "Registrar pago", descripcion: "Acceder al módulo de pagos", ruta: "/pagos" },
  { id: "ver-reportes", titulo: "Consultar reportes", descripcion: "Visualizar reportes administrativos", ruta: "/reportes" },
  { id: "usuarios", titulo: "Gestionar usuarios", descripcion: "Administrar cuentas y accesos", ruta: "/usuarios" },
];

function obtenerFechaActual() {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "long",
  }).format(new Date());
}

function Dashboard() {
  const [datos, setDatos] = useState({
    resumen: { socios: 0, ahorros: 0, prestamos: 0, pagos: 0 },
    movimientos: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/dashboard.php")
      .then((data) => setDatos(data))
      .catch((err) => setError(err.message));
  }, []);

  const resumen = useMemo(
    () => [
      { id: "socios", simbolo: "SO", titulo: "Socios registrados", valor: datos.resumen?.socios || 0, detalle: "Socios activos" },
      { id: "ahorros", simbolo: "AH", titulo: "Total en ahorros", valor: formatMoney(datos.resumen?.ahorros), detalle: "Monto acumulado" },
      { id: "prestamos", simbolo: "PR", titulo: "Préstamos activos", valor: datos.resumen?.prestamos || 0, detalle: "Préstamos vigentes" },
      { id: "pagos", simbolo: "PA", titulo: "Pagos registrados", valor: datos.resumen?.pagos || 0, detalle: "Pagos del período" },
    ],
    [datos.resumen],
  );

  return (
    <section className="dashboard-page">
      <header className="dashboard-welcome">
        <div>
          <h1>Dashboard</h1>
          <p>Bienvenido al panel de administración de la Cooperativa Emprendicoop.</p>
        </div>
        <span className="dashboard-date">{obtenerFechaActual()}</span>
      </header>

      {error && <p className="login-server-error">{error}</p>}

      <section className="dashboard-stats" aria-label="Resumen general del sistema">
        {resumen.map((elemento) => (
          <article className="stat-card" key={elemento.id}>
            <div className="stat-card-symbol" aria-hidden="true">{elemento.simbolo}</div>
            <div className="stat-card-content">
              <p className="stat-card-title">{elemento.titulo}</p>
              <p className="stat-card-value">{elemento.valor}</p>
              <span className="stat-card-detail">{elemento.detalle}</span>
            </div>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Movimientos recientes</h2>
              <p>Últimas operaciones registradas en el sistema.</p>
            </div>
          </header>

          {datos.movimientos?.length > 0 ? (
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Socio</th>
                    <th>Movimiento</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.movimientos.map((movimiento, index) => (
                    <tr key={`${movimiento.tipo}-${movimiento.fecha}-${index}`}>
                      <td>{movimiento.socio}</td>
                      <td className="movement-type">{movimiento.tipo}</td>
                      <td className="movement-amount">{formatMoney(movimiento.monto)}</td>
                      <td>{movimiento.fecha}</td>
                      <td>
                        <span className={`status-badge ${movimiento.estado === "Completado" ? "status-completed" : "status-pending"}`}>
                          {movimiento.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No existen movimientos recientes.</p>
          )}
        </section>

        <aside className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Acciones rápidas</h2>
              <p>Accesos directos a los módulos principales.</p>
            </div>
          </header>
          <nav className="quick-actions" aria-label="Acciones rápidas">
            {accionesRapidas.map((accion) => (
              <Link key={accion.id} to={accion.ruta} className="quick-action-link">
                <span>
                  <span className="quick-action-title">{accion.titulo}</span>
                  <span className="quick-action-description">{accion.descripcion}</span>
                </span>
                <span className="quick-action-arrow" aria-hidden="true">›</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}

export default Dashboard;
