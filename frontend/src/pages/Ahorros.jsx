import { useEffect, useMemo, useState } from "react";
import { apiRequest, formatMoney } from "../services/apiClient.js";

function Ahorros() {
  const [socios, setSocios] = useState([]);
  const [ahorros, setAhorros] = useState([]);
  const [formulario, setFormulario] = useState({
    id_socio: "",
    monto: "",
    fecha: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState("");

  const total = useMemo(
    () => ahorros.reduce((sum, item) => sum + Number(item.monto || 0), 0),
    [ahorros],
  );

  async function cargarDatos() {
    const [sociosData, ahorrosData] = await Promise.all([
      apiRequest("/socios.php"),
      apiRequest("/ahorros.php"),
    ]);
    setSocios(sociosData.socios || []);
    setAhorros(ahorrosData.ahorros || []);
  }

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const [sociosData, ahorrosData] = await Promise.all([
          apiRequest("/socios.php"),
          apiRequest("/ahorros.php"),
        ]);

        if (activo) {
          setSocios(sociosData.socios || []);
          setAhorros(ahorrosData.ahorros || []);
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
      await apiRequest("/ahorros.php", {
        method: "POST",
        body: JSON.stringify(formulario),
      });
      setFormulario({
        id_socio: "",
        monto: "",
        fecha: new Date().toISOString().slice(0, 10),
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
          <h1>Gestión de ahorros</h1>
          <p>Registro y consulta de ahorros.</p>
        </div>
        <span className="dashboard-date">Ahorros</span>
      </header>

      <section className="dashboard-stats module-stats">
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">AH</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Total en ahorros</p>
            <p className="stat-card-value">{formatMoney(total)}</p>
            <span className="stat-card-detail">Monto acumulado</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">RE</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Registros</p>
            <p className="stat-card-value">{ahorros.length}</p>
            <span className="stat-card-detail">Aportes guardados</span>
          </div>
        </article>
      </section>

      <div className="dashboard-grid module-grid">
        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Registrar ahorro</h2>
              <p>Selecciona el socio, monto y fecha del aporte.</p>
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
            <input className="form-input" name="fecha" type="date" value={formulario.fecha} onChange={handleChange} required />
            <button className="btn-primary module-submit" type="submit">Registrar ahorro</button>
          </form>

          {error && <p className="login-server-error">{error}</p>}
        </section>

        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Listado de ahorros</h2>
              <p>Historial de aportes registrados en el sistema.</p>
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
                </tr>
              </thead>
              <tbody>
                {ahorros.length === 0 ? (
                  <tr>
                    <td className="empty-state" colSpan="4">No hay ahorros registrados.</td>
                  </tr>
                ) : (
                  ahorros.map((ahorro) => (
                    <tr key={ahorro.id_ahorro}>
                      <td>{ahorro.id_ahorro}</td>
                      <td>{ahorro.socio}</td>
                      <td className="movement-amount">{formatMoney(ahorro.monto)}</td>
                      <td>{ahorro.fecha}</td>
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

export default Ahorros;
