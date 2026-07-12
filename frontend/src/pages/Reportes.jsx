import { useEffect, useState } from "react";
import { apiRequest, formatMoney } from "../services/apiClient.js";
import "./Reportes.css";

function Reportes() {
  const [datos, setDatos] = useState({
    resumen: {},
    movimientos: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/reportes.php")
      .then((data) => setDatos(data))
      .catch((err) => setError(err.message));
  }, []);

  const resumen = datos.resumen || {};
  const movimientos = datos.movimientos || [];

  return (
    <section className="reportes-page">
      <div className="reportes-header">
        <div>
          <p className="reportes-subtitle">COOEMPRENDI</p>
          <h1>Reportes Generales</h1>
          <p className="reportes-descripcion">
            Resumen de préstamos, pagos y movimientos del sistema.
          </p>
        </div>
      </div>

      {error && <p className="login-server-error">{error}</p>}

      <div className="tarjetas-reportes">
        <article className="tarjeta-reporte">
          <span>Total prestado</span>
          <strong>{formatMoney(resumen.total_prestado)}</strong>
        </article>
        <article className="tarjeta-reporte">
          <span>Total pagado</span>
          <strong>{formatMoney(resumen.total_pagado)}</strong>
        </article>
        <article className="tarjeta-reporte">
          <span>Préstamos aprobados</span>
          <strong>{resumen.prestamos_aprobados || 0}</strong>
        </article>
        <article className="tarjeta-reporte">
          <span>Préstamos pendientes</span>
          <strong>{resumen.prestamos_pendientes || 0}</strong>
        </article>
        <article className="tarjeta-reporte">
          <span>Socios registrados</span>
          <strong>{resumen.socios_registrados || 0}</strong>
        </article>
        <article className="tarjeta-reporte">
          <span>Pagos registrados</span>
          <strong>{resumen.pagos_registrados || 0}</strong>
        </article>
      </div>

      <section className="tabla-reporte-card">
        <h2>Movimientos recientes</h2>
        <div className="tabla-contenedor">
          <table className="tabla-reportes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Socio</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td className="empty-state" colSpan="6">No hay movimientos para mostrar.</td>
                </tr>
              ) : (
                movimientos.map((movimiento, index) => (
                  <tr key={`${movimiento.tipo}-${movimiento.id}-${index}`}>
                    <td>{movimiento.id}</td>
                    <td>{movimiento.socio}</td>
                    <td>{movimiento.tipo}</td>
                    <td>{formatMoney(movimiento.monto)}</td>
                    <td>{movimiento.fecha}</td>
                    <td>
                      <span className={`estado-reporte ${String(movimiento.estado).toLowerCase()}`}>
                        {movimiento.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default Reportes;
