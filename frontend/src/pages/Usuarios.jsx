import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient.js";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    usuario: "",
    clave: "",
    rol: "administrador",
    activo: "1",
  });
  const [error, setError] = useState("");

  async function cargarUsuarios() {
    const data = await apiRequest("/usuarios.php");
    setUsuarios(data.usuarios || []);
  }

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const data = await apiRequest("/usuarios.php");

        if (activo) {
          setUsuarios(data.usuarios || []);
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
      await apiRequest("/usuarios.php", {
        method: "POST",
        body: JSON.stringify(formulario),
      });
      setFormulario({
        nombre: "",
        usuario: "",
        clave: "",
        rol: "administrador",
        activo: "1",
      });
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="module-page">
      <header className="dashboard-welcome">
        <div>
          <h1>Gestión de usuarios</h1>
          <p>Administración de accesos y perfiles del sistema.</p>
        </div>
        <span className="dashboard-date">Usuarios</span>
      </header>

      <section className="dashboard-stats module-stats">
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">US</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Usuarios registrados</p>
            <p className="stat-card-value">{usuarios.length}</p>
            <span className="stat-card-detail">Cuentas activas e inactivas</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-card-symbol" aria-hidden="true">AC</div>
          <div className="stat-card-content">
            <p className="stat-card-title">Activos</p>
            <p className="stat-card-value">{usuarios.filter((usuario) => Number(usuario.activo) === 1).length}</p>
            <span className="stat-card-detail">Con acceso habilitado</span>
          </div>
        </article>
      </section>

      <div className="dashboard-grid module-grid">
        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Crear usuario</h2>
              <p>Registra accesos administrativos para la plataforma.</p>
            </div>
          </header>

          <form className="module-form-grid" onSubmit={handleSubmit}>
            <input className="form-input" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre completo" required />
            <input className="form-input" name="usuario" value={formulario.usuario} onChange={handleChange} placeholder="Nombre de usuario" required />
            <input className="form-input" name="clave" type="password" value={formulario.clave} onChange={handleChange} placeholder="Contraseña" required />
            <select className="form-input" name="rol" value={formulario.rol} onChange={handleChange}>
              <option value="administrador">Administrador</option>
              <option value="operador">Operador</option>
              <option value="consulta">Consulta</option>
            </select>
            <select className="form-input" name="activo" value={formulario.activo} onChange={handleChange}>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
            <button className="btn-primary module-submit" type="submit">Guardar usuario</button>
          </form>

          {error && <p className="login-server-error">{error}</p>}
        </section>

        <section className="dashboard-section">
          <header className="dashboard-section-header">
            <div>
              <h2>Listado de usuarios</h2>
              <p>Cuentas disponibles en la base de datos.</p>
            </div>
          </header>

          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td className="empty-state" colSpan="5">No hay usuarios registrados.</td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                      <td>{usuario.id_usuario}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.usuario}</td>
                      <td>{usuario.rol}</td>
                      <td>
                        <span className={`status-badge ${Number(usuario.activo) === 1 ? "status-completed" : "status-pending"}`}>
                          {Number(usuario.activo) === 1 ? "Activo" : "Inactivo"}
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

export default Usuarios;
