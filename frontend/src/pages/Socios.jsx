import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient.js";

function Socios() {
  const [socios, setSocios] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    direccion: "",
  });
  const [error, setError] = useState("");

  async function cargarSocios() {
    const data = await apiRequest("/socios.php");
    setSocios(data.socios || []);
  }

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const data = await apiRequest("/socios.php");

        if (activo) {
          setSocios(data.socios || []);
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
      await apiRequest("/socios.php", {
        method: "POST",
        body: JSON.stringify(formulario),
      });
      setFormulario({ nombre: "", cedula: "", telefono: "", direccion: "" });
      await cargarSocios();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="module-page">
      <header className="dashboard-welcome">
        <div>
          <h1>Gestión de socios</h1>
          <p>Registro y consulta de socios.</p>
        </div>
        <span className="dashboard-date">Socios</span>
      </header>

      <section className="dashboard-stats module-stats">
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">SO</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Socios registrados</p>
            <p className="stat-card-value">{socios.length}</p>
            <span className="stat-card-detail">Total actual</span>
          </div>
        </article>
      </section>

      <div className="dashboard-grid module-grid">
        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Registrar socio</h2>
              <p>Completa los datos básicos del socio.</p>
            </div>
          </header>

          <form className="module-form-grid" onSubmit={handleSubmit}>
            <input className="form-input" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre completo" required />
            <input className="form-input" name="cedula" value={formulario.cedula} onChange={handleChange} placeholder="Cédula o ID" required />
            <input className="form-input" name="telefono" value={formulario.telefono} onChange={handleChange} placeholder="Teléfono" required />
            <input className="form-input" name="direccion" value={formulario.direccion} onChange={handleChange} placeholder="Dirección" />
            <button className="btn-primary module-submit" type="submit">Registrar socio</button>
          </form>

          {error && <p className="login-server-error">{error}</p>}
        </section>

        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Listado de socios</h2>
              <p>Socios disponibles para ahorros, préstamos y pagos.</p>
            </div>
          </header>

          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Cédula</th>
                  <th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {socios.length === 0 ? (
                  <tr>
                    <td className="empty-state" colSpan="4">No hay socios registrados.</td>
                  </tr>
                ) : (
                  socios.map((socio) => (
                    <tr key={socio.id_socio}>
                      <td>{socio.id_socio}</td>
                      <td>{socio.nombre}</td>
                      <td>{socio.cedula}</td>
                      <td>{socio.telefono}</td>
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

export default Socios;
