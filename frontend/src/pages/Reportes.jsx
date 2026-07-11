import "./Reportes.css";

function Reportes() {
  const movimientos = [
    {
      id: 1,
      socio: "Juan Pérez",
      tipo: "Pago",
      monto: "RD$ 2,000",
      fecha: "01/07/2026",
      estado: "Completado",
    },
    {
      id: 2,
      socio: "María López",
      tipo: "Préstamo",
      monto: "RD$ 25,000",
      fecha: "02/07/2026",
      estado: "Pendiente",
    },
    {
      id: 3,
      socio: "Carlos Rodríguez",
      tipo: "Pago",
      monto: "RD$ 1,500",
      fecha: "03/07/2026",
      estado: "Completado",
    },
    {
      id: 4,
      socio: "Ana Martínez",
      tipo: "Préstamo",
      monto: "RD$ 40,000",
      fecha: "04/07/2026",
      estado: "Pendiente",
    },
    {
      id: 5,
      socio: "Pedro Gómez",
      tipo: "Pago",
      monto: "RD$ 2,500",
      fecha: "05/07/2026",
      estado: "Completado",
    },
    {
      id: 6,
      socio: "Laura Fernández",
      tipo: "Pago",
      monto: "RD$ 4,000",
      fecha: "06/07/2026",
      estado: "Pendiente",
    },
    {
      id: 7,
      socio: "José Ramírez",
      tipo: "Pago",
      monto: "RD$ 3,000",
      fecha: "07/07/2026",
      estado: "Completado",
    },
    {
      id: 8,
      socio: "Sofía Castillo",
      tipo: "Préstamo",
      monto: "RD$ 50,000",
      fecha: "08/07/2026",
      estado: "Aprobado",
    },
  ];

  return (
    <section className="reportes-page">
      <div className="reportes-header">
        <div>
          <p className="reportes-subtitle">COOEMPRENDII</p>
          <h1>Reportes Generales</h1>
          <p className="reportes-descripcion">
            Resumen de préstamos, pagos y movimientos del sistema.
          </p>
        </div>

        <button className="btn-exportar">Exportar reporte</button>
      </div>

      <div className="tarjetas-reportes">
        <article className="tarjeta-reporte">
          <span>Total prestado</span>
          <strong>RD$ 210,000</strong>
        </article>

        <article className="tarjeta-reporte">
          <span>Total pagado</span>
          <strong>RD$ 27,500</strong>
        </article>

        <article className="tarjeta-reporte">
          <span>Préstamos aprobados</span>
          <strong>5</strong>
        </article>

        <article className="tarjeta-reporte">
          <span>Préstamos pendientes</span>
          <strong>3</strong>
        </article>

        <article className="tarjeta-reporte">
          <span>Socios registrados</span>
          <strong>8</strong>
        </article>

        <article className="tarjeta-reporte">
          <span>Pagos registrados</span>
          <strong>8</strong>
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
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id}>
                  <td>{movimiento.id}</td>
                  <td>{movimiento.socio}</td>
                  <td>{movimiento.tipo}</td>
                  <td>{movimiento.monto}</td>
                  <td>{movimiento.fecha}</td>
                  <td>
                    <span
                      className={`estado-reporte ${movimiento.estado.toLowerCase()}`}
                    >
                      {movimiento.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default Reportes;