import { useState } from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";

import useAuth from "../hooks/useAuth.js";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    autenticado,
    cargandoSesion,
    iniciarSesion,
  } = useAuth();

  const [formulario, setFormulario] = useState({
    usuario: "",
    clave: "",
  });

  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] =
    useState("");

  const [enviando, setEnviando] = useState(false);

  const rutaDestino =
    location.state?.from?.pathname || "/dashboard";

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

    setErrorServidor("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.usuario.trim()) {
      nuevosErrores.usuario =
        "Debe ingresar el nombre de usuario.";
    }

    if (!formulario.clave.trim()) {
      nuevosErrores.clave =
        "Debe ingresar la contraseña.";
    }

    return nuevosErrores;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setErrorServidor("");
    setEnviando(true);

    try {
      await iniciarSesion(formulario);

      navigate(rutaDestino, {
        replace: true,
      });
    } catch (error) {
      setErrorServidor(
        error.message ||
          "No fue posible iniciar sesión.",
      );
    } finally {
      setEnviando(false);
    }
  };

  if (cargandoSesion) {
    return (
      <main className="auth-loading">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  if (autenticado) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div
            className="login-logo"
            aria-hidden="true"
          >
            EC
          </div>

          <h1>Emprendicoop</h1>

          <p>
            Sistema web para la gestión de socios,
            ahorros, préstamos, pagos y reportes
            administrativos.
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <header className="login-card-header">
            <h2>Iniciar sesión</h2>

            <p>
              Ingrese sus credenciales para acceder al
              sistema.
            </p>
          </header>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-group">
              <label
                className="form-label"
                htmlFor="usuario"
              >
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
                disabled={enviando}
              />

              {errores.usuario && (
                <p className="form-error">
                  {errores.usuario}
                </p>
              )}
            </div>

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="clave"
              >
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
                disabled={enviando}
              />

              {errores.clave && (
                <p className="form-error">
                  {errores.clave}
                </p>
              )}
            </div>

            {errorServidor && (
              <p
                className="login-server-error"
                role="alert"
              >
                {errorServidor}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary login-submit"
              disabled={enviando}
            >
              {enviando
                ? "Verificando..."
                : "Iniciar sesión"}
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