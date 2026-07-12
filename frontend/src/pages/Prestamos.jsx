import { useEffect, useState } from "react";
import { apiRequest, formatMoney } from "../services/apiClient.js";

function Prestamos() {
  const [socios, setSocios] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [formulario, setFormulario] = useState({
    id_socio: "",
    monto: "",
    interes: "",
    cuotas: "",
    fecha: new Date().toISOString().slice(0, 10),
    estado: "Pendiente",
  });
  const [error, setError] = useState("");

  async function cargarDatos() {
    const [sociosData, prestamosData] = await Promise.all([
      apiRequest("/socios.php"),
      apiRequest("/prestamos.php"),
    ]);
    setSocios(sociosData.socios || []);
    setPrestamos(prestamosData.prestamos || []);
  }

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const [sociosData, prestamosData] = await Promise.all([
          apiRequest("/socios.php"),
          apiRequest("/prestamos.php"),
        ]);

        if (activo) {
          setSocios(sociosData.socios || []);
          setPrestamos(prestamosData.prestamos || []);
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
      await apiRequest("/prestamos.php", {
        method: "POST",
        body: JSON.stringify(formulario),
      });
      setFormulario({
        id_socio: "",
        monto: "",
        interes: "",
        cuotas: "",
        fecha: new Date().toISOString().slice(0, 10),
        estado: "Pendiente",
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
          <h1>Gestión de préstamos</h1>
          <p>Registro y seguimiento de préstamos.</p>
        </div>
        <span className="dashboard-date">Préstamos</span>
      </header>

      <section className="dashboard-stats module-stats">
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">PR</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Préstamos registrados</p>
            <p className="stat-card-value">{prestamos.length}</p>
            <span className="stat-card-detail">Solicitudes guardadas</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">PE</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Pendientes</p>
            <p className="stat-card-value">{prestamos.filter((prestamo) => prestamo.estado === "Pendiente").length}</p>
            <span className="stat-card-detail">Por revisar</span>
          </div>
        </article>
      </section>

      <div className="dashboard-grid module-grid">
        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Registrar préstamo</h2>
              <p>Define socio, monto, interés, cuotas y estado.</p>
            </div>
          </header>

          <form className="module-form-grid" onSubmit={handleSubmit}>
            <select className="form-input" name="id_socio" value={formulario.id_socio} onChange={handleChange} required>
              <option value="">Seleccionar socio</option>
              {socios.map((socio) => (
                <option key={socio.id_socio} value={socio.id_socio}>
                  {socio.nombre}
                </option>
              ))}
            </select>
            <input className="form-input" name="monto" type="number" min="0" step="0.01" value={formulario.monto} onChange={handleChange} placeholder="Monto" required />
            <input className="form-input" name="interes" type="number" min="0" step="0.01" value={formulario.interes} onChange={handleChange} placeholder="Interés %" required />
            <input className="form-input" name="cuotas" type="number" min="1" value={formulario.cuotas} onChange={handleChange} placeholder="Cuotas" required />
            <input className="form-input" name="fecha" type="date" value={formulario.fecha} onChange={handleChange} required />
            <select className="form-input" name="estado" value={formulario.estado} onChange={handleChange}>
              <option>Pendiente</option>
              <option>Aprobado</option>
              <option>Rechazado</option>
              <option>Pagado</option>
            </select>
            <button className="btn-primary module-submit" type="submit">Registrar préstamo</button>
          </form>

          {error && <p className="login-server-error">{error}</p>}
        </section>

        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Listado de préstamos</h2>
              <p>Estado general de las solicitudes registradas.</p>
            </div>
          </header>

          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Socio</th>
                  <th>Monto</th>
                  <th>Interés</th>
                  <th>Cuotas</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.length === 0 ? (
                  <tr>
                    <td className="empty-state" colSpan="7">No hay préstamos registrados.</td>
                  </tr>
                ) : (
                  prestamos.map((prestamo) => (
                    <tr key={prestamo.id_prestamo}>
                      <td>{prestamo.id_prestamo}</td>
                      <td>{prestamo.socio}</td>
                      <td className="movement-amount">{formatMoney(prestamo.monto)}</td>
                      <td>{prestamo.interes}%</td>
                      <td>{prestamo.cuotas}</td>
                      <td>{prestamo.fecha}</td>
                      <td>
                        <span className={`status-badge ${prestamo.estado === "Aprobado" || prestamo.estado === "Pagado" ? "status-completed" : "status-pending"}`}>
                          {prestamo.estado}
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

export default Prestamos;
