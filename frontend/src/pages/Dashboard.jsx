import { Link } from "react-router";
import "../styles/dashboard.css";

const resumen = [
  {
    id: "socios",
    simbolo: "SO",
    titulo: "Socios registrados",
    valor: "33",
    detalle: "Socios activos",
  },
  {
    id: "ahorros",
    simbolo: "AH",
    titulo: "Total en ahorros",
    valor: "RD$ 245,500",
    detalle: "Monto acumulado",
  },
  {
    id: "prestamos",
    simbolo: "PR",
    titulo: "Préstamos activos",
    valor: "12",
    detalle: "Préstamos vigentes",
  },
  {
    id: "pagos",
    simbolo: "PA",
    titulo: "Pagos registrados",
    valor: "28",
    detalle: "Pagos del período",
  },
];

const movimientosRecientes = [
  {
    id: 1,
    socio: "María Rodríguez",
    tipo: "Pago de préstamo",
    monto: "RD$ 5,000",
    fecha: "11/07/2026",
    estado: "Completado",
  },
  {
    id: 2,
    socio: "José Martínez",
    tipo: "Depósito de ahorro",
    monto: "RD$ 3,500",
    fecha: "10/07/2026",
    estado: "Completado",
  },
  {
    id: 3,
    socio: "Ana Castillo",
    tipo: "Solicitud de préstamo",
    monto: "RD$ 25,000",
    fecha: "10/07/2026",
    estado: "Pendiente",
  },
  {
    id: 4,
    socio: "Carlos Pérez",
    tipo: "Pago de préstamo",
    monto: "RD$ 4,200",
    fecha: "09/07/2026",
    estado: "Completado",
  },
];

const accionesRapidas = [
  {
    id: "nuevo-socio",
    titulo: "Gestionar socios",
    descripcion: "Registrar o consultar socios",
    ruta: "/socios",
  },
  {
    id: "nuevo-ahorro",
    titulo: "Registrar ahorro",
    descripcion: "Consultar el módulo de ahorros",
    ruta: "/ahorros",
  },
  {
    id: "nuevo-prestamo",
    titulo: "Gestionar préstamos",
    descripcion: "Registrar o consultar préstamos",
    ruta: "/prestamos",
  },
  {
    id: "nuevo-pago",
    titulo: "Registrar pago",
    descripcion: "Acceder al módulo de pagos",
    ruta: "/pagos",
  },
  {
    id: "ver-reportes",
    titulo: "Consultar reportes",
    descripcion: "Visualizar reportes administrativos",
    ruta: "/reportes",
  },
];

function obtenerFechaActual() {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "long",
  }).format(new Date());
}

function Dashboard() {
  return (
    <section className="dashboard-page">
      <header className="dashboard-welcome">
        <div>
          <h1>Dashboard</h1>
          <p>
            Bienvenido al panel de administración de la Cooperativa
            Emprendicoop.
          </p>
        </div>

        <span className="dashboard-date">{obtenerFechaActual()}</span>
      </header>

      <section
        className="dashboard-stats"
        aria-label="Resumen general del sistema"
      >
        {resumen.map((elemento) => (
          <article className="stat-card" key={elemento.id}>
            <div className="stat-card-symbol" aria-hidden="true">
              {elemento.simbolo}
            </div>

            <div className="stat-card-content">
              <p className="stat-card-title">{elemento.titulo}</p>
              <p className="stat-card-value">{elemento.valor}</p>
              <span className="stat-card-detail">
                {elemento.detalle}
              </span>
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

          {movimientosRecientes.length > 0 ? (
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
                  {movimientosRecientes.map((movimiento) => (
                    <tr key={movimiento.id}>
                      <td>{movimiento.socio}</td>

                      <td className="movement-type">
                        {movimiento.tipo}
                      </td>

                      <td className="movement-amount">
                        {movimiento.monto}
                      </td>

                      <td>{movimiento.fecha}</td>

                      <td>
                        <span
                          className={`status-badge ${
                            movimiento.estado === "Completado"
                              ? "status-completed"
                              : "status-pending"
                          }`}
                        >
                          {movimiento.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">
              No existen movimientos recientes.
            </p>
          )}
        </section>

        <aside className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Acciones rápidas</h2>
              <p>Accesos directos a los módulos principales.</p>
            </div>
          </header>

          <nav
            className="quick-actions"
            aria-label="Acciones rápidas"
          >
            {accionesRapidas.map((accion) => (
              <Link
                key={accion.id}
                to={accion.ruta}
                className="quick-action-link"
              >
                <span>
                  <span className="quick-action-title">
                    {accion.titulo}
                  </span>

                  <span className="quick-action-description">
                    {accion.descripcion}
                  </span>
                </span>

                <span
                  className="quick-action-arrow"
                  aria-hidden="true"
                >
                  ›
                </span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}

export default Dashboard;