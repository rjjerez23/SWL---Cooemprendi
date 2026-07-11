import { useState } from "react";
import "../styles/login.css";

function Login() {
  const [formulario, setFormulario] = useState({
    usuario: "",
    clave: "",
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }));

    setErrores((erroresAnteriores) => ({
      ...erroresAnteriores,
      [name]: "",
    }));

    setMensaje("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.usuario.trim()) {
      nuevosErrores.usuario = "Debe ingresar el nombre de usuario.";
    }

    if (!formulario.clave.trim()) {
      nuevosErrores.clave = "Debe ingresar la contraseña.";
    }

    return nuevosErrores;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      return;
    }

    setErrores({});
    setMensaje(
      "Formulario validado correctamente. Falta conectarlo con el backend PHP.",
    );
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-logo" aria-hidden="true">
            EC
          </div>

          <h1>Emprendicoop</h1>

          <p>
            Sistema web para la gestión de socios, ahorros, préstamos,
            pagos y reportes administrativos.
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <header className="login-card-header">
            <h2>Iniciar sesión</h2>
            <p>Ingrese sus credenciales para acceder al sistema.</p>
          </header>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-group">
              <label className="form-label" htmlFor="usuario">
                Usuario
              </label>

              <input
                id="usuario"
                name="usuario"
                type="text"
                className={`form-input ${
                  errores.usuario ? "input-error" : ""
                }`}
                value={formulario.usuario}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Ingrese su usuario"
                aria-invalid={Boolean(errores.usuario)}
                aria-describedby={
                  errores.usuario ? "usuario-error" : undefined
                }
              />

              {errores.usuario && (
                <p id="usuario-error" className="form-error">
                  {errores.usuario}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="clave">
                Contraseña
              </label>

              <input
                id="clave"
                name="clave"
                type="password"
                className={`form-input ${
                  errores.clave ? "input-error" : ""
                }`}
                value={formulario.clave}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Ingrese su contraseña"
                aria-invalid={Boolean(errores.clave)}
                aria-describedby={
                  errores.clave ? "clave-error" : undefined
                }
              />

              {errores.clave && (
                <p id="clave-error" className="form-error">
                  {errores.clave}
                </p>
              )}
            </div>

            {mensaje && <p className="login-message">{mensaje}</p>}

            <button
              type="submit"
              className="btn-primary login-submit"
            >
              Iniciar sesión
            </button>
          </form>

          <footer className="login-footer">
            Cooperativa Emprendicoop
          </footer>
        </div>
      </section>
    </main>
  );
}

export default Login;