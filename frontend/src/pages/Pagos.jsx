import { useEffect, useState } from "react";
import { apiRequest, formatMoney } from "../services/apiClient.js";

function Pagos() {
  const [prestamos, setPrestamos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [formulario, setFormulario] = useState({
    id_prestamo: "",
    monto: "",
    fecha: new Date().toISOString().slice(0, 10),
    metodo: "Efectivo",
    estado: "Completado",
  });
  const [error, setError] = useState("");

  async function cargarDatos() {
    const [prestamosData, pagosData] = await Promise.all([
      apiRequest("/prestamos.php"),
      apiRequest("/pagos.php"),
    ]);
    setPrestamos(prestamosData.prestamos || []);
    setPagos(pagosData.pagos || []);
  }

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const [prestamosData, pagosData] = await Promise.all([
          apiRequest("/prestamos.php"),
          apiRequest("/pagos.php"),
        ]);

        if (activo) {
          setPrestamos(prestamosData.prestamos || []);
          setPagos(pagosData.pagos || []);
        }
      } catch (err) {
        if (activo) {
          setError(err.message);
        }
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await apiRequest("/pagos.php", {
        method: "POST",
        body: JSON.stringify(formulario),
      });
      setFormulario({
        id_prestamo: "",
        monto: "",
        fecha: new Date().toISOString().slice(0, 10),
        metodo: "Efectivo",
        estado: "Completado",
      });
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="module-page">
      <header className="dashboard-welcome">
        <div>
          <h1>Gestión de pagos</h1>
          <p>Registro y consulta de pagos.</p>
        </div>
        <span className="dashboard-date">Pagos</span>
      </header>

      <section className="dashboard-stats module-stats">
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">PA</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Pagos registrados</p>
            <p className="stat-card-value">{pagos.length}</p>
            <span className="stat-card-detail">Movimientos guardados</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">CO</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Completados</p>
            <p className="stat-card-value">{pagos.filter((pago) => pago.estado === "Completado").length}</p>
            <span className="stat-card-detail">Pagos confirmados</span>
          </div>
        </article>
      </section>

      <div className="dashboard-grid module-grid">
        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Registrar pago</h2>
              <p>Selecciona el préstamo y registra el movimiento.</p>
            </div>
          </header>

          <form className="module-form-grid" onSubmit={handleSubmit}>
            <select className="form-input" name="id_prestamo" value={formulario.id_prestamo} onChange={handleChange} required>
              <option value="">Seleccionar préstamo</option>
              {prestamos.map((prestamo) => (
                <option key={prestamo.id_prestamo} value={prestamo.id_prestamo}>
                  #{prestamo.id_prestamo} - {prestamo.socio}
                </option>
              ))}
            </select>
            <input className="form-input" name="monto" type="number" min="0" step="0.01" value={formulario.monto} onChange={handleChange} placeholder="Monto" required />
            <input className="form-input" name="fecha" type="date" value={formulario.fecha} onChange={handleChange} required />
            <select className="form-input" name="metodo" value={formulario.metodo} onChange={handleChange}>
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta</option>
            </select>
            <select className="form-input" name="estado" value={formulario.estado} onChange={handleChange}>
              <option>Completado</option>
              <option>Pendiente</option>
            </select>
            <button className="btn-primary module-submit" type="submit">Registrar pago</button>
          </form>

          {error && <p className="login-server-error">{error}</p>}
        </section>

        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Listado de pagos</h2>
              <p>Historial de pagos registrados por préstamo.</p>
            </div>
          </header>

          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Socio</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Método</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pagos.length === 0 ? (
                  <tr>
                    <td className="empty-state" colSpan="6">No hay pagos registrados.</td>
                  </tr>
                ) : (
                  pagos.map((pago) => (
                    <tr key={pago.id_pago}>
                      <td>{pago.id_pago}</td>
                      <td>{pago.socio}</td>
                      <td className="movement-amount">{formatMoney(pago.monto)}</td>
                      <td>{pago.fecha}</td>
                      <td>{pago.metodo}</td>
                      <td>
                        <span className={`status-badge ${pago.estado === "Completado" ? "status-completed" : "status-pending"}`}>
                          {pago.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Pagos;
